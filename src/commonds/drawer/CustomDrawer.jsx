import React, { useEffect, useState } from 'react';
import styles from './customDrawer.module.css';
import { Drawer, Space } from 'antd';
import InfoButton from '../infoButton/InfoButton';
import CustomTable from '../table/CustomTable';
import { Input } from 'semantic-ui-react';
import { searchInList } from '../../utils';
import { deleteNoMarcOrderItemsRequest } from '../../redux/addOrderItems';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
const CustomDrawer = (props) => {
  const {
    type,
    orderType,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    listOrder,
    orderAjust,
  } = props;

  // console.log(listOrder); // Llega OK
  // console.log(orderAjust);

  const [filterList, setFilterList] = useState(listOrder);
  const [searchValue, setSearchValue] = useState('');

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (e, d) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue == '') {
      setFilterList(listOrder);
      return;
    }
    const keys = searchValue.trim().toLowerCase().split(/\s+/);
    const newList = listOrder.filter((item) =>
      searchInList(
        keys,
        item.product.article.toLowerCase(),
        item.product.description.toLowerCase()
      )
    );
    setFilterList(newList);
  }, [searchValue, listOrder]);

  const deleteNoMarc = () => {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Vas a eliminar los items que no estan marcados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let listId = [];
        let lap = 0;
        while (lap < listOrder.length) {
          if (!listOrder[lap].noRemove) listId.push(listOrder[lap].id);
          lap++;
        }
        // console.log(listOrder)
        // console.log(listId);
        dispatch(deleteNoMarcOrderItemsRequest(listId));
      }
    });
  };

  return (
    <>
      <InfoButton
        text={orderType === 'OC' ? 'Detalle de compra' : 'Detalle de venta'}
        onClick={showDrawer}
      />
      <Drawer
        title={
          orderType === 'OC'
            ? 'Detalle de orden de compra'
            : 'Detalle de orden de venta'
        }
        width={820}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={<Space></Space>}
      >
        <div>
          <Input
            placeholder="Search..."
            loading={false}
            onChange={handleSearchChange}
            value={searchValue}
          />
          <Button
            style={{ marginLeft: '35px', marginTop: '-5px' }}
            variant="danger"
            onClick={deleteNoMarc}
          >
            Eliminar no marcado
          </Button>
          {orderType === 'OC' ? (
            <div>
              <div className={styles.listContainer}>
                <span className={styles.subTitle}>Productos en orden</span>
                <div className={styles.prodToOrderContainer}>
                  <CustomTable
                    objective={type}
                    type="list"
                    fnDelete={fnDelete}
                    color="teal"
                    products={
                      type !== 'ajuste'
                        ? filterList
                        : orderAjust.data.ajustOrderItems
                    }
                    fnUpdate={fnUpdate}
                    fnPrUpdate={fnPrUpdate}
                    colum={[
                      { title: 'Check', width: '2%' },
                      { title: 'Artículo', width: '26%' },
                      { title: 'Marca', width: '18%' },
                      { title: 'Precio', width: '17%' },
                      { title: 'Cantidad', width: '10%' },
                      { title: 'Subtotal', width: '22%' },
                      { title: 'Acción', width: '5%' },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {orderType === 'OS' ? (
            <div>
              <div className={styles.listContainer}>
                <span className={styles.subTitle}>Productos en orden</span>
                <div className={styles.prodToOrderContainer}>
                  <CustomTable
                    type="list-sell"
                    process="sell"
                    fnDelete={fnDelete}
                    color="teal"
                    products={filterList}
                    fnUpdate={fnUpdate}
                    fnPrUpdate={fnPrUpdate}
                    colum={[
                      { title: 'Check', width: '2%' },
                      { title: 'Artículo', width: '25%' },
                      { title: 'Marca', width: '20%' },
                      { title: 'Precio', width: '17%' },
                      { title: 'Cantidad', width: '12%' },
                      { title: 'Subtotal', width: '16%' },
                      { title: 'Acción', width: '10%' },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Drawer>
    </>
  );
};
export default CustomDrawer;
