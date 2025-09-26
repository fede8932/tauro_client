import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label, Pagination, Popup, Select } from 'semantic-ui-react';
import styles from './usersTable.module.css';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import { setFilterUser, resetFilterUser } from '../../../redux/filtersUsers';
import {
  resetPassUser,
  resetState,
  searchUsersExtra,
  toggleStatusUser,
} from '../../../redux/searchUsers';
import Swal from 'sweetalert2';
import { traslateRol } from '../../../utils';
// import CustomModal from '../../../commonds/customModal/CustomModal';
// import EditUserContainer from '../../../containers/EditUserContainer';

const CustomComp = ({ data, props }) => {
  const { toggleStatus, resetPass } = props;
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        {/* <CustomModal
          title="Editar usuario"
          size="xl"
          actionButton={
            <button
              style={{ all: 'unset' }}
              disabled={data.role?.id != 3 && data.role?.id != 4}
            >
              <Popup
                disabled={data.role?.id != 3 && data.role?.id != 4}
                content="Editar usuario"
                trigger={
                  <i
                    className={`fa-solid fa-pen-to-square ${data.role?.id != 3 && data.role?.id != 4 ? styles.iiconG : styles.iicon}`}
                  ></i>
                }
              />
            </button>
          }
          bodyModal={(props) => <EditUserContainer {...props} />}
          bodyProps={{ user: data, view: data.role.name }}
        /> */}
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2, 5]}>
        <IconButonUsersTable
          popupText="Reset pass"
          fn={() => resetPass(data.id)}
          icon="fa-solid fa-key"
          iconInitialStyle="iconStyleTeal"
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText={data.status ? 'Desactivar' : 'Activar'}
          fn={() => toggleStatus(data.id)}
          icon={data.status ? 'fa-solid fa-xmark' : 'fa-solid fa-check'}
          iconInitialStyle={data.status ? 'iconStyleRed' : 'iconStyleGreen'}
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterUsers = useSelector((state) => state.filterUser);
  const [inp, setInp] = useState(false);
  const [inputValue, setInputValue] = useState(filterUsers[name] || ''); // Nuevo estado para almacenar el valor del input
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null); // Referencia para el timeout de debounce

  const onTitleClick = () => {
    setInp(true);
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setInputValue(null); // Almacena el valor sin hacer dispatch inmediatamente
      // setTimeout(() => {
      //   setInp(false);
      // }, 600);
    } else {
      setInputValue(value); // Almacena el valor sin hacer dispatch inmediatamente
    }
  };

  useEffect(() => {
    // Si hay algún valor ingresado, realiza el debounce para el dispatch
    if (inputValue !== '') {
      // Limpia el timeout anterior si el usuario sigue escribiendo
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Configura un nuevo timeout para enviar el valor cuando deje de escribir
      debounceTimeout.current = setTimeout(() => {
        dispatch(setFilterUser({ name: 'page', value: 1 }));
        dispatch(setFilterUser({ name, value: inputValue }));
      }, 500); // 500ms de espera para el debounce (puedes ajustar el tiempo)
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Limpia el timeout cuando el componente se desmonta o el valor cambia
      }
    };
  }, [inputValue, dispatch, name]);

  const handleClickOutside = () => {
    if (!filterUsers[name]) {
      setInp(false);
    }
  };

  useEffect(() => {
    if (inp && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inp]);

  useEffect(() => {
    if (inp) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterUsers, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={inputValue} // Cambiado para usar el estado local
      onChange={onInputChange}
    />
  ) : (
    <span style={{ cursor: 'pointer' }} onClick={onTitleClick}>
      {title}
    </span>
  );
};

function UsersTable(props) {
  const dispatch = useDispatch();
  const filterUsers = useSelector((state) => state.filterUser);

  const users = useSelector((state) => state.searchUsers);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Nombre',
      field: 'name',
      headerComponent: () => <HeaderInput title="Nombre" name={'name'} />,
      width: 300,
      valueGetter: (params) => params.data.name.toUpperCase(),
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Apellido',
      field: 'lastName',
      headerComponent: () => <HeaderInput title="Apellido" name={'lastName'} />,
      width: 300,
      valueGetter: (params) => params.data.lastName.toUpperCase(),
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'E-mail',
      field: 'email',
      headerComponent: () => <HeaderInput title="Email" name={'email'} />,
      width: 330,
      valueGetter: (params) => params.data.email.toUpperCase(),
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Razón social',
      field: 'razonSocial',
      headerComponent: () => (
        <HeaderInput title="Razón social" name={'razonSocial'} />
      ),
      width: 210,
      valueGetter: (params) =>
        params.data.client
          ? params.data.client.razonSocial.toUpperCase()
          : params.data.lastName.toUpperCase(),
      filter: false,
      sortable: false,
    },
    {
      headerName: 'Rol',
      field: 'role',
      valueGetter: (params) =>
        params.data.role
          ? `${traslateRol(params.data.role.name.toUpperCase())}`
          : '',
      filter: false,
      width: 90,
      sortable: false,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{
            toggleStatus: (id) => {
              Swal.fire({
                title: 'Estás seguro?',
                text: 'Vas a cambiar el estado del usuario',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, actualizar',
              }).then((result) => {
                if (result.isConfirmed) {
                  dispatch(toggleStatusUser(id)).then(() => {
                    Swal.fire({
                      title: 'Actualizado!',
                      text: 'Has actualizado el estado del usuario',
                      icon: 'success',
                      showConfirmButton: false, // Oculta el botón "OK"
                      timer: 1000,
                    });
                  });
                }
              });
            },
            resetPass: (id) => {
              Swal.fire({
                title: 'Estás seguro?',
                text: 'Vas a reiniciar la contraseña del usuario',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, reiniciar',
              }).then((result) => {
                if (result.isConfirmed) {
                  dispatch(resetPassUser(id)).then(() => {
                    Swal.fire({
                      title: 'Actualizado!',
                      text: 'Has reiniciado la conytraseña',
                      icon: 'success',
                      showConfirmButton: false, // Oculta el botón "OK"
                      timer: 1000,
                    });
                  });
                }
              });
            },
          }}
        />
      ),
      field: 'id',
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: 'Estado',
      field: 'status',
      filter: false,
      width: 130,
      cellRenderer: (params) => {
        if (params.data.status) {
          return <Label color="green">Activado</Label>;
        } else {
          return <Label color="red">Desactivado</Label>;
        }
      },
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(searchUsersExtra(filterUsers));
    return () => {
      dispatch(resetState());
    };
  }, [filterUsers]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterUser());
    };
  }, []);

  const selectChange = (e, d) => {
    dispatch(setFilterUser({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterUser({ name: 'page', value: d.activePage }));
  };

  return (
    <div className={'ag-theme-quartz'} style={{ height: 665 }}>
      <AgGridReact
        rowData={users.data.users}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${users.data.pages} páginas con ${users.data.results} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterUsers.pageSize}
              onChange={selectChange}
              options={[
                { key: 20, value: 20, text: 20 },
                { key: 30, value: 30, text: 30 },
                { key: 50, value: 50, text: 50 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterUsers.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={users.data.pages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default UsersTable;
