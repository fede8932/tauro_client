import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Pagination, Select } from 'semantic-ui-react';
import styles from './brandsTables.module.css';
import CustomModal from '../../../commonds/customModal/CustomModal';
import {
  searchBrandsExtraRequest,
  toggleEcommerceBrandRequest,
} from '../../../redux/searchBrandsExtra';
import { setFilterBrand } from '../../../redux/filtersBrands';
import EditBrandContainer from '../../../containers/EditBrandContainer';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import { useNavigate } from 'react-router';

const CustomComp = (props) => {
  const { brand } = props;
  const navigate = useNavigate();
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title="Editar marca"
        size="sm"
        actionButton={
          <buton className={`${styles.iconButton} ${styles.blueIcon}`}>
            <i className="fa-regular fa-pen-to-square"></i>
          </buton>
        }
        bodyModal={(props) => <EditBrandContainer brand={brand} {...props} />}
      />

      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Ofertas"
          fn={() => {
            navigate(`/brand/sale/${brand.id}`);
          }}
          icon="fa-solid fa-piggy-bank"
          iconInitialStyle={
            brand.sales?.filter((s) => s.status).length > 0
              ? 'iconStyleTeal'
              : 'iconStyleBlack'
          }
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterBrands = useSelector((state) => state.filterBrand);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filterBrands[name]);
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setDebouncedValue(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setFilterBrand({ name: 'page', value: 1 }));
      dispatch(setFilterBrand({ name, value }));
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
  };

  const handleClickOutside = () => {
    if (!filterBrands[name]) {
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
  }, [filterBrands, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={debouncedValue}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function BrandsTable(props) {
  const filterBrands = useSelector((state) => state.filterBrand);

  const dispatch = useDispatch();

  const brands = useSelector((state) => state.brandResults);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'code',
      headerComponent: () => <HeaderInput title="Código" name={'code'} />,
      width: 200,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      field: 'name',
      headerComponent: () => <HeaderInput title="Nombre" name={'name'} />,
      width: 650,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Proveedor',
      field: 'brand',
      headerComponent: () => <HeaderInput title="Proveedor" name={'supplier'} />,
      valueGetter: ({ data }) => data?.brandSuppliers[0].supplier?.razonSocial,
      width: 300,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Rentabilidad',
      valueGetter: ({ data }) => `${data?.rentabilidad * 100} %`,
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: 'Ecommerce',
      field: 'price',
      cellRenderer: ({ data }) => (
        <div>
          <Checkbox
            checked={data.ecommerce}
            onChange={() => dispatch(toggleEcommerceBrandRequest(data.id))}
          />
        </div>
      ),
      filter: false,
      width: 120,
      sortable: false,
    },
    {
      headerName: 'Acciones',
      field: 'stock',
      cellRenderer: ({ data }) => <CustomComp brand={data} />,
      filter: false,
      width: 150,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(searchBrandsExtraRequest(filterBrands));
    return () => {};
  }, [filterBrands]);

  const selectChange = (e, d) => {
    dispatch(setFilterBrand({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterBrand({ name: 'page', value: d.activePage }));
  };

  return (
    <div className={'ag-theme-quartz'} style={{ height: 665 }}>
      <AgGridReact
        rowData={brands.data.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${brands.data.totalPages} páginas con ${brands.data.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterBrands.pageSize}
              onChange={selectChange}
              options={[
                { key: 15, value: 15, text: 15 },
                { key: 20, value: 20, text: 20 },
                { key: 50, value: 50, text: 50 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterBrands.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={brands.data.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default BrandsTable;
