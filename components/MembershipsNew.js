import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../axiosConfig';
import Swal from 'sweetalert2';

const MembershipsNew = ({ showModal, handleClose, addMembership }) => {
  const initialState = {
    email: '',
    planId: ''
  };

  const [newMembership, setNewMembership] = useState(initialState);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/plans');
        const plansData = Object.values(response.data.plan || []);
        setPlans(plansData);
        if (plansData.length > 0) {
          setNewMembership(prev => ({ ...prev, planId: plansData[0].id }));
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(Object.values(response.data.user || []));
        if (Object.values(response.data.user).length > 0) {
          setNewMembership(prev => ({
            ...prev,
            email: Object.values(response.data.user)[0].email,
          }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPlans();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMembership(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = {};

    if (!newMembership.email) {
      errors.email = 'Debe seleccionar un email.';
    }

    if (!newMembership.planId) {
      errors.planId = 'Debe seleccionar un plan.';
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, corrija los errores en el formulario.',
        icon: 'error'
      });
      return;
    }

    try {
      const membershipData = {
        email: newMembership.email,
        planId: Number(newMembership.planId)
      };

      const response = await axios.post('/members', membershipData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      addMembership(response.data, true);

      Swal.fire({
        title: 'Membresía',
        text: 'Membresía creada con éxito',
        icon: 'success'
      });
      handleClose();
    } catch (error) {
      console.error('Error creating membership:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error creando la membresía. Por favor, inténtelo de nuevo.',
        icon: 'error'
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nueva Membresía</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(errorMessages).length > 0 && (
          <Alert variant="danger">
            {Object.values(errorMessages).map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </Alert>
        )}
        <Form>
          <Form.Group>
            <Form.Label>Seleccionar Email</Form.Label>
            <Form.Control
              as="select"
              name="email"
              value={newMembership.email}
              onChange={handleInputChange}
              isInvalid={!!errorMessages.email}
            >
              <option value="">Seleccione un email</option>
              {users.map(user => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errorMessages.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Seleccionar Plan</Form.Label>
            <Form.Control
              as="select"
              name="planId"
              value={newMembership.planId}
              onChange={handleInputChange}
              isInvalid={!!errorMessages.planId}
            >
              <option value="">Seleccione un plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errorMessages.planId}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Crear</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MembershipsNew;
