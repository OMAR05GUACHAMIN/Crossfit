import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from '../axiosConfig';
import Swal from 'sweetalert2';

const AttendanceRegister = ({ showModal, handleClose, addOrUpdateAttendance }) => {
  const initialState = {
    date: '',
    memberId: '',
  };

  const [newAttendance, setNewAttendance] = useState(initialState);
  const [members, setMembers] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    // Cargar la lista de miembros desde la API
    const fetchMembers = async () => {
      try {
        const response = await axios.get('/members');
        const membersData = response.data.members;
        setMembers(membersData);
        if (membersData.length > 0) {
          setNewAttendance(prev => ({ ...prev, memberId: membersData[0].id }));
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setErrorMessages(['Error fetching members.']);
      }
    };
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['date', 'memberId'];
    const emptyFields = requiredFields.filter(field => !newAttendance[field]);
  
    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error"
      });
      return;
    }
  
    try {
      const response = await axios.post(`/members/${newAttendance.memberId}/attendances`, newAttendance);
      addOrUpdateAttendance(response.data);
      Swal.fire({
        title: "Asistencia",
        text: "Asistencia registrada con éxito",
        icon: "success"
      });
      handleClose();
    } catch (error) {
      console.error('Error creating attendance:', error);
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          setErrorMessages([error.response.data.error]);
        } else if (error.response.data && error.response.data.details) {
          setErrorMessages(error.response.data.details.map(detail => detail.message));
        } else {
          setErrorMessages(['Unexpected error. Please try again.']);
        }
      } else {
        setErrorMessages(['Network error. Please check your connection and try again.']);
      }
      Swal.fire({
        title: "Error",
        text: "Error al registrar la asistencia. Por favor, inténtelo de nuevo.",
        icon: "error"
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Asistencia</Modal.Title>
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
              value={newAttendance.date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Miembro</Form.Label>
            <Form.Control
              as="select"
              name="memberId"
              value={newAttendance.memberId}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un miembro</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.user.name} ({member.id})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Registrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceRegister;
