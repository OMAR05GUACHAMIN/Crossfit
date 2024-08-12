import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import Swal from 'sweetalert2';

const PayForm = ({ showModal, handleClose, addOrUpdatePayment, currentPayment }) => {
  const initialState = {
    date: '',
    memberId: '',
    payment_type: '',
    status: true
  };

  const [payment, setPayment] = useState(initialState);
  const [members, setMembers] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('/members');
        const membersData = Object.values(response.data.members);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (currentPayment && currentPayment.id) {
      setPayment({ ...currentPayment });
    } else {
      setPayment(initialState);
    }
  }, [currentPayment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log(payment);
    console.log(currentPayment);
    setErrorMessages([]);
    try {
      payment.memberId = Number(payment.memberId);
      if (currentPayment && currentPayment.id) {
        await axios.put(`/memebers/0/pays/${currentPayment.id}`, payment);
        Swal.fire({
          title: "Pago",
          text: "Pago actualizado con éxito",
          icon: "success"
        });
  
      } else {
        await axios.post('/members/0/pays/', payment);
        Swal.fire({
          title: "Pago",
          text: "Pago creado con éxito",
          icon: "success"
        });
      }


      addOrUpdatePayment(payment);
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessages([error.response.data.message || 'Error saving payment.']);
      } else {
        setErrorMessages(['Error saving payment. Please try again.']);
      }
      console.error('Error saving payment:', error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{currentPayment && currentPayment.id ? 'Editar Pago' : 'Nuevo Pago'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessages.length > 0 && (
          <Alert variant="danger">
            {errorMessages.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </Alert>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Fecha y Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={payment.date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Member ID</Form.Label>
            <Form.Control
              as="select"
              name="memberId"
              value={payment.memberId}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un miembro</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.id})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo de Pago</Form.Label>
            <Form.Control
              as="select"
              name="payment_type"
              value={payment.payment_type}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un tipo de pago</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {currentPayment && currentPayment.id ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PayForm;
