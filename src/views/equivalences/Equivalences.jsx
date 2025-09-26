import React from 'react';
import styles from './equivalences.module.css';
import EquivalencesContainer from '../../containers/EquivalencesContainer';

function Equivalences() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Configuración de equivalencias</h6>
      <div>
        <EquivalencesContainer />
      </div>
    </div>
  );
}

export default Equivalences;
