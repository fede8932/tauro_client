import { Radio } from 'semantic-ui-react';
import styles from './finishSell.module.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import {
  finishSellPosAsync,
  resetPosSellOrderState,
} from '../../redux/sellPosOrder';

function FinishSellComponent(props) {
  const { closeModal } = props;

  const dispatch = useDispatch();

  const { loading, billData } = useSelector((state) => state.posSellOrder);

  const { payMethod, order } = props;
  const [tipoFactura, setTipoFactura] = useState(0);
  const [op, setOp] = useState('');
  const [bank, setBank] = useState('');

  const selecTipoFactura = (tipo) => {
    setTipoFactura(tipo);
  };

  const facturar = async () => {
    const sendData = {
      clientId: order.clientId,
      items: order.items,
      billType: tipoFactura,
      payMethod: Object.entries(payMethod).find(
        ([key, value]) => value.enabled === true
      )?.[1].value,
    };

    if (sendData.payMethod === 2) {
      if (op === '' || bank === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe completar el número de operación y el banco',
        });
        return;
      }
      sendData.op = op;
      sendData.bank = bank;
    }

    dispatch(finishSellPosAsync(sendData))
      .then(async (res) => {
        if (res.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al facturar: ${res.error.message}`,
          });
          return;
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Venta registrada correctamente',
        });
        
        dispatch(resetPosSellOrderState());
        closeModal();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al facturar: ${err.message}`,
        });
        return;
      });
  };

  return (
    <div className={styles.newBillContainer}>
      <div className={styles.billTypeContainer}>
        <p>
          <i className="fa-solid fa-file-invoice"></i>
          <span>Tipo de Factura</span>
        </p>
        <Radio
          className={styles.radio}
          label="Factura X"
          value={tipoFactura}
          checked={tipoFactura === 0}
          onChange={() => selecTipoFactura(0)}
        />
      </div>
      {payMethod.Transferencia.enabled && (
        <div className={styles.billTypeContainer}>
          <p>
            <i className="fa-solid fa-building-columns"></i>
            <span>Datos de transferencia</span>
          </p>
          <div className={styles.inputCont}>
            <label>Número de operación</label>
            <input value={op} onChange={(e) => setOp(e.target.value)} />
          </div>
          <div className={styles.inputCont}>
            <label>Banco</label>
            <input value={bank} onChange={(e) => setBank(e.target.value)} />
          </div>
        </div>
      )}
      <Button
        disabled={loading}
        style={{ width: '100%' }}
        variant="success"
        onClick={facturar}
      >
        {loading ? 'Procesando...' : 'Facturar'}
      </Button>
    </div>
  );
}

export default FinishSellComponent;
