import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import Swal from 'sweetalert2';


const AttendanceEdit = ({ showModal, handleClose, attendance, addOrUpdateAttendance }) => {
  const initialState = {
    date: '',
    memberId: '',
  };

  const [updatedAttendance, setUpdatedAttendance] = useState(initialState);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (attendance) {
      setUpdatedAttendance({
        date: attendance.date,
        memberId: attendance.memberId,
      });
    }
  }, [attendance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAttendance(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      //console.log('Submitting updated attendance:', updatedAttendance); // Log para depuración
      const response = await axios.put(`/members/${updatedAttendance.memberId}/attendances/${attendance.id}`, updatedAttendance);
      //console.log('Attendance updated:', response.data); // Log para depuración
      addOrUpdateAttendance(response.data);
      Swal.fire({
        title: "Asistencia",
        text: "Asistencia actualizada con éxito",
        icon: "success"
      });
      handleClose();
    } catch (error) {
      console.error('Error updating attendance:', error); // Log para depuración
      if (error.response) {
        // Errores específicos del servidor
        if (error.response.data && error.response.data.error) {
          setErrorMessages([error.response.data.error]);
        } else if (error.response.data && error.response.data.details) {
          setErrorMessages(error.response.data.details.map(detail => detail.message));
        } else {
          setErrorMessages(['Unexpected error. Please try again.']);
        }
      } else {
        // Errores de red o otros problemas
        setErrorMessages(['Network error. Please check your connection and try again.']);
      }
      Swal.fire({
        title: "Error",
        text: "Error al actualizar la asistencia. Por favor, inténtelo de nuevo.",
        icon: "error"
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Asistencia</Modal.Title>
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
              value={updatedAttendance.date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID de Miembro</Form.Label>
            <Form.Control
              type="text"
              name="memberId"
              value={updatedAttendance.memberId}
              readOnly
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceEdit;
