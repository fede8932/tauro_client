import { Button, Spinner } from 'react-bootstrap';
import styles from './filterPendingDownload.module.css';
import { Checkbox, Form, FormField } from 'semantic-ui-react';
import { useCallback, useState } from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function FilterPendingDownload(props) {
  const { submitFn, closeModal } = props;
  const [check, setCheck] = useState(false);
  const [radio, setRadio] = useState('pendiente');
  const [dateRange, setDateRange] = useState([]);

  const setButtonDisabled = useCallback(() => {
    if (check && dateRange.length == 0) {
      return true;
    }
    return false;
  }, [check, dateRange]);

  const handleDateChange = (dates, dateStrings) => {
    setDateRange(dateStrings); // `dateStrings` contiene las fechas en formato legible
  };
  const getPending = () => {
    closeModal();
    submitFn({ range: dateRange, radio: check ? radio : 'pendiente' });
  };

  return (
    <div>
      <div className={styles.filterContainer}>
        <div>
          <h6>
            Ingresar el rando de fechas o solo hacer click en el boton imprimir
          </h6>
        </div>
        <div className={styles.filtros}>
          <Checkbox
            label="Aplicar filtros"
            checked={check}
            onChange={() => setCheck(!check)}
          />
          <span className={styles.sp}>*Si no se aplican filtros exporta solo lo pendiente</span>
        </div>
        <div style={{ display: 'flex' }}>
          <RangePicker
            format="DD-MM-YYYY"
            getPopupContainer={(trigger) => trigger.parentNode}
            disabled={!check}
            onChange={handleDateChange}
            placeholder={['Inicio', 'Final']}
          />
          <div style={{ marginTop: '5px', marginLeft: '10px' }}>
            <Checkbox
              disabled={!check}
              radio
              label="Pendiente"
              name="checkboxRadioGroup"
              value="pendiente"
              checked={radio === 'pendiente'}
              onChange={(e, data) => setRadio(data.value)}
            />
            <Checkbox
              disabled={!check}
              style={{ marginLeft: '17px' }}
              radio
              label="Todo"
              name="checkboxRadioGroup"
              value="todo"
              checked={radio === 'todo'}
              onChange={(e, data) => setRadio(data.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonContaainer}>
        <Button
          className={styles.subButton}
          type="button"
          onClick={getPending}
          disabled={setButtonDisabled()}
        >
          {
            /*printPending*/ false ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Imprimir'
            )
          }
        </Button>
      </div>
    </div>
  );
}

export default FilterPendingDownload;
