import React, { useState } from 'react';
import styles from './nativeTable.module.css';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import { Checkbox } from 'semantic-ui-react';

function NativeTable(props) {
  const {
    columns,
    dataRender,
    changePage,
    actions,
    pagination,
    toggleEcommerce,
  } = props;
  const [rowSelect, selectRowSelect] = useState(null);

  // console.log(dataRender);

  const ActionsContainer = (props) => {
    const { actions, index, images, id } = props;
    return (
      <div className={styles.buttonsContainer}>
        {actions.map((action, i) => {
          const newProps = action.props;
          newProps.id = id;
          newProps.index = index;
          newProps.images = images ? images : undefined;
          return action.component(newProps);
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.headRow}>
          {columns.map((col, i) => (
            <div
              key={i}
              className={styles.headCell}
              style={{ width: `${col.width}` }}
            >
              {col.title}
            </div>
          ))}
        </div>
        <div className={styles.body}>
          {dataRender.list.map((item, i) => (
            <div
              key={i}
              className={rowSelect == i ? styles.rowSelect : styles.row}
              onClick={() => {
                selectRowSelect(i);
              }}
            >
              {columns.map((col, j) => (
                <div
                  key={j}
                  style={{ width: `${col.width}` }}
                  className={styles.cell}
                >
                  {col.renderProp != null ? (
                    col.renderProp != 'check' ? (
                      <p>{item[col.renderProp]}</p>
                    ) : (
                      <Checkbox
                        checked={item.check}
                        onChange={() => toggleEcommerce(item.id)}
                      />
                    )
                  ) : (
                    <ActionsContainer
                      actions={actions}
                      index={i}
                      images={item.images}
                      id={item.id}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.pagContainer}>
        {dataRender.totalRows > 0 && pagination ? (
          <CustomPagination
            pages={dataRender.totalPages}
            changeFn={changePage}
            initPage={1}
          />
        ) : null}
      </div>
    </div>
  );
}

export default NativeTable;
