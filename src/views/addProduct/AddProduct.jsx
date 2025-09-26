import React from 'react';
import styles from './addProduct.module.css';
import AddProductFormContainer from '../../containers/AddProductFormContainer';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router';

function AddProduct(props) {
  const { view } = props;
  const navigate = useNavigate();
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>
        {view == 'single' ? 'Registrar producto' : 'Registrar productos'}
      </h6>
      <div className={styles.uploadContainer}>
        {view == 'single' ? (
          <Button
            onClick={() => {
              navigate('/add/products');
            }}
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <span style={{ marginLeft: '5px' }}>Subir</span>
          </Button>
        ) : null}
      </div>
      <div>{view == 'single' ? <AddProductFormContainer /> : null}</div>
      <div>
        {view == 'group' ? <AddProductFormContainer {...props} /> : null}
      </div>
    </div>
  );
}

export default AddProduct;
