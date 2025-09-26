import React, { useMemo } from 'react';
import styles from './customTable.module.css';
import { Checkbox, Table } from 'semantic-ui-react';
import IconButton from '../../commonds/iconButton/IconButon';
import TableInput from '../tableInput/TableInput';
import {
  discountApplication,
  numberToString,
  redondearADosDecimales,
} from '../../utils';
import CustomPopup from '../popup/CustomPopup';
import IconButonUsersTable from '../iconButtonUsersTable/IconButonUsersTable';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import {
  factItemToggleRequest,
  toggleNoRemove,
} from '../../redux/addOrderItems';

const CustomTable = (props) => {
  let {
    colum,
    products,
    customerDiscounts,
    color,
    fnInfo,
    fnAdd,
    fnDelete,
    fnUpdate,
    type,
    process,
    setEquivalenceId,
    equivalenceId,
  } = props;

  const dispatch = useDispatch();

  const listOrder = useSelector((state) => state.listOrderItems).data;

  const addItemToBill = (itemId) => {
    dispatch(factItemToggleRequest(itemId));
  };
  
  return (
    <Table color={color} key={color}>
      <Table.Header>
        <Table.Row>
          {colum.map((dataColumn, i) => (
            <Table.HeaderCell key={i} style={{ width: dataColumn.width }}>
              {dataColumn.title}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      {type === 'search' ? (
        <Table.Body>
          {products.length > 0
            ? products.map((p, i) => (
                <Table.Row
                  key={i}
                  style={{ height: '40px', maxHeight: '40px' }}
                >
                  <Table.Cell>{p.article.toUpperCase()}</Table.Cell>
                  <Table.Cell>{p.description.toUpperCase()}</Table.Cell>
                  <Table.Cell>{p.brand.name.toUpperCase()}</Table.Cell>
                  <Table.Cell>
                    <ProtectedComponent
                      listAccesss={[1, 2]}
                    >{`$ ${numberToString(
                      process == 'sell'
                        ? p.price.price * (1 + p.brand.rentabilidad)
                        : p.price.price
                    )}`}</ProtectedComponent>
                  </Table.Cell>
                  {process == 'sell' ? (
                    <Table.Cell>{`$ ${numberToString(
                      p.price.price * (1 + p.brand.rentabilidad) * 1.21
                    )}`}</Table.Cell>
                  ) : null}
                  <Table.Cell>{p.stock.stock}</Table.Cell>
                  <Table.Cell>
                    <div className={styles.butContainer}>
                      <IconButton
                        icon="fa-regular fa-circle-question"
                        iconInitialStyle="iconStyleGrey"
                        fn={fnInfo}
                        product={{ product: p, brand: p.brand }}
                      />
                      <IconButton
                        icon="fa-solid fa-arrow-right-to-bracket"
                        iconInitialStyle="iconStyleBlue"
                        fn={fnAdd}
                        product={{ product: p, brand: p.brand }}
                        style={{ marginLeft: '5px' }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      ) : null}
      {type === 'search-sell' ? (
        <Table.Body>
          {products.length > 0
            ? products.map((p, k) => (
                <Table.Row
                  key={k}
                  style={{ height: '40px', maxHeight: '40px' }}
                >
                  <Table.Cell>{p.article.toUpperCase()}</Table.Cell>
                  <Table.Cell>
                    {
                      <CustomPopup
                        content={p.description.toUpperCase()}
                        characters={80}
                      />
                    }
                  </Table.Cell>
                  <Table.Cell>{p.brand.name.toUpperCase()}</Table.Cell>
                  {/* <Table.Cell>{`$ ${redondearADosDecimales(
                      process == "sell"
                        ? bp.price.price * (1 + bp.price.sellPercentage)
                        : bp.price.price
                    )}`}</Table.Cell> */}
                  <Table.Cell>{`$ ${numberToString(
                    discountApplication(customerDiscounts, p).initPrice
                  )}`}</Table.Cell>
                  <Table.Cell>{`$ ${numberToString(
                    discountApplication(customerDiscounts, p).endPrice
                  )}`}</Table.Cell>
                  <Table.Cell>{p.stock.stock}</Table.Cell>
                  <Table.Cell>
                    <div className={styles.butContainer}>
                      <IconButonUsersTable
                        disabled={!p.equivalenceId}
                        popupText="Ver equivalencias"
                        fn={() => {
                          equivalenceId
                            ? setEquivalenceId(null)
                            : setEquivalenceId(p.equivalenceId);
                        }}
                        icon={
                          equivalenceId
                            ? 'fa-regular fa-eye-slash'
                            : 'fa-regular fa-eye'
                        }
                        iconInitialStyle={
                          !p.equivalenceId
                            ? 'iconStyleGrey'
                            : equivalenceId
                              ? 'iconStyleRed'
                              : 'iconStyleBlue'
                        }
                      />
                      <IconButton
                        icon="fa-solid fa-arrow-right-to-bracket"
                        iconInitialStyle="iconStyleBlue"
                        fn={fnAdd}
                        product={{ product: p, brand: p.brand }}
                        style={{ marginLeft: '5px' }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      ) : null}
      {type === 'list' ? (
        <Table.Body>
          {products.map((p, i) => {
            const precio = p.product.price;
            return (
              <Table.Row key={i} style={{ height: '40px', maxHeight: '40px' }}>
                <Table.Cell>
                  {
                    <Checkbox
                      checked={p.noRemove}
                      onClick={() => dispatch(toggleNoRemove(p.id))}
                    />
                  }
                </Table.Cell>
                <Table.Cell>{p.product.article}</Table.Cell>
                <Table.Cell>{p?.product?.brand?.name}</Table.Cell>
                <Table.Cell>
                  <ProtectedComponent listAccesss={[1, 2]}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {`$ ${numberToString(
                        process != 'sell'
                          ? precio.price
                          : precio.price *
                              (1 + p.product.brand.rentabilidad) *
                              1.21
                      )}`}
                    </span>
                  </ProtectedComponent>
                </Table.Cell>
                <Table.Cell>
                  <input
                    className={styles.inputTable}
                    type="number"
                    key={i}
                    step="1"
                    value={p.amount}
                    onChange={(e) => {
                      if (e.target.value != 0)
                        fnUpdate({ id: p.id, editCamp: e.target.value });
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <ProtectedComponent listAccesss={[1, 2]}>{`$ ${numberToString(
                    process != 'sell'
                      ? p.amount * precio.price
                      : p.amount *
                          (precio.price *
                            (1 + p.product.brand.rentabilidad) *
                            1.21)
                  )}`}</ProtectedComponent>
                </Table.Cell>
                <Table.Cell>
                  <div className={styles.butContainer}>
                    <IconButton
                      key={i}
                      type="delete"
                      icon="fa-regular fa-trash-can"
                      iconInitialStyle={'iconStyleRed'}
                      fn={fnDelete}
                      itemId={p.id}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      ) : null}
      {type === 'list-sell' ? (
        <Table.Body>
          {
            /*listSellOrder*/ products?.map((p, i) => {
              // console.log(p);
              return (
                <Table.Row
                  key={i}
                  style={{ height: '40px', maxHeight: '40px' }}
                >
                  <Table.Cell>{<Checkbox checked={p.noRemove} />}</Table.Cell>
                  <Table.Cell
                    style={
                      p.amount > p.product.stock.stock ? { color: 'red' } : null
                    }
                  >
                    {p.product.article}
                  </Table.Cell>
                  <Table.Cell
                    style={
                      p.amount > p.product.stock.stock ? { color: 'red' } : null
                    }
                  >
                    {p.product.brand?.name}
                  </Table.Cell>
                  <Table.Cell
                    style={
                      p.amount > p.product.stock.stock ? { color: 'red' } : null
                    }
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {`$ ${numberToString(p?.sellPrice /* * 1.21*/)}`}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.inpChangeCont}>
                      {/* <button
                      className={styles.inputChange}
                      onClick={() => {
                        if (p.amount > 1) {
                          fnUpdate({ id: p.id, editCamp: p.amount - 1 });
                        }
                      }}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button> */}
                      {/* <TableInput
                      key={i}
                      type="number"
                      step="1"
                      defValue={p.amount}
                      fn={fnUpdate}
                      dataItem={{ id: p.id }}
                    /> */}
                      <input
                        className={styles.inputTable}
                        type="number"
                        key={i}
                        step="1"
                        value={p.amount}
                        onChange={(e) => {
                          if (e.target.value != 0)
                            fnUpdate({ id: p.id, editCamp: e.target.value });
                        }}
                      />
                      {/* <button
                      className={styles.inputChange}
                      onClick={() => {
                        if (p.product.stock.stock > p.amount) {
                          fnUpdate({ id: p.id, editCamp: p.amount + 1 });
                        }
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button> */}
                    </div>
                  </Table.Cell>
                  <Table.Cell
                    style={
                      p.amount > p.product.stock.stock
                        ? { color: 'red', fontSize: '11px' }
                        : { fontSize: '10px' }
                    }
                  >{`$ ${numberToString(
                    p.amount * p.sellPrice /* * 1.21*/
                  )}`}</Table.Cell>
                  <Table.Cell>
                    <div className={styles.butContainer}>
                      <IconButton
                        key={i}
                        type="delete"
                        icon="fa-regular fa-trash-can"
                        iconInitialStyle={'iconStyleRed'}
                        fn={fnDelete}
                        itemId={p.id}
                        product={{ product: p, brand: p.brand }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          }
        </Table.Body>
      ) : null}
      {type === 'fact' ? (
        <Table.Body>
          {listOrder.map((poi, i) => (
            <Table.Row
              key={poi.id}
              style={{ height: '40px', maxHeight: '40px' }}
            >
              <Table.Cell>{poi.product.article}</Table.Cell>
              <Table.Cell>{poi.product.brand.name}</Table.Cell>
              <Table.Cell>{poi.amount}</Table.Cell>
              <Table.Cell>{`$ ${poi.sellPrice}`}</Table.Cell>
              <Table.Cell>{`$ ${redondearADosDecimales(
                poi.sellPrice * 0.21
              )}`}</Table.Cell>
              <Table.Cell>
                <Checkbox
                  checked={poi.fact}
                  onClick={(e) => {
                    e.preventDefault(); // ← opcional
                    e.stopPropagation(); // ← opcional
                    addItemToBill(poi.id);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      ) : null}
    </Table>
  );
};

export default CustomTable;
