import React, { useState, useEffect, useRef } from 'react';
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
    uploadImage,
    removeImage,
    selectImage,
  } = props;

  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = '';
  };

  const currentImageId = equivalences?.equivalence?.image?.id;

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
              autoComplete="off"
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
          <div className={styles.equivImgContainer}>
            <div className={styles.equivImgHeader}>
              <span>Imágenes del grupo</span>
              <div className={styles.equivImgHeaderIcons}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <i
                  onClick={() => fileInputRef.current?.click()}
                  className="fa-solid fa-upload"
                  title="Subir imagen para el grupo"
                ></i>
                {equivalences?.equivalence?.image && (
                  <i
                    onClick={removeImage}
                    className={`fa-solid fa-trash-can ${styles.trashIcon}`}
                    title="Quitar imagen del grupo"
                  ></i>
                )}
              </div>
            </div>
            <div className={styles.equivImgMain}>
              {equivalences?.equivalence?.image ? (
                <img
                  src={equivalences.equivalence.image.url}
                  alt="Imagen del grupo"
                />
              ) : (
                <span>Sin imagen propia</span>
              )}
            </div>
            <div className={styles.equivImgList}>
              {equivalences?.equivalencesProducts?.length ? (
                equivalences.equivalencesProducts
                  .filter((p) => p.images && p.images.length > 0)
                  .flatMap((p) =>
                    (p.images || []).map((img) => ({ img, article: p.article }))
                  )
                  .map(({ img, article }) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={article}
                      title={`${article}${currentImageId === img.id ? ' (imagen actual)' : ''}`}
                      className={`${styles.equivImgThumb} ${
                        currentImageId === img.id ? styles.active : ''
                      }`}
                      onClick={() => selectImage(img.id)}
                    />
                  ))
              ) : (
                <span className={styles.equivImgEmpty}>
                  Sin imágenes de productos
                </span>
              )}
            </div>
          </div>
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
                  <TableHeaderCell width={2}>Código</TableHeaderCell>
                  <TableHeaderCell width={7}>Description</TableHeaderCell>
                  <TableHeaderCell width={1}>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.equivalence ? (
                  <TableRow>
                    <TableCell style={{ fontSize: '10px', fontWeight: 'bold' }}>
                      {equivalences?.equivalence?.code ?? '-'}
                    </TableCell>
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
