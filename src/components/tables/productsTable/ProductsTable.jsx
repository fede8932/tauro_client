import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProductsExtraRequest } from '../../../redux/product';
import { discountApplicationV2, numberToString } from '../../../utils';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './productsTables.module.css';
import ActionModalContainer from '../../../containers/ActionModalContainer';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import CustomModal from '../../../commonds/customModal/CustomModal';
import EditProductContainer from '../../../containers/EditProductContainer';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import { useNavigate } from 'react-router';
import {
  resetEquivFilter,
  setEquivFilter,
  setFilterProduct,
} from '../../../redux/filtersProducts';
import AddManualPendingContainer from '../../../containers/AddManualPendingContainer';
import AddProductToSellContainer from '../../../containers/AddProductToSellContainer';

const CustomComp = ({ data, props }) => {
  const { deleteProduct, selectClientId /*, addProduct*/ } = props;
  const navigate = useNavigate();
  // console.log(selectClientId);
  return (
    <div className={styles.buttonContainer}>
      <ActionModalContainer
        type="infoProduct"
        icon="fa-regular fa-images"
        size="lg"
        popupText="Ver imágenes"
        images={
          data.images.length > 0
            ? data.images
            : data.equivalence?.images?.length > 0
              ? data.equivalence?.images
              : []
        }
      />
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <CustomModal
          title="Editar Producto"
          size="lg"
          actionButton={
            <buton className={styles.iconB}>
              <i class="fa-regular fa-pen-to-square"></i>
            </buton>
          }
          bodyModal={(props) => (
            <EditProductContainer {...props} id={data.id} />
          )}
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Ofertas"
          fn={() => navigate(`/product/sale/${data.id}`)}
          icon="fa-solid fa-piggy-bank"
          iconInitialStyle={
            data.sales?.findIndex((s) => s.status) > -1 ||
            data.brand.sales?.findIndex((s) => s.status) > -1
              ? 'iconStyleTeal'
              : 'iconStyleBlack'
          }
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <CustomModal
          title="Agregar pendientes"
          size="lg"
          actionButton={
            <buton className={styles.iconC}>
              <i class="fa-solid fa-clock-rotate-left"></i>
            </buton>
          }
          bodyModal={(props) => (
            <AddManualPendingContainer {...props} id={data.id} />
          )}
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <CustomModal
          title="Agregar a pedido"
          size="lg"
          actionButton={
            <buton
              className={
                !selectClientId ? styles.iconStyleGrey : styles.iconStyleGreen
              }
            >
              <i class="fa-solid fa-cart-plus"></i>
            </buton>
          }
          bodyModal={(props) => (
            <AddProductToSellContainer
              {...props}
              productId={data.id}
              brandId={data.brand.id}
              selectClientId={selectClientId}
            />
          )}
        />
      </ProtectedComponent>
      {/* <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <IconButonUsersTable
          disabled={!selectClientId}
          popupText="Agregar a orden"
          fn={() => addProduct(data.id, data.brand.id)}
          icon="fa-solid fa-cart-plus"
          iconInitialStyle={
            !selectClientId ? 'iconStyleGrey' : 'iconStyleGreen'
          }
        />
      </ProtectedComponent> */}
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Eliminar"
          fn={() => deleteProduct(data.id)}
          icon="fa-regular fa-trash-can"
          iconInitialStyle="iconStyleRed"
        />
      </ProtectedComponent>
    </div>
  );
};

