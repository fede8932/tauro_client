import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProductsExtraRequest } from '../../../redux/product';
import { discountApplicationV2, numberToString } from '../../../utils';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './productsTables.module.css';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import {
  resetEquivFilter,
  resetFilterProduct,
  setEquivFilter,
  setFilterProduct,
} from '../../../redux/filtersProducts';
import { Button } from 'react-bootstrap';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';

const CustomComp = ({ data, props }) => {
  const { selectClientId, addProduct, customerDiscounts } = props;
  return (
    <div className={styles.buttonContainer}>
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <IconButonUsersTable
          disabled={!selectClientId}
          popupText="Agregar a orden"
          fn={() =>
            addProduct(
              data.id,
              data.brand.id,
              data.article,
              discountApplicationV2(customerDiscounts, data, true).initPrice,
              data.description
            )
          }
          icon="fa-solid fa-cart-plus"
          iconInitialStyle={
            !selectClientId ? 'iconStyleGrey' : 'iconStyleGreen'
          }
        />
      </ProtectedComponent>
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterProducts = useSelector((state) => state.filterProduct);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filterProducts[name]);
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
      dispatch(setFilterProduct({ name: 'equivalenceId', value: null }));
      dispatch(setFilterProduct({ name: 'page', value: 1 }));
      dispatch(setFilterProduct({ name, value }));
    }, 500);
  };

  const handleClickOutside = () => {
    if (!filterProducts[name]) {
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
  }, [filterProducts, inp]);

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

function PosProductsTable(props) {
  const { selectClientId, customerDiscounts, addProduct } = props;
  const filterProducts = useSelector((state) => state.filterProduct);

  const dispatch = useDispatch();

  const products = useSelector((state) => state.product);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Artículo',
      field: 'article',
      headerComponent: () => <HeaderInput title="Artículo" name={'article'} />,
      width: 115,
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
    },
    {
      headerName: 'Descripción',
      headerComponent: () => (
        <HeaderInput title="Descripción" name={'description'} />
      ),
      valueGetter: (params) =>
        params.data.description ? params.data.description.toUpperCase() : '',
      width: 650,
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
    },
    {
      headerName: 'Marca',
      field: 'brand',
      headerComponent: () => <HeaderInput title="Marca" name={'brand'} />,
      valueGetter: (params) =>
        params.data.brand ? params.data.brand.name : '',
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
    },
    {
      headerName: 'Stock',
      field: 'stock',
      valueGetter: (params) =>
        params.data.stock ? params.data.stock.stock : '',
      filter: false,
      width: 70,
    },
    {
      headerName: 'Ubicación',
      field: 'location',
      sortable: false,
      filter: false,
      width: 90,
    },
    {
      headerName: 'Precio cIva',
      field: 'sellPriceIva',
      sortable: false,
      cellRenderer: (params) => (
        <ProtectedComponent listAccesss={[1, 2, 3, 5, 6]}>
          {selectClientId ? (
            <span>
              {params.data.price && params.data.brand
                ? `$ ${numberToString(
                    discountApplicationV2(customerDiscounts, params.data, true)
                      .endPrice
                  )}`
                : ''}
            </span>
          ) : (
            <span>
              {params.data.price && params.data.brand
                ? `$ ${numberToString(
                    params.data.price.price *
                      (1 + params.data.brand.rentabilidad) *
                      1.21
                  )}`
                : ''}
            </span>
          )}
        </ProtectedComponent>
      ),
      filter: false,
      width: 125,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{
            selectClientId: selectClientId,
            addProduct: addProduct,
            customerDiscounts: customerDiscounts,
          }}
        />
      ),
      field: 'actions',
      sortable: false,
      filter: false,
      width: 110,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {};
  }, []);

  useEffect(() => {
    dispatch(searchProductsExtraRequest(filterProducts));
    return () => {};
  }, [filterProducts]);

  const selectChange = (e, d) => {
    dispatch(setFilterProduct({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterProduct({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    setColumnDefs((prevColumnDefs) => {
      return prevColumnDefs?.map((colDef) => {
        if (colDef.field === 'sellPriceIva') {
          return {
            ...colDef,
            cellRenderer: (params) => (
              <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
                {selectClientId ? (
                  <span>
                    {params.data.price && params.data.brand
                      ? `$ ${numberToString(discountApplicationV2(customerDiscounts, params.data, true).endPrice)}`
                      : ''}
                  </span>
                ) : (
                  <span>
                    {params.data.price && params.data.brand
                      ? `$ ${numberToString(
                          params.data.price.price *
                            (1 + params.data.brand.rentabilidad) *
                            1.21
                        )}`
                      : ''}
                  </span>
                )}
              </ProtectedComponent>
            ),
          };
        }
        if (colDef.field === 'actions') {
          return {
            ...colDef,
            cellRenderer: (params) => (
              <CustomComp
                data={params.data}
                props={{
                  selectClientId: selectClientId,
                  addProduct: addProduct,
                  customerDiscounts: customerDiscounts,
                }}
              />
            ),
          };
        }
        return colDef;
      });
    });
  }, [selectClientId, customerDiscounts]);

  return (
    <div className={'ag-theme-quartz'} style={{ height: 685, zoom: 0.96 }}>
      <AgGridReact
        rowData={products.data.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${products.data.totalPages} páginas con ${products.data.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterProducts.pageSize}
              onChange={selectChange}
              options={[
                { key: 20, value: 20, text: 20 },
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterProducts.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={products.data.totalPages}
            onPageChange={changePage}
          />
          <Button
            type="button"
            style={{
              backgroundColor: 'grey',
              border: '1px solid grey',
              height: '40px',
              width: '100px',
              marginLeft: '10px',
            }}
            onClick={() => {
              dispatch(resetFilterProduct(null));
            }}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PosProductsTable;
