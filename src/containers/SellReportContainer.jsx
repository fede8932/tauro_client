import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportRequest, resetSellReports } from '../redux/report';
import SellReportComponent from '../components/sellReport/SellReportComponent';
import Swal from 'sweetalert2';
import { genOrderReportRequest } from '../redux/dateReport';
import { getBrandRequest, resetBrandRequest } from '../redux/brand';
import { getClientRequest, resetAllClientRequest } from '../redux/client';
import {
  genBuyOrdersByReportImport,
  getFileReport,
} from '../request/orderRequest';

function SellReportContainer(props) {
  const report = useSelector((state) => state.report);
  const clients = useSelector((state) => state.client);
  const brands = useSelector((state) => state.brand);
  const filtersReports = useSelector((state) => state.filterSellReport);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportfile] = useState(null);
  // console.log(clients);
  const dispatch = useDispatch();

  // console.log(importFile);

  const sendReportAndGenBuyOrder = () => {
    if (true) {
      Swal.fire({
        title: 'Vas a generar una o varias ordenes de compra, estás seguro?',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          setImportLoading(true);
          genBuyOrdersByReportImport({ file: importFile })
            .then((res) => {
              setImportLoading(false);
              setImportfile(null);
              if (res.error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: `Ocurrió un error: ${res.error?.message}`,
                  showConfirmButton: false, // Oculta el botón "OK"
                  timer: 2500,
                });
              } else {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Ordenes generadas con éxito',
                  showConfirmButton: false,
                  timer: 1000,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              setImportLoading(false);
              setImportfile(null);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error desconocido',
                showConfirmButton: false, // Oculta el botón "OK"
                timer: 2500,
              });
            });
        } else {
          setImportLoading(false);
          setImportfile(null);
        }
      });
    }
  };

  const exportar = async () => {
    try {
      setExportLoading(true);
      const response = await getFileReport(filtersReports);

      // Crea un objeto URL a partir del objeto Blob
      const fileURL = URL.createObjectURL(new Blob([response.data]));

      // Extrae el nombre del archivo de la cabecera 'content-disposition'
      const fileName = response.headers['content-disposition']
        ? response.headers['content-disposition']
            .split(';')
            .find((n) => n.includes('filename='))
            .replace('filename=', '')
            .replace(/"/g, '') // Elimina las comillas del nombre del archivo
        : 'report.xlsx'; // Nombre predeterminado del archivo

      // Crea un enlace (a) para descargar el archivo
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', fileName); // Establece el nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    } finally {
      setExportLoading(false);
    }
  };

  const genOrder = () => {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Vas a generar ordenes de compra en base a los reportes de venta',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, generar',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(genOrderReportRequest()).then((res) => {
          if (res.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error en el servidor',
            });
          } else {
            Swal.fire({
              title: 'Generado',
              text: "Podrás acceder a las compras desde 'Buscar ordenes de compra'",
              icon: 'success',
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    dispatch(getBrandRequest());
    dispatch(getClientRequest(true));
    return () => {
      dispatch(resetAllClientRequest());
      dispatch(resetBrandRequest());
    };
  }, []);
  useEffect(() => {
    dispatch(getReportRequest(filtersReports));
    return () => {
      dispatch(resetSellReports(null));
    };
  }, [filtersReports]);
  useEffect(() => {
    if (importFile) sendReportAndGenBuyOrder();
  }, [importFile]);
  return (
    <SellReportComponent
      {...props}
      brands={brands.data}
      clients={clients.data}
      reportState={report}
      genOrder={genOrder}
      exportar={exportar}
      exportLoading={exportLoading}
      importLoading={importLoading}
      setImportfile={setImportfile}
    />
  );
}

export default SellReportContainer;
