import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import './Memberships.css';

const ClientePagos = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage
      const response = await axios.get('/pays', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const paymentsData = Object.values(response.data.pay);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="memberships-container">
      <h3>Historial de Pagos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Tipo de Pago</th>
            <th>Plan del Miembro</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{new Date(payment.date).toLocaleDateString()}</td>
              <td>{payment.status ? 'Completado' : 'Pendiente'}</td>
              <td>{payment.payment_type}</td>
              <td>{payment.Member.plan.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClientePagos;
