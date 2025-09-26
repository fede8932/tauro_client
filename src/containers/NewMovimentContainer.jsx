import React, { useCallback, useEffect, useState } from 'react';
import NewMoviment from '../components/newMoviment/NewMoviment';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPayToCurrentAcount,
  getMovementsByCurrentAcountIdX,
} from '../redux/searchCurrentAcount';
import {
  convertImageToBase64,
  convertirStringANumero,
  filterMovsId,
  numberToString,
  obtenerIds,
  redondearADosDecimales,
  waitForImagesToLoad,
} from '../utils';
import Swal from 'sweetalert2';
import {
  getAllMovNoApplyRequest,
  marcToggleNoApplyRequest,
  resetMovNoApplyRequest,
} from '../redux/movNoApply';
import { payDetail } from '../templates/payDetail';
import logoBlase from '../assets/logo/logoBlase.png';
import { addCancelToCurrentAcount } from '../request/currentAcountRequest';

function NewMovimientContainer(props) {
  const [inactive, setInactive] = useState(false);
  const [parcial, setParcial] = useState(false);
  const [cantTransf, setCantTransf] = useState(1);
  //Estado de activación de métodos de pago
  const [payMethod, setPayMethod] = useState({
    efectivo: true,
    cheque: false,
    transferencia: false,
  });

  //
  const [payChDate, setPayChDate] = useState([
    {
      fecha: new Date().toISOString(),
      fechaCobro: null,
    },
  ]);

  const changePayMethod = (name) => {
    let newPayMethod = { ...payMethod };
    newPayMethod[name] = !newPayMethod[name];
    //Si todas las propiedades son false no hago nada
    if (!Object.values(newPayMethod).every((value) => !value)) {
      setPayMethod(newPayMethod);
    }
  };

  // console.log(method);
  const itemList = useSelector((state) => state.listOrderItems);
  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  const { currentAcountId, acountState, ...rest } = props;
  // console.log(acountState);
  const listNcNoApply = useSelector((state) => state.movNoApply);
  // console.log(listNcNoApply);

  const listMov = acountState.data.movements.list.filter((mov) => mov.marc);
  const listNoApplyMarc = listNcNoApply.data.filter((noApply) => noApply.marc);

  const [checked, setChecked] = useState(false);

  const max = useCallback(
    () =>
      numberToString(
        checked
          ? (listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) -
              listNcNoApply.montoTotal) *
              (1 - 0.06)
          : listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) -
              listNcNoApply.montoTotal
      ),
    [listMov]
  );

  const dispatch = useDispatch();
  const methods = useForm();

  const marcToggle = (movId) => {
    // console.log(movId);
    dispatch(marcToggleNoApplyRequest(movId));
  };

  const saveMoviment = (data) => {
    let pcdLap = 0;
    //Acá lanzamos error cuando hay problemas con las fechas
    while (pcdLap < payChDate.length) {
      if (
        payChDate[pcdLap].fecha == null ||
        (payChDate[pcdLap].fechaCobro == null && payMethod.cheque)
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La fecha seleccionada es incorrecta',
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
        return;
      }
      pcdLap++;
    }

    // setInactive(true); // Esto es para desacrtivar el boton de submit

    let dataCheque = { active: payMethod.cheque, cheques: [] };

    let efectivoImplito = convertirStringANumero(max());

    // console.log(payChDate)
    for (let i = 0; i < payChDate.length; i++) {
      dataCheque.active = payMethod.cheque;
      const cheqData = {
        date: payChDate[i].fecha,
        efectiveDate: payChDate[i].fechaCobro,
        entidad: data[`chBanco-${i}`],
        importe: convertirStringANumero(data[`chImporte-${i}`]),
        numero: data[`numCheque-${i}`],
      };
      dataCheque.cheques.push(cheqData);

      efectivoImplito -= dataCheque.active ? cheqData.importe : 0;
    }

    let dataTran = { active: payMethod.transferencia, trans: [] };

    for (let i = 0; i < cantTransf; i++) {
      dataTran.active = payMethod.transferencia;
      const bankData = {
        numOperation: data[`numOperation-${i}`],
        entidad: data[`trBanco-${i}`],
        importe: convertirStringANumero(data[`trImporte-${i}`]),
      };
      dataTran.trans.push(bankData);

      efectivoImplito -= dataTran.active ? bankData.importe : 0;
    }
    const efectiveData = {
      active: payMethod.efectivo,
      importe: parcial
        ? convertirStringANumero(data.efImporte)
        : efectivoImplito,
    };

    if (efectivoImplito < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El monto total no puede superar el saldo máximo',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
      return;
    }

    let totalPay = efectiveData.active ? efectiveData.importe : 0;
    totalPay = dataTran.active
      ? dataTran.trans.reduce((acum, tran) => acum + tran.importe, totalPay)
      : totalPay;
    totalPay = dataCheque.active
      ? dataCheque.cheques.reduce(
          (acum, cheque) => acum + cheque.importe,
          totalPay
        )
      : totalPay;

    let saldoPend =
      redondearADosDecimales(
        listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0)
      ) - listNcNoApply.montoTotal;
    // return;
    saldoPend = checked ? saldoPend * (1 - 0.06) : saldoPend;
    if (saldoPend < totalPay) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El importe no puede superar el saldo pendiente',
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
      setInactive(false);
      return;
    }
    const payData = {
      totalPay: totalPay,
      inTermDiscount: checked,
      parcial: parcial,
      pay: {
        dataTran: dataTran.active ? dataTran.trans : [],
        dataCheque: dataCheque.active ? dataCheque.cheques : [],
        dataEfective: efectiveData.active ? efectiveData.importe : 0,
      },
      billIdList: filterMovsId(listMov),
      discount: checked,
      ncIdList: obtenerIds(listNoApplyMarc),
      comprobanteVendedor: data.comprobanteVendedor,
    };
    // console.log(payData);
    // return;
    dispatch(addPayToCurrentAcount(payData))
      .then((res) => {
        const { payload } = res;
        // console.log(payload);
        dispatch(getMovementsByCurrentAcountIdX(filterMovements)).then(() => {
          setInactive(false);
          rest.closeModal();
        });
        if (!payload) {
        } else {
          printPayDetail(acountState.data?.currentAcount?.client, payload);
        }
      })
      .catch(() => {
        setInactive(false);
      });
  };

  const printPayDetail = async (client, payData) => {
    const nuevaVentana = window.open('', '', 'width=900,height=625');
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const containerRem = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(containerRem);
    containerRem.innerHTML = payDetail(client, payData, logoBlaseBase64);
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const cancelFactFn = () => {
    setInactive(true);
    const payData = {
      billIdList: filterMovsId(listMov),
      ncIdList: obtenerIds(listNoApplyMarc),
    };
    addCancelToCurrentAcount(payData)
      .then((res) => {
        rest.closeModal();

        setInactive(false);
      })
      .catch(() => setInactive(false));
  };

  useEffect(() => {
    dispatch(getAllMovNoApplyRequest(currentAcountId));
    return () => {
      dispatch(resetMovNoApplyRequest());
    };
  }, []);

  const toggleParcial = () => {
    setParcial(!parcial);
  };

  return (
    <NewMoviment
      {...rest}
      setPayChDate={setPayChDate}
      payChDate={payChDate}
      listMov={listMov}
      listNcNoApply={listNcNoApply}
      methods={methods}
      onSubmit={saveMoviment}
      setChecked={setChecked}
      checked={checked}
      itemList={itemList}
      marcToggle={marcToggle}
      cancelFactFn={cancelFactFn}
      inactive={inactive}
      payMethod={payMethod}
      changePayMethod={changePayMethod}
      cantTransf={cantTransf}
      setCantTransf={setCantTransf}
      parcial={parcial}
      setParcial={setParcial}
      toggleParcial={toggleParcial}
      max={max}
    />
  );
}

export default NewMovimientContainer;
