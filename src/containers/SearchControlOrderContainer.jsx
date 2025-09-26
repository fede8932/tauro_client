import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchControlOrderComponent from '../components/searchControlOrder/SearchControlOrderComponent';
import { getControlOrderRequest } from '../redux/supplierControlOrder';
import { selectControlOrder } from '../request/supplierRequest';
import PdfGen from '../commonds/PDFGen/PdfGen';
import { blaseNContr } from '../templates/blaseNContr';

function SearchControlOrderContainer(props) {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.controlOrders);

  const changePag = (page) => {
    dispatch(getControlOrderRequest({ order: 'DES', rows: 16, page: page }));
  };


  const abrirNuevaVentana = async (controlOrderId) => {
    const constrolOrder = await selectControlOrder(controlOrderId);
    const itemsPorPagina = 19;
    const totalItems = constrolOrder.purchaseOrder?.purchaseOrderItems.length;
    const totalPages = Math.ceil(totalItems / itemsPorPagina);

    const nuevaVentana = window.open('', '', 'width=794,height=1123');

    for (let i = 0; i < totalPages; i++) {
      const inicio = i * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      const itemsPagina = constrolOrder.purchaseOrder?.purchaseOrderItems.slice(
        inicio,
        fin
      );

      const htmlContent = blaseNContr(
        constrolOrder,
        i + 1,
        totalPages,
        itemsPagina
      );

      // Escribe el contenido HTML en la ventana
      nuevaVentana.document.write(htmlContent);
    }

    nuevaVentana.document.close(); // Cierra el flujo de escritura de la ventana.

    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });

    nuevaVentana.print();
    dispatch(printPickingOrderRequest(pickingOrderId));
  };


  useEffect(() => {
    dispatch(getControlOrderRequest({ order: 'DES', rows: 16, page: 1 }));
  }, []);

  return (
    <SearchControlOrderComponent
      result={result}
      printFn={abrirNuevaVentana}
      changePag={changePag}
    />
  );
}

export default SearchControlOrderContainer;
