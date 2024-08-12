import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import Swal from 'sweetalert2';

const AdminPlanNew = ({ showModal, handleClose, fetchPlans }) => {
  const initialState = {
    name: '',
    description: '',
    price: '',
    duration: '',
    status: true
  };

  const [newPlan, setNewPlan] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  const handleSubmit = async () => {
    if (!newPlan.name || !newPlan.description || !newPlan.price || !newPlan.duration) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "error"
      });
      return;
    }

    try {
      newPlan.duration = Number(newPlan.duration);
      newPlan.price = Number(newPlan.price);
      const response = await axios.post('/plans', newPlan, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPlans(); // Llama a fetchPlans para actualizar la lista de planes
      setNewPlan(initialState); 
      Swal.fire({
        title: "Plan",
        text: "Plan creado con éxito",
        icon: "success"
      });
      handleClose(); 
    } catch (error) {
      console.error('Error creating plan:', error);
      Swal.fire({
        title: "Error",
        text: "Error al crear el plan. Por favor, inténtelo de nuevo.",
        icon: "error"
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newPlan.name}
              onChange={handleInputChange}
              placeholder="Nombre del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={newPlan.description}
              onChange={handleInputChange}
              placeholder="Descripción del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={newPlan.price}
              onChange={handleInputChange}
              placeholder="Precio del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Duración</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={newPlan.duration}
              onChange={handleInputChange}
              placeholder="Duración del Plan (meses)"
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              name="status"
              label="Activo"
              checked={newPlan.status}
              onChange={(e) => setNewPlan({ ...newPlan, status: e.target.checked })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>Crear</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminPlanNew;
