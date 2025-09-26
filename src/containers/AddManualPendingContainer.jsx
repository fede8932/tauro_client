import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import AddPending from '../components/addPending/AddPending';
import { getClientRequest, resetAllClientRequest } from '../redux/client';
import { addPendingsRequest } from '../redux/pending';
import Swal from 'sweetalert2';

function AddManualPendingContainer(props) {
  const { id, closeModal } = props;
  const methods = useForm();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.client);

  const options = data?.map((c) => {
        let option = { value: null, text: null };
        option.value = c.id;
        option.text = c.text;
        return option;
      });

  const handleSubmit = (d) => {
    // const clientId =
    //   data.find((item) => item.razonSocial == d.client)?.id ?? null;
    dispatch(
      addPendingsRequest({
        productId: id,
        amount: Number(d.amount),
        clientId: Number(d.client),
      })
    )
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
        closeModal();
        Swal.fire({
          title: 'Guardado',
          icon: 'success',
          draggable: true,
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
    dispatch(getClientRequest());
    return () => {
      dispatch(resetAllClientRequest());
    };
  }, []);

  return (
    <AddPending
      methods={methods}
      handleSubmit={handleSubmit}
      clients={options}
    />
  );
}

export default AddManualPendingContainer;
