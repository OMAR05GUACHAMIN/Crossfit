import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const UserForm = ({ showModal, handleClose, addUser }) => {
  const [userData, setUserData] = useState({
    identification: '',
    name: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    emergencyPhone: '',
    bornDate: '',
    direction: '',
    gender: '',
    nacionality: '',
    role: '',
    status: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const requiredFields = [
      'identification', 'name', 'lastname', 'email', 'password', 'phone', 'emergencyPhone', 
      'bornDate', 'direction', 'gender', 'nacionality', 'role'
    ];

    for (let field of requiredFields) {
      if (!userData[field]) {
        Swal.fire({
          title: 'Error',
          text: `Por favor, complete el campo ${field}.`,
          icon: 'error',
        });
        return false;
      }
    }

    if (!/^\d{10}$/.test(userData.phone)) {
      Swal.fire({
        title: 'Error',
        text: 'El teléfono debe tener 10 dígitos y solo contener números.',
        icon: 'error',
      });
      return false;
    }

    if (!/^\d{10}$/.test(userData.emergencyPhone)) {
      Swal.fire({
        title: 'Error',
        text: 'El teléfono de emergencia debe tener 10 dígitos y solo contener números.',
        icon: 'error',
      });
      return false;
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      Swal.fire({
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres, 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial.',
        icon: 'error',
      });
      return false;
    }

    // Validar fecha de nacimiento
    const bornDate = new Date(userData.born_date);
    const today = new Date();
    const age = today.getFullYear() - bornDate.getFullYear();
    const monthDiff = today.getMonth() - bornDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bornDate.getDate())) {
      age--;
    }
    if (age < 15) {
      Swal.fire({
        title: 'Error',
        text: 'El usuario debe tener al menos 15 años.',
        icon: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await addUser(userData);
      Swal.fire({
        title: 'Éxito',
        text: 'Usuario creado exitosamente.',
        icon: 'success',
      });
      handleClose();
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'No se pudo crear el usuario',
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="identification"
              value={userData.identification}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono de Emergencia</Form.Label>
            <Form.Control
              type="text"
              name="emergencyPhone"
              value={userData.emergencyPhone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="bornDate"
              value={userData.bornDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direction"
              value={userData.direction}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nacionalidad</Form.Label>
            <Form.Control
              as="select"
              name="nacionality"
              value={userData.nacionality}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu nacionalidad</option>
              <option value="Ecuatoriano">Ecuatoriano</option>
              <option value="Extranjero">Extranjero</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={userData.role}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona el rol</option>
              <option value="CUSTOMER">Cliente</option>
              <option value="TRAINER">Entrenador</option>
              <option value="ADMIN">Administrador</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="status"
              label="Activado"
              checked={userData.status}
              onChange={() => setUserData({ ...userData, status: !userData.status })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Crear
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;
