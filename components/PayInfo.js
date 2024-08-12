// src/components/PayInfo.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Asegúrate de que esta es la configuración correcta de Axios
import { Table, Alert } from 'react-bootstrap';


const PayInfo = () => {
  const [payInfo, setPayInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPayInfo = async () => {
    try {
      const response = await axios.get('/pays_info', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data && response.data.success) {
        setPayInfo(Object.values(response.data.pay));
      } else {
        setErrorMessage('Error al obtener la información de pagos.');
      }
    } catch (error) {
      console.error('Error fetching pay info:', error);
      setErrorMessage('Error al conectar con el servidor.');
    }
  };

  useEffect(() => {
    fetchPayInfo();
  }, []);

  return (
    <div className="pay-info-container">
      <h3>Información de Pagos</h3>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Plan</th>
            <th>Precio del Plan</th>
            <th>Duración del Plan</th>
            <th>Primera Fecha de Pago</th>
            <th>Última Fecha de Pago</th>
            <th>Próxima Fecha de Pago</th>
            <th>Días Restantes</th>
          </tr>
        </thead>
        <tbody>
          {payInfo.map((pay) => (
            <tr key={pay.id}>
              <td>{pay.id}</td>
              <td>{pay.plan_name}</td>
              <td>${pay.plan_price}</td>
              <td>{pay.plan_duration} días</td>
              <td>{new Date(pay.first_payment_date).toLocaleDateString()}</td>
              <td>{new Date(pay.last_payment_date).toLocaleDateString()}</td>
              <td>{new Date(pay.next_payment_date).toLocaleDateString()}</td>
              <td>{pay.days_remaining}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PayInfo;
