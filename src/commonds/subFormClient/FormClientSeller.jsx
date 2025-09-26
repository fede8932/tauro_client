import React from 'react';
import styles from './formClient.module.css';
import Button from 'react-bootstrap/Button';
import { FormProvider } from 'react-hook-form';
import CustomSelect from '../select/CustomSelect';
import { useSelector } from 'react-redux';

const FormClientSeller = (props) => {
  const { selMethods, onSubmitSeller } = props;
  const sellers = useSelector((state) => state.seller.data);
  return (
    <FormProvider {...selMethods}>
      <form
        className={styles.containerTable1}
        onSubmit={selMethods.handleSubmit(onSubmitSeller)}
      >
        {sellers && (
          <CustomSelect
            name="vendedor"
            text="Seleccioná un vendedor si deseas asociarlo"
            arrayOptions={sellers}
            validate={{ required: true }}
          />
        )}
        <Button
          className={styles.selectButton}
          style={{
            backgroundColor: '#673ab7',
            border: '1px solid #673ab7',
          }}
        >
          Asociar
        </Button>
      </form>
    </FormProvider>
  );
};

export default FormClientSeller;
