import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import AdminPlanEdit from './AdminPlanEdit';
import AdminPlanNew from './AdminPlanNew'; // Importa el componente para crear nuevos planes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import './AdminPlan.css'; // Asegúrate de tener un archivo CSS para estilos
import Swal from 'sweetalert2';

const AdminPlan = () => {
  const [plans, setPlans] = useState([]); // Inicializa `plans` como un arreglo vacío
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({});

  // Función para cargar planes desde la API
  const fetchPlans = async () => {
    try {
      const response = await axios.get('/plans', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Extrae los planes de la respuesta y los transforma en un arreglo
      const plansData = Object.values(response.data.plan);
      // Guarda los planes en el estado
      setPlans(Array.isArray(plansData) ? plansData : []); // Asegúrate de que `plansData` es un arreglo
    } catch (error) {
      // Maneja los errores
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Failed to fetch plans');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  // Cargar los planes cuando el componente se monta
  useEffect(() => {
    fetchPlans();
  }, []);

  const handleShowModal = (plan = null) => {
    setCurrentPlan(plan);
    setIsNewPlan(!plan); // Determine if we are adding a new plan or editing an existing one
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updatePlan = async (updatedPlan) => {
    try {
      await axios.put(`/plans/${updatedPlan.id}`, updatedPlan, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPlans(); // Recargar la lista de planes después de actualizar uno existente
    } catch (error) {
      console.error('Error updating plan:', error);
      Swal.fire({
        title: "Error",
        text: error.response.data.error || "No se pudo actualizar el plan",
        icon: "error"
      });
    }
    handleCloseModal();
  };

  const togglePlanStatus = async (planId) => {
    try {
      await axios.delete(`/plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPlans();
      Swal.fire({
        title: "Plan eliminado",
        text: "El plan ha sido eliminado ya que no está en uso",
        icon: "success"
      });
    } catch (error) {
      console.error('Error toggling plan status:', error);
      Swal.fire({
        title: "Error",
        text: error.response.data.error || "No se pudo cambiar el estado del plan",
        icon: "error"
      });
    }
  };

  return (
    <div className="admin-plan-container">
      <h3>Gestión de Planes</h3>
      <div className="d-flex justify-content-end mb-2">
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FontAwesomeIcon icon={faPlus} /> Crear Plan
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración (días)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(plans) && plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.id}</td>
              <td>{plan.name}</td>
              <td>{plan.description}</td>
              <td>${plan.price}</td>
              <td>{plan.duration}</td>
              <td>{plan.status ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Button variant="" onClick={() => handleShowModal(plan)}>
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </Button>
                <Button
                  variant={plan.status ? '' : ''}
                  onClick={() => togglePlanStatus(plan.id)}
                >
                  {plan.status ? (
                    <>
                      <FontAwesomeIcon icon={faToggleOff} /> Desactivar
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faToggleOn} /> Activar
                    </>
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {message && <p className="message">{message}</p>}
      {showModal && (
        isNewPlan ? (
          <AdminPlanNew
            showModal={showModal}
            handleClose={handleCloseModal}
            fetchPlans={fetchPlans}
          />
        ) : (
          <AdminPlanEdit
            showModal={showModal}
            handleClose={handleCloseModal}
            updatePlan={updatePlan}
            plan={currentPlan}
          />
        )
      )}
    </div>
  );
};

export default AdminPlan;
