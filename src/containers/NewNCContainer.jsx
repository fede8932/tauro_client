import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'qrcode';
import {
  getAcountById,
  getMovementsByCurrentAcountId,
  getMovementsByCurrentAcountIdX,
} from '../redux/searchCurrentAcount';
import logoBlase from '../assets/logo/logoBlase.png';
import {
  convertImageToBase64,
  cuitTransformToNumber,
  filterOrdersId,
  redondearADosDecimales,
  waitForImagesToLoad,
} from '../utils';
import Swal from 'sweetalert2';
import { NewNCSellOrderRequest } from '../redux/searchOrders';
import {
  printNCByNumRequest,
  printNCPresByNumRequest,
} from '../request/orderRequest';
import { ncAHtml } from '../templates/ncA';
import { ncPresupHtml } from '../templates/ncPresupBlase';
import NewNotaCredito from '../components/newNotaCredito/NewNotaCredito';
import { productClientRequest } from '../redux/productsByClient';
import { getBillItems, marcBillItem, resetBillItems } from '../redux/billItems';

function NewNCContainer(props) {
  const [selectState, setSelectState] = useState('');
  const [factAsoc, setFactAsoc] = useState('');
  const [selectMotivState, setSelectMotivState] = useState('');
  const [selectTypeState, setSelectTypeState] = useState('nc');
  const itemList = useSelector((state) => state.productsByClient);
  const { currentAcountId, acountState, ...rest } = props;

  // console.log(itemList);

  const searchBillItems = (e) => {
    setFactAsoc(e.target.value);
    dispatch(
      getBillItems({
        currentAcountId: currentAcountId,
        factNumber: e.target.value,
        oficial: selectTypeState == 'nc' ? 'True' : 'False',
      })
    );
  };

  const billData = useSelector((state) => state.billItems).data;
  const filterMovements = useSelector((state) => state.filterMovementsOrder);

  const listMov = acountState.data.movements.list.filter((mov) => mov.marc);
  const dispatch = useDispatch();
  const methods = useForm();
  const [checked, setChecked] = useState(false);
  const marcToggle = (id) => {
    dispatch(marcBillItem(id));
  };
  const saveMoviment = (data) => {
    // console.log(data);
    // return;
    const { motive, type, numFact, concept, montoNota } = data;
    let facAsos = numFact ?? factAsoc;
    const monto = billData?.fItems.reduce((acum, item) => {
      if (item.marc) {
        return acum + item.sellPrice * item.amount;
      }
      return acum;
    }, 0);
    const endAmount = motive == 'n' ? montoNota : monto;
    // console.log(motive, type, monto);
    //selectMotivState es "g" o "d" si es g no toca el stock si es d modifica el stock
    const montoOfNC = type == 'nc' ? endAmount : 0;
    const montoPrNC = type == 'ncp' ? endAmount : 0;
    // console.log(montoOfNC,montoPrNC)
    newNotaCredito(
      montoOfNC,
      montoPrNC,
      motive,
      facAsos,
      billData?.fItems,
      concept?.toUpperCase(),
      type
    );
    return;
  };

  const printNC = async (res, totalNCO, totalNCP, items, concept) => {
    const { numComp, client, products } = res;
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    const nuevaVentana = window.open('', '', 'width=900,height=1250');
    // Obtener datos de la factura
    if (totalNCO > 0) {
      const ncData = await printNCByNumRequest(numComp, currentAcountId);
      const codigoQR = await QRCode.toDataURL(ncData.url);

      items = items?.filter((i) => i.marc);
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(items?.length / itemsPerPage);

      for (
        let i = 0;
        i < (items?.length > 0 ? items?.length : 1);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems =
          items?.length > 0 ? items?.slice(i, i + itemsPerPage) : [];

        const render = ncAHtml(
          ncData.billData.ResultGet,
          client,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          concept
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (totalNCP > 0) {
      // console.log("llega ok pres");
      const presData = await printNCPresByNumRequest(numComp);
      if (selectMotivState != 'n') {
        items = items.filter((i) => i.marc);
        const itemsPerPage = 10; // Número de ítems por página
        const totalPages = Math.ceil(items.length / itemsPerPage);

        for (let i = 0; i < items.length; i += itemsPerPage) {
          const pageNumber = Math.floor(i / itemsPerPage) + 1;
          const pageItems = items.slice(i, i + itemsPerPage);

          const render = ncPresupHtml(
            presData,
            res.client,
            pageItems,
            pageNumber,
            totalPages,
            logoBlaseBase64
          );

          const containerPres = nuevaVentana.document.createElement('div');
          nuevaVentana.document.body.appendChild(containerPres);

          containerPres.innerHTML = render;
          nuevaVentana.document.body.appendChild(
            nuevaVentana.document.createElement('div')
          ).style.pageBreakBefore = 'always';
        }
      } else {
        const render = ncPresupHtml(
          presData,
          res.client,
          [],
          1,
          1,
          logoBlaseBase64,
          concept
        );

        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
      }
    }

    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const newNotaCredito = (
    montoOfNC,
    montoPrNC,
    motive,
    numFact,
    items,
    concept,
    type
  ) => {
    if (typeof montoOfNC === 'string') {
      montoOfNC = Number(montoOfNC.replace(/,/g, '.'));
    }
    if (typeof montoPrNC === 'string') {
      montoPrNC = Number(montoPrNC.replace(/,/g, '.'));
    }
    // console.log(montoOfNC, montoPrNC, motive);
    const facturaType = type !== "ncp" ? 
      acountState.data.currentAcount.client.iva == 'Monotributista'
        ? 'NCB'
        : 'NCA' : "NCP";
    let sendData = {
      concept: concept,
      currentAcountId: currentAcountId,
      concepto: 'Productos',
      type: 'NotaCredito',
      tipo_de_factura: facturaType,
      tipo_de_documento: 'CUIT',
      numero_de_documento: cuitTransformToNumber(
        acountState.data.currentAcount.client.cuit
      ),
      importe_gravado: redondearADosDecimales(montoOfNC),
      importe_excento: 0,
      // purchaseOrderId: itemList.data[0].purchaseOrderId,
      salePoint: 1,
      iva: 21,
      importe_no_facturado: montoPrNC,
      motivo: motive == 'g' ? 'Garantia' : 'Devolucion',
      articles:
        motive == 'n'
          ? []
          : billData.fItems
              ?.filter((item) => item.marc)
              .map((item) => ({ id: item.productId, cant: item.amount })),
    };
    if (numFact) {
      let numberFact = Number(numFact);
      if (!isNaN(numberFact)) {
        sendData.numFactAsoc = numberFact;
      } else {
        console.log(
          'el string Numero de factura no se puede convertir a un número.'
        );
      }
    }

    sendData.productsId = [];
    motive == 'n'
      ? null
      : billData.fItems.map((i) => {
          if (i.marc) {
            sendData.productsId.push(i.productId);
          }
        });
    dispatch(NewNCSellOrderRequest(sendData)).then((res) => {
      // console.log("res", res);
      printNC(res.payload, montoOfNC, montoPrNC, items, concept);
      rest.closeModal();
      dispatch(getMovementsByCurrentAcountIdX(filterMovements));
      // dispatch(getAcountById(currentAcountId))
      //   .then(() => {
      //     // dispatch(
      //     //   getMovementsByCurrentAcountId({
      //     //     currentAcountId: currentAcountId,
      //     //     rows: 10,
      //     //     page: 1,
      //     //     pendingFilter: true,
      //     //   })
      //     // )
      //     dispatch(getMovementsByCurrentAcountIdX(filterMovements))
      //       .then(() => {
      //         // console.log("ok");
      //       })
      //       .catch((err) => console.log(err));
      //   })
      //   .catch((err) => console.log(err));
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'No facturado',
          text: 'Ocurrió un error en el servidor',
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      }
    });
  };

  const searchFn = (e) => {
    dispatch(
      productClientRequest({
        currentAcountId: currentAcountId,
        text: e.target.value,
      })
    );
  };

  // useEffect(() => {
  //   dispatch(getOrderItemsRequest(filterOrdersId(listMov)[0]));
  //   return () => {
  //     dispatch(resetStatusRequest);
  //   };
  // }, []);
  useEffect(() => {
    dispatch(productClientRequest({ currentAcountId: currentAcountId }));
  }, []);

  useEffect(() => {
    dispatch(
      getBillItems({
        currentAcountId: currentAcountId,
        factNumber: '',
        oficial: selectTypeState == 'nc' ? 'True' : 'False',
      })
    );
    return () => {
      dispatch(resetBillItems(null));
    };
  }, [selectTypeState]);
  return (
    <NewNotaCredito
      {...rest}
      listMov={listMov}
      methods={methods}
      onSubmit={saveMoviment}
      selectState={selectState}
      setSelectState={setSelectState}
      selectMotivState={selectMotivState}
      setSelectMotivState={setSelectMotivState}
      setChecked={setChecked}
      checked={checked}
      itemList={itemList}
      marcToggle={marcToggle}
      searchFn={searchFn}
      selectTypeState={selectTypeState}
      setSelectTypeState={setSelectTypeState}
      searchBillItems={searchBillItems}
    />
  );
}

export default NewNCContainer;
