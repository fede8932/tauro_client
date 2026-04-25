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
import { printPosBill } from '../../utils/printPosBill';

function FinishSellComponent(props) {
  const { closeModal } = props;

  const dispatch = useDispatch();

  const { loading, billData } = useSelector((state) => state.posSellOrder);
  const selectClient = useSelector((state) => state.client.selectClient);

  const { payMethod, order } = props;
  const [tipoFactura, setTipoFactura] = useState(0);
  const [op, setOp] = useState('');
  const [bank, setBank] = useState('');
  const [dni, setDni] = useState('');

  const isConsumidorFinal = (order?.razonSocial || '').toLowerCase() === 'consumidor final';
  const clientIva = selectClient?.iva || '';
  const isMonotributista = clientIva.toLowerCase() === 'monotributista';
  const isResponsableInscripto = clientIva.toLowerCase() === 'responsable inscripto';
  
  const total = (order?.subTotal || 0) * 1.21;
  const requiresDni = isConsumidorFinal && tipoFactura === 1 && total >= 10000000;

  // Determinar el tipo de factura oficial según el IVA del cliente
  // Factura B (6) para Consumidor Final o Monotributista
  // Factura A (1) para Responsable Inscripto
  const getBillType = () => {
    if (tipoFactura === 0) return 0; // Factura X (Presupuesto)
    if (isConsumidorFinal || isMonotributista) return 6; // Factura B
    if (isResponsableInscripto) return 1; // Factura A
    return 6; // Por defecto Factura B
  };

  const selecTipoFactura = (tipo) => {
    setTipoFactura(tipo);
  };

  const facturar = async () => {
    const sendData = {
      clientId: order.clientId,
      items: order.items,
      billType: getBillType(),
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

    if (requiresDni) {
      if (dni === '' || dni.length < 7) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe ingresar un DNI válido para factura oficial con importe mayor o igual a $10.000.000',
        });
        return;
      }
      sendData.dni = dni;
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

        // Imprimir factura/presupuesto automáticamente
        try {
          await printPosBill(res.payload);
        } catch (printErr) {
          Swal.fire({
            icon: 'warning',
            title: 'Venta registrada, pero no se pudo imprimir',
            text: printErr.message || 'Puede reimprimir desde la cuenta corriente del cliente.',
          });
          dispatch(resetPosSellOrderState());
          closeModal();
          return;
        }

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
        <Radio
          className={styles.radio}
          label="Factura Oficial"
          value={tipoFactura}
          checked={tipoFactura === 1}
          onChange={() => selecTipoFactura(1)}
        />
      </div>
      {requiresDni && (
        <div className={styles.billTypeContainer}>
          <p>
            <i className="fa-solid fa-id-card"></i>
            <span>DNI del Cliente</span>
          </p>
          <div className={styles.inputCont}>
            <label>DNI (requerido para factura oficial)</label>
            <input 
              type="number"
              value={dni} 
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingrese DNI sin puntos"
            />
          </div>
        </div>
      )}
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
