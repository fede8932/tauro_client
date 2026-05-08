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

  const generateEquivalenceCode = () => {
    const letters = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let res = '';
      for (let i = 0; i < 3; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return res;
    };
    const numbers = () => {
      let res = '';
      for (let i = 0; i < 5; i++) {
        res += Math.floor(Math.random() * 10);
      }
      return res;
    };
    return letters() + numbers() + letters();
  };

  // -------CREAR EQUIVALENCIA------------
  const createEquiv = () => {
    Swal.fire({
      title: 'Crear equivalencia',
      html: `
        <div style="margin-bottom:12px;">
          <label style="display:block;margin-bottom:4px;font-size:14px;">Descripción</label>
          <input id="swal-desc" class="swal2-input" style="margin:0;width:80%;" placeholder="Descripción" value="${
            equivalences.product?.description ?? ''
          }">
        </div>
        <div style="display:flex;gap:8px;align-items:center;justify-content:center;">
          <input id="swal-code" class="swal2-input" style="margin:0;width:50%;" placeholder="Código (AAA12345BBB)">
          <button type="button" id="swal-gen-code" class="swal2-confirm swal2-styled" style="margin:0;padding:8px 16px;font-size:14px;">Generar</button>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      didOpen: () => {
        const genBtn = document.getElementById('swal-gen-code');
        genBtn.addEventListener('click', () => {
          const code = generateEquivalenceCode();
          document.getElementById('swal-code').value = code;
        });
      },
      preConfirm: () => {
        const description = document.getElementById('swal-desc').value;
        const code = document.getElementById('swal-code').value;
        if (!description) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return false;
        }
        return { description, code: code || null };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { description, code } = result.value;
        const productIds = equivalences.selects.map((sp) => sp.id);
        dispatch(
          createEquivalenceRequest({
            description: description,
            productIds: productIds,
            code: code,
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
