import PendingRegistryTable from '../tables/pendingRegistryTable/PendingRegistryTable';
import styles from './pendingDetail.module.css';

function PendingDetail(props) {
  const { data } = props;
  return (
    <div className={styles.tableCont}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <span>
          <i class="fa-solid fa-barcode"></i>
          <span>{data?.product?.article}</span>
        </span>
        <span>
        <i class="fa-solid fa-copyright"></i>
          <span>{data?.product?.brand?.name}</span>
        </span>
        <span>
        <i class="fa-solid fa-check-double"></i>
          <span>{data?.amount}</span>
        </span>
      </div>
      <PendingRegistryTable {...props} />
    </div>
  );
}

export default PendingDetail;
