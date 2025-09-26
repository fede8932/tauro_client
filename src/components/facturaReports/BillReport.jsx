import { Checkbox, Form, FormField, Loader } from 'semantic-ui-react';
import styles from './billReport.module.css';
import { DatePicker } from 'antd';
import { Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBillReportRequest } from '../../request/billRequest';
import Swal from 'sweetalert2';

function BillReport(props) {
  const { closeModal, sellerId } = props;
  // console.log(sellerId)
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState({
    oficial: true,
    presupuesto: false,
    todo: false,
  });
  const [dateRange, setDateRange] = useState([]);
  const { RangePicker } = DatePicker;

  const handleCheckboxChange = (name) => {
    let newCheck = { ...check };
    for (let key in newCheck) {
      if (key == name) {
        newCheck[key] = true;
      } else {
        newCheck[key] = false;
      }
      setCheck(newCheck);
    }
  };

  const handleDateChange = (dates, dateStrings) => {
    // `dates` es un array de objetos moment
    // `dateStrings` es un array de strings en formato 'YYYY-MM-DD'
    setDateRange(dates);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const filters = {
      initDate: dateRange[0],
      endDate: dateRange[1],
      oficial: check.oficial,
      presupuesto: check.presupuesto,
      todo: check.todo,
      sellerId: sellerId,
    };
    try {
      await getBillReportRequest(filters);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Ocurrió un error: ${err.message}`,
        showConfirmButton: false, // Oculta el botón "OK"
        timer: 2500,
      });
    } finally {
      setLoading(false);
      closeModal();
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.boxInput}>
          <label>Selecioná el rango de fechas</label>
          <RangePicker
            onChange={handleDateChange}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={['Inicio', 'Fin']}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </div>
        <div className={styles.check}>
          <Form className={styles.checkCont}>
            <FormField>
              <Checkbox
                label="Oficial"
                checked={check.oficial}
                onChange={() => handleCheckboxChange('oficial')}
              />
            </FormField>
            <FormField>
              <Checkbox
                label="Presupuesto"
                checked={check.presupuesto}
                onChange={() => handleCheckboxChange('presupuesto')}
              />
            </FormField>
            <FormField>
              <Checkbox
                label="Todo"
                checked={check.todo}
                onChange={() => handleCheckboxChange('todo')}
              />
            </FormField>
          </Form>
        </div>
      </div>
      <div className={styles.buttonCont}>
        <Button
          style={{ width: '100px' }}
          disabled={dateRange.length == 0}
          type="button"
          onClick={handleSubmit}
        >
          {loading ? <Spinner size="sm" /> : 'Descargar'}
        </Button>
      </div>
    </>
  );
}

export default BillReport;
