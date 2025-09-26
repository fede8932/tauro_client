import React, { useState } from 'react';
import styles from './addClient.module.css';
import AddClientContainer from '../../containers/AddClientContainer';
import CustomStep from '../../components/step/CustomStep';
import SubFormAddClientContainer from '../../containers/SubFormAddClientContainer';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

function AddClient(props) {
  const { initView } = props;
  const [view, setView] = useState(initView);
  const steps = [
    {
      title: 'Cliente',
    },
    {
      title: 'Descuentos',
    },
  ];

  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Registrar cliente</h6>
      <div>
        <CustomStep steps={steps} type="client" view={view} />
        <div style={{ marginTop: '30px' }}>
          {view == 0 ? (
            <AddClientContainer nextFn={setView} type="client" />
          ) : null}
          {view == 1 ? (
            <ProtectedComponent listAccesss={[1, 2, 5]}>
              <SubFormAddClientContainer nextFn={setView} type="client" />
            </ProtectedComponent>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AddClient;
