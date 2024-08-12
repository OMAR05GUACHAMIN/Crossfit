import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../axiosConfig';
import Swal from 'sweetalert2';

const MembershipsForm = ({ showModal, handleClose, addOrUpdateMembership, currentMembership }) => {
  const initialState = {
    planId: ''
  };

  const [membership, setMembership] = useState(initialState);
  const [plans, setPlans] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (currentMembership) {
      setMembership({ planId: currentMembership.planId });
    } else {
      setMembership(initialState);
    }
  }, [currentMembership]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/plans');
        const plansData = Object.values(response.data.plan); // Ajuste aquí para manejar el formato recibido
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMembership(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!membership.planId) {
      Swal.fire({
        title: "Error",
        text: "Por favor, seleccione un plan.",
        icon: "error"
      });
      return;
    }

    try {
      membership.planId = Number(membership.planId);
      const response = await axios.put(`/members/${currentMembership.id}`, membership);
      addOrUpdateMembership(response.data);
      Swal.fire({
        title: "Membresía",
        text: "Membresía actualizada con éxito",
        icon: "success"
      });
      handleClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.details) {
        setErrorMessages(error.response.data.details.map(detail => detail.message));
      } else {
        console.error('Error updating membership:', error);
        alert('Error updating membership. Please try again.');
      }
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Plan de Membresía</Modal.Title>
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
            <Form.Label>Plan</Form.Label>
            <Form.Control
              as="select"
              name="planId"
              value={membership.planId}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Actualizar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MembershipsForm;
