import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CountInput from '../countInput/CountInput';
import styles from './customCard.module.css';

function CustomCard(props) {
  const { title, headerId } = props;
  return (
    <Card style={{ width: '98%', marginBottom: '15px' }}>
      <Card.Header as="h5" id={styles[headerId]}>
        {title}
      </Card.Header>
      <Card.Body>
        <div className={styles.cardBodyContainer}>
          <div className={styles.infoContainer}>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
          </div>
          <CountInput />
        </div>
      </Card.Body>
    </Card>
  );
}

export default CustomCard;
