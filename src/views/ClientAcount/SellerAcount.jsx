import React, { useEffect, useState } from 'react';
import styles from './sellerAcount.module.css';
import SellerAcountContainer from '../../containers/SellerAcount';
import { useDispatch, useSelector } from 'react-redux';
import { comitionResume } from '../../templates/comitionsResume';
import { Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { redondearADosDecimales } from '../../utils';
import { newLiquidation } from '../../redux/sellerLiquidations';
import { useLocation } from 'react-router';
import { resetMarc } from '../../redux/sellerResume';
import { TabPane, Tab } from 'semantic-ui-react';
import SellerLiquidationContainer from '../../containers/SellerLiquidationContainer';
import { getResumeLiquidation } from '../../request/sellerRequest';

function SellerMovements(props) {
  const { setEnabledLiq } = props;
  const resume = useSelector((state) => state.sellerResume);

  useEffect(() => {
    resume.data.registros.map((reg) => {
      const shouldDisable = resume.data.registros.some(
        (reg) => reg.marc && !reg.liquidada
      );
      setEnabledLiq(!shouldDisable);
    });
  }, [resume]);

  return <SellerAcountContainer />;
}

function SellerLiquidation(props) {
  const { setEnabledLiq, printResume } = props;
  const resume = useSelector((state) => state.sellerResume);

  useEffect(() => {
    resume.data.registros.map((reg) => {
      const shouldDisable = resume.data.registros.some(
        (reg) => reg.marc && !reg.liquidada
      );
      setEnabledLiq(!shouldDisable);
    });
  }, [resume]);

  return <SellerLiquidationContainer printResume={printResume} />;
}

const SellerAcount = () => {
  const [enabledLiq, setEnabledLiq] = useState(true);
  const resume = useSelector((state) => state.sellerResume);

  const panes = [
    {
      menuItem: 'Movimientos',
      render: () => (
        <TabPane
          attached={false}
          style={{ border: 'none', boxShadow: 'none', marginTop: '-20px' }}
        >
          <SellerMovements setEnabledLiq={setEnabledLiq} />
        </TabPane>
      ),
    },
    {
      menuItem: 'Liquidaciones',
      render: () => (
        <TabPane
          attached={false}
          style={{ border: 'none', boxShadow: 'none', marginTop: '-20px' }}
        >
          <SellerLiquidation
            setEnabledLiq={setEnabledLiq}
            printResume={printResume}
          />
        </TabPane>
      ),
    },
  ];
  const dispatch = useDispatch();
  const sellerId = Number(useLocation().pathname.split('/')[3]);

  const printResume = async (liqId, detail) => {
    const liquidations = await getResumeLiquidation({ liqId: liqId });
    // console.log(liquidations);
    const nuevaVentana = window.open('', '', 'width=900,height=1250');

    if (detail) {
      const itemsPerPage = 18;
      const totalPages = Math.ceil(
        liquidations.registros.length / itemsPerPage
      );
      for (let i = 0; i < liquidations.registros.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = liquidations.registros.slice(i, i + itemsPerPage);
        const containerRem = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerRem);
        containerRem.innerHTML = comitionResume(
          liquidations,
          pageItems,
          pageNumber,
          totalPages
        );
        if (i > 0) {
          nuevaVentana.document.body.appendChild(
            nuevaVentana.document.createElement('div')
          ).style.pageBreakBefore = 'always';
        }
      }
    } else {
      liquidations.registros = [];
      console.log(liquidations);
      const containerRem = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerRem);
      containerRem.innerHTML = comitionResume(liquidations, [], 1, 1);
    }
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const genLiquidation = () => {
    Swal.fire({
      title: 'Estás seguro?',
      text: `Vas a generar un pago por $ ${redondearADosDecimales(
        resume?.data?.selectComision
      )}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Generar',
    })
      .then((result) => {
        if (result.isConfirmed) {
          let movId = [];
          resume.data?.registros?.map((reg) => {
            // console.log(reg);
            if (reg.marc && !reg.liquidada) {
              movId.push(reg.id);
            }
          });
          dispatch(
            newLiquidation({ sellerId: sellerId, movementIdList: movId })
          ).then((res) => {
            if (res.error?.message) {
              Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: `${res.error.message}`,
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 2500,
              });
            } else {
              dispatch(resetMarc(movId));
              setEnabledLiq(true);
              Swal.fire({
                title: 'Exito',
                text: 'Se ha generado el reporte de pago con exito',
                icon: 'success',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 1000,
              });
            }
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: `Ocurrio un error en el cliente`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
  };
  return (
    <div className={styles.addUserContainer}>
      <div className={styles.titleCont}>
        <h6 className={styles.formTitle}>Registro de ventas</h6>
        <div className={styles.pickerCont}>
          <Button
            disabled={enabledLiq}
            style={{ margin: '0px 5px' }}
            type="button"
            onClick={genLiquidation}
          >
            Liquidar
          </Button>
        </div>
      </div>
      <Tab menu={{ text: true }} panes={panes} style={{ marginTop: '-35px' }} />
    </div>
  );
};

export default SellerAcount;
