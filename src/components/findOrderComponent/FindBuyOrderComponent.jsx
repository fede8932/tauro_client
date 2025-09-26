import React from 'react';
import styles from './findOrder.module.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function FindBuyOrderComponent(props) {
  const { setView } = props;
  return (
    <div>
      <div className={`${styles.listContainer} ${styles.finContainer}`}>
        <span className={styles.subTitle}>Detalles de orden</span>
        <div className={styles.dataContainer}>
          <Container style={{ margin: '0' }}>
            <Row className={styles.filasFin}>
              <Col className={styles.colUno}>
                <span className={styles.titleInfo}>
                  Razón social:
                  <span className={styles.info}>Pirulino s.r.l.</span>
                </span>
              </Col>
              <Col className={styles.colDos}>
                <span className={styles.titleInfo}>
                  CUIT:
                  <span className={styles.info}>23-34766543-2</span>
                </span>
              </Col>
              <Col className={styles.colTres}>
                <span className={styles.titleInfo}>
                  Tipo IVA:
                  <span className={styles.info}>Responsable inscripto</span>
                </span>
              </Col>
            </Row>
            <Row className={styles.filasFin}>
              <Col className={styles.colUno}>
                <span className={styles.titleInfo}>
                  Estado:
                  <span className={`${styles.info} ${styles.statusTrue}`}>
                    Activo
                  </span>
                </span>
              </Col>
              <Col className={styles.colDos}>
                <span className={styles.titleInfo}>
                  Subtotal:
                  <span className={styles.info}>$72990.00</span>
                </span>
              </Col>
              <Col className={styles.colDos}>
                <span className={styles.titleInfo}>
                  IVA:
                  <span className={styles.info}>$15327.90</span>
                </span>
              </Col>
              <Col className={styles.colTres}>
                <span className={styles.titleInfo}>
                  Total:
                  <span className={styles.info}>$88317,90</span>
                </span>
              </Col>
            </Row>
          </Container>
          <div className={styles.finToOrderContainer}>
            <table className="table">
              <thead className="table-success">
                <tr>
                  <th scope="col" className={styles.colArtWidthDos}>
                    Artículo
                  </th>
                  <th scope="col">Precio unitario</th>
                  <th scope="col">IVA</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col" className={styles.colActWidthDos}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>@fat</td>
                  <td>@twitter</td>
                  <td>@fat</td>
                  <td>@mdo</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer} style={{ marginTop: '20px' }}>
        <Button
          className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
          variant="danger"
          onClick={() => {
            setView('Productos');
            console.log(View);
          }}
        >
          Atras
        </Button>
        <Button
          className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
          variant="success"
          onClick={() => {
            setView('Finalizar');
          }}
        >
          Crear
        </Button>
      </div>
    </div>
  );
}

export default FindBuyOrderComponent;
