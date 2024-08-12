import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import Swal from 'sweetalert2';

const AdminPlanEdit = ({ showModal, handleClose, updatePlan, plan, isNewPlan }) => {
  const initialState = {
    id: '',
    name: '',
    description: '',
    price: '',
    status: true  // Default status for new plans
  };

  const [planData, setPlanData] = useState(initialState);

  useEffect(() => {
    if (plan) {
      setPlanData(plan);
    } else {
      setPlanData(initialState);
    }
  }, [plan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanData({ ...planData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!planData.name || !planData.description || !planData.price) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios.",
        icon: "error"
      });
      return;
    }
  
    try {
      if (isNewPlan) {
        const response = await axios.post('/plans', planData);
        updatePlan(response.data);
        Swal.fire({
          title: "Plan",
          text: "Plan creado con éxito",
          icon: "success"
        });
      } else {
        const { id, name, description, price, status, duration } = planData;
        const updateData = { name, description, price, status, duration };
  
        updateData.duration = Number(updateData.duration);
        updateData.price = Number(updateData.price);
        await axios.put(`/plans/${id}`, updateData);
        updatePlan(planData);
        Swal.fire({
          title: "Plan",
          text: "Plan actualizado con éxito",
          icon: "success"
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error updating plan:', error);
      Swal.fire({
        title: "Error",
        text: "Error al actualizar el plan. Por favor, inténtelo de nuevo.",
        icon: "error"
      });
    }
  };
  

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton className="text-black">
        <Modal.Title className="text-black">{isNewPlan ? 'Crear Plan' : 'Editar Plan'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {!isNewPlan && (
            <Form.Group>
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" readOnly value={planData.id} />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={planData.name}
              onChange={handleInputChange}
              placeholder="Nombre del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={planData.description}
              onChange={handleInputChange}
              placeholder="Descripción del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={planData.price}
              onChange={handleInputChange}
              placeholder="Precio del Plan"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={planData.status.toString()}
              onChange={handleInputChange}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>{isNewPlan ? 'Crear' : 'Guardar Cambios'}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminPlanEdit;
