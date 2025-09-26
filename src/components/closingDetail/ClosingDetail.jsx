import { useEffect } from 'react';
import {
  getClosingIdRequest,
  resetSelectClousing,
} from '../../redux/cloausing';
import { useDispatch, useSelector } from 'react-redux';
import { Label, Popup, PopupContent, PopupHeader } from 'semantic-ui-react';
import styles from './closingDetail.module.css';
import { convertirFechaISOaDDMMYYYYHHMM } from '../../utils';

function ClosingDetail({ id }) {
  const dispatch = useDispatch();
  const { detailClose } = useSelector((state) => state.closing);
  console.log(detailClose);
  useEffect(() => {
    dispatch(getClosingIdRequest(id));
    return () => dispatch(resetSelectClousing());
  }, [id]);
  return (
    <div className={styles.container}>
      <div className={styles.gralInfoCont}>
        <p>N°Cierre: {detailClose?.id}</p>
        <p>Total: $ {detailClose?.totalCierre}</p>
        <p>
          Responsable:{' '}
          {`${detailClose?.userReceiving?.name ?? "-"} ${detailClose?.userReceiving?.lastName ?? "-"}`}
        </p>
        <p>
          Estado:{' '}
          {detailClose?.pending ? (
            <Label color="yellow">Pendiente</Label>
          ) : (
            <Label color="green">Finalizado</Label>
          )}
        </p>
      </div>
      <div className={styles.gralInfoCont}>
        <p>
          Vendedor:{' '}
          {`${detailClose?.seller?.user?.name} ${detailClose?.seller?.user?.lastName}`}
        </p>
        <p>Cierre: {convertirFechaISOaDDMMYYYYHHMM(detailClose?.createdAt)}</p>
        <p>
          Recibido:{' '}
          {detailClose?.completed
            ? convertirFechaISOaDDMMYYYYHHMM(detailClose?.completed)
            : '-'}
        </p>
      </div>
      <div className={styles.extraInfoCont}>
        <h5>Movimientos</h5>
        <div className="listContainer">
          {detailClose?.movements.map((mov, index) =>
            mov.type != 4 ? (
              <Label
                key={index}
                style={{ margin: '2px' }}
              >{`${mov.type == 0 ? 'F' : 'NC'}-${mov.numComprobante}`}</Label>
            ) : null
          )}
        </div>
      </div>
      <div className={styles.extraInfoCont}>
        <h5>Cobros</h5>
        <div className="listContainer">
          {detailClose?.sellerReceipts.map((sr, index) => {
            console.log(sr)
            return(
            <div key={index} className={styles.cobroUnit}>
              <div className={styles.simplePayCont}>
                <Popup disabled={!sr.comments} content={sr.comments} trigger={<p className={sr.comments ? styles.cte : ""}>N° Comprobante: {sr.id}</p>} />
                <p>{sr.client.razonSocial?.toUpperCase()}</p>
                <p>Efectivo: $ {sr.montoEfect}</p>
                <p>Cheque: $ {sr.montoCheque}</p>
                <p>
                  Transferencia: $
                  <Popup
                    trigger={
                      <span className={styles.opPopup}>{sr.montoTransf}</span>
                    }
                  >
                    <PopupHeader>{`BANCO ${sr.bancoTransf.toUpperCase()}`}</PopupHeader>
                    <PopupContent>
                      <p>OP: {sr.numOperación}</p>
                      <p>$ {sr.montoTransf}</p>
                    </PopupContent>
                  </Popup>
                </p>
              </div>
              {sr.montoCheque > 0 ? (
                <div style={{width: "100%", marginBottom: "15px"}}>
                  <h6
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      marginTop: '-5px',
                    }}
                  >
                    Detalle de cheques:
                  </h6>
                  <div className="listContainer">
                    {sr.cheques.map((ch, i) => (
                      <Popup key={i} trigger={<Label>CH-{ch.numero}</Label>}>
                        <PopupHeader>{`BANCO ${ch.banco.toUpperCase()}`}</PopupHeader>
                        <PopupContent>
                          <p>Cobro: {ch.fechaCobro}</p>
                          <p>N°: {ch.numero}</p>
                          <p>$ {ch.monto}</p>
                        </PopupContent>
                      </Popup>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}

export default ClosingDetail;
