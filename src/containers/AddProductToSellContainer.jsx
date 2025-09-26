import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getClientRequest } from '../redux/client';
import Swal from 'sweetalert2';
import AddProductToSell from '../components/addProductToSell/AddProductToSell';
import { addOrderItemSearchProd } from '../request/orderRequest';

function AddProductToSellContainer(props) {
  const { productId, brandId, closeModal, selectClientId } = props;
  const methods = useForm();
  const dispatch = useDispatch();

  const addProduct = (d) => {
    addOrderItemSearchProd({
      clientId: selectClientId,
      productId: productId,
      brandId: brandId,
      cantidad: Number(d.amount),
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
        closeModal();
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
    dispatch(getClientRequest());
  }, []);

  return (
    <AddProductToSell
      methods={methods}
      handleSubmit={addProduct}
      selectClientId={selectClientId}
    />
  );
}

export default AddProductToSellContainer;
