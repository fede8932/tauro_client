import React, { useMemo } from 'react';
import styles from './searchPickingOrder.module.css';
import SearchPickingOrderContainer from '../../containers/SearchPickingOrderContainer';
import { Checkbox } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterPickinngs } from '../../redux/filtersPickings';
import { Button } from 'react-bootstrap';
import { selectPickingOrder } from '../../request/clientRequest';
import { nPedHtml } from '../../templates/blaseOped';
import { printPickingOrderRequest } from '../../redux/clientPickingOrder';

const PrintButton = (props) => {
  const { data } = useSelector((state) => state.pickingOrders);

  const dispatch = useDispatch();
  const printList = useMemo(() => {
    return data.pickingOrders.filter((item) => item.marc);
  }, [data]);
  const handlePrintList = async () => {
    const nuevaVentana = window.open('', '', 'width=794,height=1123');
    let lap = 0;
    //Itero sobre los pickings
    while (lap < printList.length) {
      //Busco el picking
      const pickingOrder = await selectPickingOrder(printList[lap].id);
      //Defino páginas del picking
      const itemsPorPagina = 19;
      const totalItems = pickingOrder.purchaseOrder?.purchaseOrderItems.length;
      const totalPages = Math.ceil(totalItems / itemsPorPagina);
      //Itero sobre las paginas del picking
      for (let i = 0; i < totalPages; i++) {
        const inicio = i * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const itemsPagina =
          pickingOrder.purchaseOrder?.purchaseOrderItems.slice(inicio, fin);
        const type = pickingOrder.purchaseOrder?.oferta ? 'NPO' : 'NP';
        const htmlContent = nPedHtml(
          pickingOrder,
          i + 1,
          totalPages,
          itemsPagina,
          type
        );

        // Escribe el contenido HTML en la ventana
        nuevaVentana.document.write(htmlContent);
      }
      dispatch(printPickingOrderRequest(printList[lap].id));
      lap++;
    }

    nuevaVentana.document.close(); // Cierra el flujo de escritura de la ventana.

    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });
  };
  return (
    <Button
      disabled={printList.length <= 0}
      variant="secondary"
      onClick={handlePrintList}
    >
      Imprimir
    </Button>
  );
};

function SearchPickingOrder() {
  const filters = useSelector((state) => state.filterPickings);

  const dispatch = useDispatch();
  const togglePending = () => {
    dispatch(setFilterPickinngs({ name: 'pending', value: !filters.pending }));
    dispatch(setFilterPickinngs({ name: 'page', value: 1 }));
  };

  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Ordenes de pedidos</h6>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Checkbox
          checked={filters.pending}
          label="Pendiente"
          toggle
          onClick={togglePending}
        />
        <PrintButton />
      </div>
      <div>
        <SearchPickingOrderContainer />
      </div>
    </div>
  );
}

export default SearchPickingOrder;