const Equivalences = ({ data, props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { equivalenceId } = useSelector((state) => state.filterProduct);
  // console.log(equivalenceId);
  return (
    <div className={styles.buttonContainer}>
      <IconButonUsersTable
        disabled={!data.equivalenceId}
        popupText={equivalenceId ? 'Quitar filtro' : 'Ver equivalencias'}
        fn={() => {
          equivalenceId
            ? dispatch(resetEquivFilter())
            : dispatch(setEquivFilter(data.equivalenceId));
        }}
        icon={equivalenceId ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}
        iconInitialStyle={
          !data.equivalenceId
            ? 'iconStyleGrey'
            : equivalenceId
              ? 'iconStyleRed'
              : 'iconStyleBlue'
        }
      />
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <IconButonUsersTable
          popupText="Editar equivalencia"
          fn={() => {
            navigate(`/equivalences/${data.id}`);
          }}
          icon="fa-solid fa-scale-balanced"
          iconInitialStyle="iconStyleTeal"
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
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
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

function ProductsTable(props) {
  const { deleteProduct, selectClientId, customerDiscounts, addProduct } =
    props;

  // console.log('id', selectClientId);
  const filterProducts = useSelector((state) => state.filterProduct);

  const dispatch = useDispatch();

  const products = useSelector((state) => state.product);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'Artículo',
      field: 'article',
      headerComponent: () => <HeaderInput title="Artículo" name={'article'} />,
      width: 150,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Descripción',
      field: 'description',
      headerComponent: () => (
        <HeaderInput title="Descripción" name={'description'} />
      ),
      width: 650,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Marca',
      field: 'brand',
      headerComponent: () => <HeaderInput title="Marca" name={'brand'} />,
      valueGetter: (params) =>
        params.data.brand ? params.data.brand.name : '',
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Ubicación',
      field: 'location',
      headerComponent: () => <HeaderInput title="Ubicación" name={'location'} />,
      sortable: false,
      filter: false,
      width: 90,
    },
    {
      headerName: 'Equivalencias',
      cellRenderer: (params) => <Equivalences data={params.data} />,
      field: 'equiv',
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: 'Costo',
      field: 'price',
      cellRenderer: (params) => (
        <ProtectedComponent listAccesss={[1, 2]}>
          <span>
            {params.data.price
              ? `$ ${numberToString(params.data.price.price)}`
              : ''}
          </span>
        </ProtectedComponent>
      ),
      filter: false,
      width: 120,
      sortable: false,
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
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{
            deleteProduct: deleteProduct,
            selectClientId: selectClientId,
            addProduct: addProduct,
          }}
        />
      ),
      field: 'actions',
      sortable: false,
      filter: false,
      width: 165,
    },
    {
      headerName: 'Precio',
      field: 'sellPrice',
      sortable: false,
      cellRenderer: (params) => (
        <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
          {selectClientId ? (
            <span>
              {params.data.price && params.data.brand
                ? `$ ${numberToString(
                    discountApplicationV2(customerDiscounts, params.data, true)
                      .initPrice
                  )}`
                : ''}
            </span>
          ) : (
            <span>
              {params.data.price && params.data.brand
                ? `$ ${numberToString(
                    params.data.price.price *
                      (1 + params.data.brand.rentabilidad)
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
      width: 155,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(searchProductsExtraRequest(filterProducts));
    return () => {
      // dispatch(resetProductSearch());
      // dispatch(resetFilterProduct());
    };
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
        if (colDef.field === 'sellPrice') {
          return {
            ...colDef,
            cellRenderer: (params) => (
              <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
                {selectClientId ? (
                  <span>
                    {params.data.price && params.data.brand
                      ? `$ ${numberToString(discountApplicationV2(customerDiscounts, params.data, true).initPrice)}`
                      : ''}
                  </span>
                ) : (
                  <span>
                    {params.data.price && params.data.brand
                      ? `$ ${numberToString(
                          params.data.price.price *
                            (1 + params.data.brand.rentabilidad)
                        )}`
                      : ''}
                  </span>
                )}
              </ProtectedComponent>
            ),
          };
        }
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
                  deleteProduct: deleteProduct,
                  selectClientId: selectClientId,
                  addProduct: addProduct,
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
    <div className={'ag-theme-quartz'} style={{ height: 665 }}>
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
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;
