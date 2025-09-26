import CustomInput from '../../commonds/putInput/CustomInput';
import { FormProvider } from 'react-hook-form';
import styles from './addPending.module.css';
import { Button, Spinner } from 'react-bootstrap';
import CustomSelect from '../../commonds/select/CustomSelect';

function AddPending(props) {
  const { methods, handleSubmit, clients } = props;

  return (
    <FormProvider {...methods}>
      <form>
        <div className={styles.inpFlex}>
          <div className={styles.medium}>
            <label>Cliente</label>
            <CustomSelect
              name="client"
              text="Seleccioná el cliente"
              arrayOptions={clients}
              validate={{ required: false }}
            />
          </div>
          <div className={styles.medium}>
            <label>Cantidad</label>
            <CustomInput
              readOnly={false}
              name="amount"
              type="text"
              width="large"
              placeholder="Cantidad"
              icon="fa-solid fa-box-open"
              validate={{ required: true }}
            />
          </div>
        </div>
        <div className={styles.buttoContainer}>
          <Button
            onClick={methods.handleSubmit(handleSubmit)}
            type="button"
            style={{
              backgroundColor: '#673ab7',
              border: '1px solid #673ab7',
              height: '35px',
              width: '100px',
              marginLeft: '10px',
            }}
          >
            {!false ? (
              'Guardar'
            ) : (
              <Spinner animation="border" variant="light" size="sm" />
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export default AddPending;
