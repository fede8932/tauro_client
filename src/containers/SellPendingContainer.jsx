import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getBrandRequest, resetBrandRequest } from '../redux/brand';
import { getClientRequest, resetAllClientRequest } from '../redux/client';
import {
  getPendingReport,
} from '../request/orderRequest';
import SellPendingComponent from '../components/sellPending/SellPendingComponent';
import { delPendingsRequest } from '../redux/pending';

function SellPendingContainer(props) {
  const report = useSelector((state) => state.report);
  const clients = useSelector((state) => state.client);
  const brands = useSelector((state) => state.brand);
  const filtersPending = useSelector((state) => state.filterPending);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  const dispatch = useDispatch();

  const exportar = async () => {
    try {
      setExportLoading(true);
      const response = await getPendingReport(filtersPending);

      // Crea un objeto URL a partir del objeto Blob
      const fileURL = URL.createObjectURL(new Blob([response.data]));

      // Extrae el nombre del archivo de la cabecera 'content-disposition'
      const fileName = response.headers['content-disposition']
        ? response.headers['content-disposition']
            .split(';')
            .find((n) => n.includes('filename='))
            .replace('filename=', '')
            .replace(/"/g, '') // Elimina las comillas del nombre del archivo
        : 'pendientes.xlsx'; // Nombre predeterminado del archivo

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

  const deletePending = (id) => {
    dispatch(delPendingsRequest(id))
      .then((res) => {
        if (res.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Ocurrió un error: ${res.error.message}`,
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          title: 'Eliminado',
          icon: 'success',
          draggable: true,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 1000,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Ocurrió un error: ${err.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
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
  return (
    <SellPendingComponent
      {...props}
      brands={brands.data}
      clients={clients.data}
      reportState={report}
      exportar={exportar}
      exportLoading={exportLoading}
      importLoading={importLoading}
      deletePending={deletePending}
    />
  );
}

export default SellPendingContainer;
