import React, { useState, useEffect } from 'react';
import styles from './equiv.module.css';
import {
  Button,
  Checkbox,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react';

function EquivalencesComponent(props) {
  const {
    equivalences,
    toggleMarc,
    setText,
    page,
    setPage,
    createEquiv,
    deleteFn,
    editFn,
    reemplceEquiv,
  } = props;

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setText(inputValue);
    }, 500); // El tiempo de debounce (500 ms en este caso)

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const handleChange = (e) => {
    setPage(1);
    setInputValue(e.target.value);
  };

  const handlePageChange = (_e, d) => {
    setPage(d.activePage);
  };

  const handleClick = () => {
    if (!equivalences?.equivalence) {
      createEquiv();
    } else {
      reemplceEquiv();
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          backgroundColor: '#DFE4E8',
        }}
      >
        <span>
          <i className="fa-solid fa-barcode"></i>
          <span className={styles.selectArticle}>
            {equivalences?.product?.article}
          </span>
        </span>
        <span>
          <i className="fa-solid fa-magnifying-glass-chart"></i>
          <span className={styles.selectArticle}>
            {equivalences?.product?.description.slice(0, 90)}
          </span>
        </span>
      </div>
      <div className={styles.addUserContainer}>
        <div className={styles.leftCont}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Input
              icon="search"
              placeholder="Search..."
              className={styles.input}
              onChange={handleChange}
              value={inputValue}
            />
            <Button
              primary
              loading={equivalences.loading}
              className={styles.button}
              onClick={handleClick}
            >
              {equivalences?.equivalence ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
          <div className={styles.tableOneContainer}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={1}>Marc</TableHeaderCell>
                  <TableHeaderCell width={3}>Articulo</TableHeaderCell>
                  <TableHeaderCell width={9}>Descripción</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.products?.list.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Checkbox
                        checked={p.marc}
                        onChange={() => {
                          toggleMarc(p.id);
                        }}
                      />
                    </TableCell>
                    <TableCell>{p.article}</TableCell>
                    <TableCell style={{ fontSize: '9px' }}>
                      {p.description.slice(0, 90)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={styles.paginationCont}>
            <Pagination
              boundaryRange={0}
              activePage={page}
              onPageChange={handlePageChange}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={equivalences?.products.totalPages}
            />
          </div>
        </div>
        <div className={styles.rigthCont}>
          <div className={styles.equivContainer}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={9}>Description</TableHeaderCell>
                  <TableHeaderCell width={1}>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.equivalence ? (
                  <TableRow>
                    <TableCell style={{ fontSize: '9px' }}>
                      {equivalences?.equivalence?.description}
                    </TableCell>
                    <TableCell>
                      <i
                        onClick={() => {
                          editFn(equivalences?.equivalence?.id);
                        }}
                        className={`${styles.editIcon} fa-regular fa-pen-to-square`}
                      ></i>
                      <i
                        onClick={() => {
                          deleteFn(equivalences?.equivalence?.id);
                        }}
                        className={`${styles.deleteIcon} fa-regular fa-trash-can`}
                      ></i>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className={styles.prodEquivCont}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={2}>Articulo</TableHeaderCell>
                  <TableHeaderCell width={8}>Descripción</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.equivalencesProducts?.map((ep, i) => (
                  <TableRow key={i}>
                    <TableCell
                      style={ep.new ? { backgroundColor: '#A5FFD5' } : {}}
                    >
                      {ep.article}
                    </TableCell>
                    <TableCell
                      style={
                        ep.new
                          ? { backgroundColor: '#A5FFD5', fontSize: '9px' }
                          : { fontSize: '9px' }
                      }
                    >
                      {ep.description.slice(0, 45)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquivalencesComponent;
