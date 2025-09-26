import React, { useEffect, useState } from 'react';
import styles from './searchProduct.module.css';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getFileProducts } from '../../request/productRequest';
import ProductsTable from '../tables/productsTable/ProductsTable';
import { resetFilterProduct } from '../../redux/filtersProducts';
import { AutoComplete } from 'antd';
import {
  getClientIdRequestNew,
  getClientRequest,
  resetClientState,
  resetSelectClientState,
} from '../../redux/client';
import Swal from 'sweetalert2';
import { addOrderItemSearchProd } from '../../request/orderRequest';

function SearchProductComponent(props) {
  const { deleteProduct } = props;
  const [textClient, setTextClient] = useState('');
  const [listClient, setListClient] = useState([]);
  const [selectClientId, setSelectClientId] = useState(null);

  const clients = useSelector((state) => state.client).data;

  const customerDiscounts = useSelector((state) => state.client)?.selectClient
    ?.customerDiscounts; // Se usa para renderizar el precio cuando es una venta

  // console.log(customerDiscounts);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const filterProducts = useSelector((state) => state.filterProduct);
  const [listDownloadPending, setListDownloadPending] = useState(false);

  const downloadFile = async () => {
    setListDownloadPending(true);
    try {
      const response = await getFileProducts(filterProducts);

      // Crea un objeto URL a partir del objeto Blob
      const fileURL = URL.createObjectURL(new Blob([response.data]));

      // Extrae el nombre del archivo de la cabecera 'content-disposition'
      const fileName = response.headers['content-disposition']
        ? response.headers['content-disposition']
            .split(';')
            .find((n) => n.includes('filename='))
            .replace('filename=', '')
            .replace(/"/g, '') // Elimina las comillas del nombre del archivo
        : 'products.xlsx'; // Nombre predeterminado del archivo

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
      {
        setListDownloadPending(false);
      }
    }
  };

  const onChange = (d) => {
    setTextClient(d);
  };

  const onSelect = (value, options) => {
    // console.log(value, options)
    setTextClient(options?.label ?? '');
    setSelectClientId(value);
  };

  const addProduct = (productId, brandId) => {
    addOrderItemSearchProd({
      clientId: selectClientId,
      productId: productId,
      brandId: brandId,
      cantidad: 1,
    })
      .then((res) => {
        if (res.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: `Error: ${res.error.message}`,
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
          return;
        }
        Swal.fire({
          title: 'Agregado',
          icon: 'success',
          draggable: true,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 1000,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: `Error: ${err.message}`,
          showConfirmButton: false, // Oculta el botón "OK"
          timer: 2500,
        });
      });
  };

  useEffect(() => {
    dispatch(getClientRequest(true));
    return () => {
      resetClientState();
    };
  }, []);

  useEffect(() => {
    selectClientId ? dispatch(getClientIdRequestNew(selectClientId)) : null;
  }, [selectClientId]);

  useEffect(() => {
    if (textClient == '' || !textClient) {
      setListClient(clients);
      setSelectClientId(null);
      dispatch(resetSelectClientState());
      return;
    }
    let newClientsList = [...clients].filter((c) => {
      return (
        c.label && c.label?.toLowerCase().includes(textClient?.toLowerCase())
      );
    });
    setListClient(newClientsList);
  }, [textClient, clients]);

  return (
    <div className={styles.formContainer}>
      <AutoComplete
        value={textClient}
        options={listClient}
        style={{
          width: 300,
        }}
        onSelect={onSelect}
        // onSearch={(text) => setAnotherOptions(getPanelValue(text))}
        onChange={onChange}
        placeholder="Seleccionar cliente"
      />
      <div className={styles.subFormContainer}>
        <Button
          disabled={listDownloadPending}
          type="button"
          style={{
            backgroundColor: 'grey',
            border: '1px solid grey',
            height: '47px',
            width: '100px',
            marginLeft: '10px',
          }}
          onClick={() => {
            dispatch(resetFilterProduct(null));
          }}
        >
          Limpiar
        </Button>
        <Button
          disabled={listDownloadPending}
          type="button"
          style={{
            backgroundColor: 'grey',
            border: '1px solid grey',
            height: '47px',
            width: '100px',
            marginLeft: '10px',
          }}
          onClick={downloadFile}
        >
          {listDownloadPending ? <Spinner /> : 'Exportar'}
        </Button>
      </div>
      <div className={styles.table}>
        <ProductsTable
          deleteProduct={deleteProduct}
          selectClientId={selectClientId}
          customerDiscounts={customerDiscounts}
          addProduct={addProduct}
        />
      </div>
    </div>
  );
}

export default SearchProductComponent;
