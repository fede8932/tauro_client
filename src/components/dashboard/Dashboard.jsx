import React from 'react';
import styles from './dashboard.module.css';
import Widget from '../../commonds/widget/Widget';
import ChartG from '../chartG.jsx/ChartG';
import ChartT from '../chartG.jsx/ChartT';

function Dashboard(props) {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.widgetContainer}>
        <Widget
          color="violet"
          icon="fa-solid fa-boxes-packing"
          number={48}
          info="Pedidos pendientes"
          comparativa={0.18}
        />
        <Widget
          color="orange"
          icon="fa-solid fa-file-lines"
          number={9}
          info="Controles pendientes"
          comparativa={-0.15}
        />
        <Widget
          color="blue"
          icon="fa-solid fa-comments-dollar"
          number={12}
          info="Precios desactualizados"
          comparativa={0.5}
        />
        <Widget
          color="green"
          icon="fa-solid fa-calendar-check"
          number={21}
          info="Retrasos de pagos"
          comparativa={-0.2}
        />
      </div>
      <div className={styles.graphicContainer}>
        <div className={styles.grapLeft}>
          <ChartG />
        </div>
        <div className={styles.grapRigth}>
          <ChartT />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
