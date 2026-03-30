import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProductsAndEquivalencesRequest } from '../../../redux/productEquivalence';
import { discountApplicationV2, numberToString } from '../../../utils';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './productsTables.module.css';
import IconButonUsersTable from '../../../commonds/iconButtonUsersTable/IconButonUsersTable';
import {
  resetFilterProduct,
  setFilterProduct,
} from '../../../redux/filtersProducts';
import { Button } from 'react-bootstrap';
import ProtectedComponent from '../../../protected/protectedComponent/ProtectedComponent';
import ActionModalContainer from '../../../containers/ActionModalContainer';

const CustomComp = ({ data, props }) => {
  const { selectClientId, addProduct, customerDiscounts } = props;
  
  if (data.type === 'EQUIVALENCE') {
    // Para equivalencias: mostrar botón de imagen de la equivalencia
    const equivImages = data.image ? [data.image] : [];
    return (
      <div className={styles.buttonContainer}>
        <ActionModalContainer
          type="infoProduct"
          icon="fa-regular fa-images"
          size="lg"
          popupText="Ver imagen de equivalencia"
          images={equivImages}
        />
      </div>
    );
  }

  // Mock object for utils function
  const productMock = {
      price: { price: data.cost },
      brand: { id: data.brandId, rentabilidad: data.rentabilidad }
  };

  const productImages = data.images || [];

  return (
    <div className={styles.buttonContainer}>
      <ActionModalContainer
        type="infoProduct"
        icon="fa-regular fa-images"
        size="lg"
        popupText="Ver imagen del producto"
        images={productImages}
      />
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <IconButonUsersTable
          disabled={!selectClientId}
          popupText="Agregar a orden"
          fn={() =>
            addProduct(
              data.id,
              data.brandId,
              data.article,
              discountApplicationV2(customerDiscounts, productMock, true).initPrice,
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

// Componente interno memoizado que maneja su propio estado de expansión
const AgGridWrapper = React.memo(function AgGridWrapper({ 
  equivalences, 
  standaloneProducts, 
  selectClientId, 
  customerDiscounts, 
  addProduct 
}) {
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const pendingScrollRef = useRef(null);

  const getGridViewport = useCallback(() => {
    return containerRef.current?.querySelector('.ag-body-viewport');
  }, []);

  const toggleExpand = useCallback((eqId) => {
    // Guardar scroll de TODOS los posibles contenedores ANTES de cambiar el estado
    const viewport = containerRef.current?.querySelector('.ag-body-viewport');
    const savedScroll = {
      viewport: viewport?.scrollTop ?? 0,
      window: window.scrollY,
    };
    pendingScrollRef.current = savedScroll;

    setExpandedIds(prev => {
      if (prev.includes(eqId)) {
        return prev.filter(e => e !== eqId);
      } else {
        return [...prev, eqId];
      }
    });
  }, []);

  // Restaurar scroll después de que React actualice el DOM
  useEffect(() => {
    if (pendingScrollRef.current === null) return;
    const saved = pendingScrollRef.current;
    pendingScrollRef.current = null;

    // Restaurar en el próximo frame para que el DOM ya esté actualizado
    requestAnimationFrame(() => {
      const viewport = containerRef.current?.querySelector('.ag-body-viewport');
      if (viewport) viewport.scrollTop = saved.viewport;
      window.scrollTo(0, saved.window);

      // Doble seguridad: restaurar de nuevo por si Ag-Grid sobreescribe
      requestAnimationFrame(() => {
        const vp = containerRef.current?.querySelector('.ag-body-viewport');
        if (vp) vp.scrollTop = saved.viewport;
        window.scrollTo(0, saved.window);
      });
    });
  }, [expandedIds]);

  const rowData = useMemo(() => {
    const rows = [];

    equivalences.forEach(eq => {
      rows.push({
        ...eq,
        type: 'EQUIVALENCE',
        brandName: 'Equivalencia',
        stockValue: eq.totalStock,
        priceValue: null,
        _isExpanded: expandedIds.includes(eq.id)
      });
      if (expandedIds.includes(eq.id)) {
        eq.products.forEach(prod => {
          rows.push({
            ...prod,
            type: 'EQUIV_PRODUCT',
            parentId: eq.id,
            brandName: prod.brand,
            stockValue: prod.stock,
            priceValue: prod.price
          });
        });
      }
    });

    standaloneProducts.forEach(prod => {
      rows.push({
        ...prod,
        type: 'PRODUCT',
        brandName: prod.brand,
        stockValue: prod.stock,
        priceValue: prod.price
      });
    });

    return rows;
  }, [equivalences, standaloneProducts, expandedIds]);

  const columnDefs = useMemo(() => [
    {
        headerName: '',
        field: 'expand',
        width: 50,
        cellRenderer: (params) => {
          if (params.data.type !== 'EQUIVALENCE') return null;
          const isExpanded = params.data._isExpanded;
          return (
            <div 
              onClick={() => params.context.toggleExpand(params.data.id)} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
            >
              <i 
                className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}`} 
                style={{ 
                    color: isExpanded ? 'red' : 'green', 
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}
              ></i>
            </div>
          );
        }
    },
    {
        headerName: 'Tipo',
        field: 'type',
        width: 120,
        valueGetter: (params) => {
            switch(params.data.type) {
                case 'EQUIVALENCE': return 'Equivalencia';
                case 'EQUIV_PRODUCT': return '↳ Producto';
                case 'PRODUCT': return 'Producto';
                default: return '';
            }
        },
        cellStyle: (params) => {
            if (params.data.type === 'EQUIV_PRODUCT') return { paddingLeft: '20px', fontStyle: 'italic' };
            if (params.data.type === 'EQUIVALENCE') return { fontWeight: 'bold' };
            return null;
        }
    },
    {
      headerName: 'Artículo',
      field: 'article',
      headerComponent: () => <HeaderInput title="Artículo" name={'article'} />,
      width: 150,
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
      cellStyle: (params) => {
         if (params.data.type === 'EQUIV_PRODUCT') return { paddingLeft: '20px' };
         return null;
      }
    },
    {
      headerName: 'Descripción',
      headerComponent: () => (
        <HeaderInput title="Descripción" name={'description'} />
      ),
      valueGetter: (params) => {
        if (!params.data.description) return '';
        const desc = params.data.description;
        if (/^despiece/i.test(desc)) return 'DESPIECE';
        return desc.toUpperCase();
      },
      width: 500,
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
    },
    {
      headerName: 'Marca',
      field: 'brandName',
      headerComponent: () => <HeaderInput title="Marca" name={'brand'} />,
      width: 150,
      filterParams: {
        filterOptions: ['contains'],
        suppressFilterButton: true,
      },
    },
    {
      headerName: 'Stock',
      field: 'stockValue',
      filter: false,
      width: 80,
    },
    {
      headerName: 'Ubicación',
      field: 'location',
      sortable: false,
      filter: false,
      width: 100,
    },
    {
      headerName: 'Precio cIva',
      field: 'sellPriceIva',
      sortable: false,
      cellRenderer: (params) => {
        if (params.data.type === 'EQUIVALENCE') return null;

        const productMock = {
            price: { price: params.data.cost },
            brand: { id: params.data.brandId, rentabilidad: params.data.rentabilidad }
        };
        
        return (
            <ProtectedComponent listAccesss={[1, 2, 3, 5, 6]}>
            {params.context.selectClientId ? (
                <span>
                {params.data.priceValue
                    ? `$ ${numberToString(
                        discountApplicationV2(params.context.customerDiscounts, productMock, true)
                        .endPrice
                    )}`
                    : ''}
                </span>
            ) : (
                <span>
                {params.data.priceValue
                    ? `$ ${numberToString(params.data.priceValue)}`
                    : ''}
                </span>
            )}
            </ProtectedComponent>
        );
      },
      filter: false,
      width: 125,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{
            selectClientId: params.context.selectClientId,
            addProduct: params.context.addProduct,
            customerDiscounts: params.context.customerDiscounts,
          }}
        />
      ),
      field: 'actions',
      sortable: false,
      filter: false,
      width: 130,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: false
  }), []);

  const context = useMemo(() => ({
    selectClientId,
    customerDiscounts,
    addProduct,
    toggleExpand
  }), [selectClientId, customerDiscounts, addProduct, toggleExpand]);

  // Refresh cells when selectClientId or customerDiscounts change
  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshCells({ force: true });
    }
  }, [selectClientId, customerDiscounts]);

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        context={context}
        getRowId={(params) => params.data.type === 'EQUIVALENCE' ? `equiv-${params.data.id}` : `prod-${params.data.id}-${params.data.parentId || ''}`}
        getRowStyle={(params) => {
            if (params.data.type === 'EQUIVALENCE') {
                return { background: '#f8f9fa' };
            }
            if (params.data.type === 'EQUIV_PRODUCT') {
                return { background: '#ffffff' };
            }
            return null;
        }}
      />
    </div>
  );
});

function PosProductsTableV2(props) {
  const { selectClientId, customerDiscounts, addProduct } = props;
  const filterProducts = useSelector((state) => state.filterProduct);
  const productEquivalence = useSelector((state) => state.productEquivalence);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(searchProductsAndEquivalencesRequest(filterProducts));
  }, [filterProducts]);

  const selectChange = (e, d) => {
    dispatch(setFilterProduct({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterProduct({ name: 'page', value: d.activePage }));
  };

  // Memoizar los datos para evitar re-renders innecesarios del AgGridWrapper
  const equivalences = useMemo(() => productEquivalence.data.list || [], [productEquivalence.data.list]);
  const standaloneProducts = useMemo(() => productEquivalence.data.standaloneProducts || [], [productEquivalence.data.standaloneProducts]);

  return (
    <div className={'ag-theme-quartz'} style={{ height: 685, zoom: 0.96 }}>
      <AgGridWrapper
        equivalences={equivalences}
        standaloneProducts={standaloneProducts}
        selectClientId={selectClientId}
        customerDiscounts={customerDiscounts}
        addProduct={addProduct}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${productEquivalence.data.totalPages} páginas con ${productEquivalence.data.totalRows} resultados.`}</span>
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
            totalPages={productEquivalence.data.totalPages}
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

export default PosProductsTableV2;
