import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const EditUserForm = ({ showModal, handleClose, updateUser, user, isNewUser }) => {
  const [userData, setUserData] = useState({
    id: user.id || '',
    identification: user.identification || '',
    name: user.name || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phone: user.phone || '',
    emergencyPhone: user.emergencyPhone || '',
    bornDate: user.bornDate || '',
    direction: user.direction || '',
    gender: user.gender || '',
    nacionality: user.nacionality || '',
    role: user.role || '',
    status: user.status || false,
  });

  useEffect(() => {
    setUserData({
      id: user.id || '',
      identification: user.identification || '',
      name: user.name || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phone: user.phone || '',
      emergencyPhone: user.emergencyPhone || '',
      bornDate: user.bornDate || '',
      direction: user.direction || '',
      gender: user.gender || '',
      nacionality: user.nacionality || '',
      role: user.role || '',
      status: user.status || false,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const requiredFields = [
      'name', 'lastname', 'email', 'phone', 'emergencyPhone', 'bornDate',
      'direction', 'gender', 'nacionality', 'role'
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

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      updateUser(userData);
      Swal.fire({
        title: 'Éxito',
        text: 'Usuario actualizado exitosamente.',
        icon: 'success',
      });
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al actualizar el usuario.',
        icon: 'error',
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isNewUser ? 'Crear Usuario' : 'Editar Usuario'}</Modal.Title>
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
              readOnly={!isNewUser}
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
              value={userData.bornDate.split('T')[0]}
              onChange={handleChange}
              readOnly
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
            {isNewUser ? 'Crear' : 'Actualizar'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserForm;
