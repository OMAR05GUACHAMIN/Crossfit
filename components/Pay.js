import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import PayForm from './PayForm';
import './Pay.css';

const Pay = () => {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/pays', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const paymentsData = Object.values(response.data.pay);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleShowModal = (payment = null) => {
    setCurrentPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPayment(null);
  };

  const handleAddOrUpdatePayment = async (paymentData) => {
    try {
      if (currentPayment) {
        await axios.put(`/pays/${currentPayment.id}`, paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments(payments.map(p => p.id === currentPayment.id ? { ...paymentData, id: currentPayment.id } : p));
      } else {
        const response = await axios.post('/pays', paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments([...payments, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`/pays/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments(payments.filter(payment => payment.id !== id));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return (
    <div className="pay-container">
      <h3>Gestión de Pagoss</h3>
      <Button variant="success" onClick={() => handleShowModal()}>Nuevo Pagos</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Member ID</th>
            <th>Tipo de Pago</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.date}</td>
              <td>{payment.memberId}</td>
              <td>{payment.payment_type}</td>
              <td>{payment.status ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(payment)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDeletePayment(payment.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal && (
        <PayForm
          showModal={showModal}
          handleClose={handleCloseModal}
          addPayment={handleAddOrUpdatePayment}
          currentPayment={currentPayment || {}}
        />
      )}
    </div>
  );
};

export default Pay;
