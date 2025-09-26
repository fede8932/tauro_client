import { Button, Spinner } from 'react-bootstrap';
import styles from './filterPayDownload.module.css';
import { Checkbox } from 'semantic-ui-react';
import { useCallback, useState } from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function FilterPayDownload(props) {
  const { submitFn, closeModal } = props;
  const [check, setCheck] = useState(true);
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
  const getPay = () => {
    closeModal();
    submitFn({ range: dateRange });
  };

  return (
    <div>
      <div className={styles.filterContainer}>
        <div>
          <h6>Ingresar el rando de fechas o solo hacer click en el exportar</h6>
        </div>
        <div className={styles.filtros}>
          <Checkbox
            disabled
            label="Aplicar filtros"
            checked={check}
            // onChange={() => setCheck(!check)}
          />
          <span className={styles.sp}>
            *Si no se aplican filtros exporta todos los pagos registrados
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          <RangePicker
            format="DD-MM-YYYY"
            getPopupContainer={(trigger) => trigger.parentNode}
            disabled={!check}
            onChange={handleDateChange}
            placeholder={['Inicio', 'Final']}
          />
        </div>
      </div>
      <div className={styles.buttonContaainer}>
        <Button
          className={styles.subButton}
          type="button"
          onClick={getPay}
          disabled={setButtonDisabled()}
        >
          {
            /*printPending*/ false ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Exportar'
            )
          }
        </Button>
      </div>
    </div>
  );
}

export default FilterPayDownload;
