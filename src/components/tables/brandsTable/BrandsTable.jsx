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
import { getSupplierRequest } from '../../../redux/supplier';
import EditBrandContainer from '../../../containers/EditBrandContainer';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import { useNavigate } from 'react-router';
import { resetBrandRentabilidad, getBrandsBySupplier } from '../../../request/brandRequest';
import Swal from 'sweetalert2';
import BulkAssignSupplierModal from '../../searchProduct/BulkAssignSupplierModal';
import BulkUpdateRentabilidadModal from '../../searchProduct/BulkUpdateRentabilidadModal';

const centeredCell = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const CustomComp = (props) => {
  const { brand } = props;
  const [showBulkModal, setShowBulkModal] = useState(false);
  const dispatch = useDispatch();
  const filterBrands = useSelector((state) => state.filterBrand);
  const navigate = useNavigate();

  const handleResetRentabilidad = () => {
    Swal.fire({
      title: '¿Limpiar rentabilidad de productos?',
      text: '¿Seguro que desea eliminar la rentabilidad personalizada de todos los productos de esta marca? Se utilizará la rentabilidad de la marca por defecto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#673ab7',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await resetBrandRentabilidad(brand.id);
          Swal.fire({
            title: '¡Limpiado!',
            text: `Se han restablecido ${res.affectedCount} productos.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          // Opcional: recargar la lista si es necesario, aunque esto afecta a productos no a marcas
          // dispatch(searchBrandsExtraRequest(filterBrands));
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo limpiar la rentabilidad de los productos.',
            icon: 'error',
          });
        }
      }
    });
  };

  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title="Editar marca"
        size="lg"
        actionButton={
          <button
            type="button"
            title="Editar marca"
            className={`${styles.actionBtn} ${styles.blueIcon}`}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
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

      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Limpiar rentabilidad de productos"
          fn={handleResetRentabilidad}
          icon="fa-solid fa-broom"
          iconInitialStyle="iconStyleOrange"
        />
      </ProtectedComponent>

      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Asignar proveedor por defecto a productos"
          fn={() => setShowBulkModal(true)}
          icon="fa-solid fa-truck"
          iconInitialStyle="iconStyleGreen"
        />
      </ProtectedComponent>

      <BulkAssignSupplierModal
        show={showBulkModal}
        onHide={() => setShowBulkModal(false)}
        onSuccess={() => dispatch(searchBrandsExtraRequest(filterBrands))}
        initialBrand={brand}
      />
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
  const suppliers = useSelector((state) => state.supplier.data);

  const gridRef = useRef(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showRentModal, setShowRentModal] = useState(false);
  const [supplierBulkId, setSupplierBulkId] = useState('');
  const [supplierBulkCount, setSupplierBulkCount] = useState(0);
  const [showSupplierRentModal, setShowSupplierRentModal] = useState(false);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      sortable: false,
      filter: false,
      suppressHeaderMenuButton: true,
      cellStyle: centeredCell,
    },
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
      width: 600,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Proveedor',
      field: 'brand',
      headerComponent: () => <HeaderInput title="Proveedor" name={'supplier'} />,
      valueGetter: ({ data }) => data?.brandSuppliers?.map((bs) => bs.supplier?.razonSocial).filter(Boolean).join(', '),
      width: 300,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Rentabilidad',
      valueGetter: ({ data }) => (data?.rentabilidad != null ? `${data.rentabilidad * 100} %` : '—'),
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: 'Ecommerce',
      field: 'price',
      cellRenderer: ({ data }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Checkbox
            checked={data.ecommerce}
            onChange={() => dispatch(toggleEcommerceBrandRequest(data.id))}
          />
        </div>
      ),
      filter: false,
      width: 120,
      sortable: false,
      cellStyle: centeredCell,
    },
    {
      headerName: 'Acciones',
      cellRenderer: ({ data }) => <CustomComp brand={data} />,
      filter: false,
      sortable: false,
      suppressHeaderMenuButton: true,
      width: 220,
      cellStyle: { ...centeredCell, padding: 0 },
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

  useEffect(() => {
    if (!suppliers || suppliers.length === 0) {
      dispatch(getSupplierRequest());
    }
  }, []);

  useEffect(() => {
    // La selección corresponde a la página visible
    setSelectedBrands([]);
  }, [brands.data.list]);

  const onSelectionChanged = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    setSelectedBrands(selected);
  };

  const handleSupplierBulkChange = async (value) => {
    setSupplierBulkId(value);
    if (!value) {
      setSupplierBulkCount(0);
      return;
    }
    try {
      const list = await getBrandsBySupplier(Number(value));
      setSupplierBulkCount(list?.length ?? 0);
    } catch {
      setSupplierBulkCount(0);
    }
  };

  const supplierBulkName =
    suppliers?.find((s) => String(s.value) === String(supplierBulkId))?.text || '';

  const selectChange = (e, d) => {
    dispatch(setFilterBrand({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterBrand({ name: 'page', value: d.activePage }));
  };

  return (
    <div>
      <ProtectedComponent listAccesss={[1, 2]}>
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>
            {selectedBrands.length} marca(s) tildada(s) en esta página
          </span>
          <button
            type="button"
            className={styles.bulkApplyBtn}
            disabled={selectedBrands.length === 0}
            onClick={() => setShowRentModal(true)}
            title="Fijar el mismo valor de rentabilidad a las marcas tildadas"
          >
            Fijar rentabilidad ({selectedBrands.length})
          </button>
          <span className={styles.bulkField}>
            Proveedor:
            <select
              value={supplierBulkId}
              onChange={(e) => handleSupplierBulkChange(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {(suppliers || []).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.text}
                </option>
              ))}
            </select>
          </span>
          <button
            type="button"
            className={styles.bulkApplyBtn}
            disabled={!supplierBulkId || supplierBulkCount === 0}
            onClick={() => setShowSupplierRentModal(true)}
            title="Fijar el mismo valor de rentabilidad a todas las marcas del proveedor"
          >
            Aplicar a proveedor ({supplierBulkCount})
          </button>
        </div>
      </ProtectedComponent>

      <BulkUpdateRentabilidadModal
        show={showRentModal}
        onHide={() => setShowRentModal(false)}
        onSuccess={() => {
          dispatch(searchBrandsExtraRequest(filterBrands));
          gridRef.current?.api?.deselectAll();
          setSelectedBrands([]);
        }}
        brands={selectedBrands}
      />

      <BulkUpdateRentabilidadModal
        show={showSupplierRentModal}
        onHide={() => setShowSupplierRentModal(false)}
        onSuccess={() => dispatch(searchBrandsExtraRequest(filterBrands))}
        brands={[]}
        supplierId={supplierBulkId ? Number(supplierBulkId) : null}
        supplierName={supplierBulkName}
        affectedCount={supplierBulkCount}
      />

      <div className={'ag-theme-quartz'} style={{ height: 665 }}>
        <AgGridReact
          ref={gridRef}
          rowData={brands.data.list}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection
          onSelectionChanged={onSelectionChanged}
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
    </div>
  );
}

export default BrandsTable;
