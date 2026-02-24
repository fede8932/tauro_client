import React, { useEffect, useState } from 'react';
import EquivalencesComponent from '../components/equivalences/EquivalencesComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
  createEquivalenceRequest,
  editDescriptionRequest,
  getEquivalenceByProductId,
  getProductListRequest,
  getProductRequest,
  reemplaceEquivRequest,
  resetEquivState,
  toggleMarcRec,
} from '../redux/equivalences';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { deleteEquivalence } from '../request/equivalencesRequest';

function EquivalencesContainer(props) {
  const dispatch = useDispatch();

  const ROWS_PER_PAGE = 50;

  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const equivalences = useSelector((state) => state.equivalences);

  // console.log("soy equiv--->", equivalences);

  const toggleMarc = (id) => {
    dispatch(toggleMarcRec(id));
  };

  // -------CREAR EQUIVALENCIA------------
  const createEquiv = () => {
    Swal.fire({
      title: 'Descripción de equivalencia',
      input: 'text',
      inputValue: equivalences.product?.description ?? '',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const description = result.value;
        const productIds = equivalences.selects.map((sp) => sp.id);
        dispatch(
          createEquivalenceRequest({
            description: description,
            productIds: productIds,
          })
        ).then((res) => {
          console.log('res:', res);
        });
      }
    });
  };

  const reemplceEquiv = () => {
    const listId = equivalences.selects?.map((p) => p.id);
    dispatch(
      reemplaceEquivRequest({
        id: equivalences.equivalence?.id,
        listId: listId,
      })
    )
      .then((res) => {
        if (res.error?.message == 'Request failed with status code 409') {
          Swal.fire({
            icon: 'error',
            title: 'Conflicto',
            text: 'Uno de los elementos seleccionado ya tiene una equivalencia creada',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 2500,
          });
        }
      })
      .catch((err) => {});
  };

  const editDescriptEquiv = (id) => {
    Swal.fire({
      title: 'Descripción de equivalencia',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const description = result.value;
        dispatch(
          editDescriptionRequest({
            description: description,
            id: id,
          })
        ).then((res) => {
          if (res.error) {
            console.log(res);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error en el servidor',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 2500,
            });
            return;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Descripción actualizada',
            showConfirmButton: false,
            timer: 1000,
          });
        });
      }
    });
  };

  const deleteAllEquiv = (id) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a eliminar la relación entre todos los productos en la equivalencia',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEquivalence(id).then((res) => {
          if (res.error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error en el servidor',
              showConfirmButton: false, // Oculta el botón "OK"
              timer: 2500,
            });
            return;
          }
          Swal.fire({
            title: 'Eliminado!',
            text: 'Has eliminado la equivalencia',
            icon: 'success',
            showConfirmButton: false, // Oculta el botón "OK"
            timer: 1000,
          }).then(() => {
            navigate('/search/product');
          });
        });
      }
    });
  };

  useEffect(() => {
    setPage(1);
    setText('');
    dispatch(resetEquivState());
    dispatch(getProductRequest(Number(pathname.split('/')[2])));
    return () => dispatch(resetEquivState());
  }, [pathname]);

  useEffect(() => {
    dispatch(
      getProductListRequest({
        page: page,
        text: text != '' ? text : null,
        rows: ROWS_PER_PAGE,
      })
    );
  }, [equivalences.product, text, page]);

  useEffect(() => {
    dispatch(getEquivalenceByProductId(Number(pathname.split('/')[2])));
  }, [equivalences.product]);

  return (
    <EquivalencesComponent
      createEquiv={createEquiv}
      equivalences={equivalences}
      setText={setText}
      setPage={setPage}
      toggleMarc={toggleMarc}
      deleteFn={deleteAllEquiv}
      editFn={editDescriptEquiv}
      reemplceEquiv={reemplceEquiv}
    />
  );
}

export default EquivalencesContainer;
