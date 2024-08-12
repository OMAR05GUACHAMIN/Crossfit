import React, { useState } from 'react';
import axios from '../axiosConfig'; // Usa la configuración de Axios existente
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import './ForgotPasswordToken.css'; // Asegúrate de que el archivo de estilos esté correctamente importado

const ForgotPasswordToken = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!hasUpperCase) {
      return 'La contraseña debe tener al menos una letra mayúscula.';
    }
    if (!hasLowerCase) {
      return 'La contraseña debe tener al menos una letra minúscula.';
    }
    if (!hasNumber) {
      return 'La contraseña debe tener al menos un número.';
    }
    if (!hasSpecialChar) {
      return 'La contraseña debe tener al menos un carácter especial.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setSuccessMessage('');
      return;
    }

    try {
      const token = new URLSearchParams(window.location.search).get('token');
      const response = await axios.post('/new_password', { token, password });
      console.log(response);
      if (response.data.success) {
        setSuccessMessage('¡La contraseña se cambió correctamente!');
        setErrorMessage('');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirigir a la página de login después de 3 segundos
      } else {
        setErrorMessage('Ocurrió un problema y no se pudo actualizar la contraseña');
        setSuccessMessage('');
      }
    } catch (error) {
      console.log('Error:', error);
      setErrorMessage('Ocurrió un problema y no se pudo actualizar la contraseña: ' + (error.response?.data?.error || error.message));
      setSuccessMessage('');
    }
  };

  return (
    <Container fluid className="update-password-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={6} lg={4}>
          <Card className="update-password-card">
            <Card.Body>
              <div className="profile-icon-container text-center mb-4">
                <div className="profile-icon">
                  <img src="/images/avatar.jpg" alt="Password Reset Icon" />
                </div>
              </div>
       
              <h2 className="text-center mb-4">Nueva contraseña</h2>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ingresa tu nueva contraseña"
                    value={password}
                    onChange={handleChangePassword}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    required
                  />
                </Form.Group>
                <div className="text-center">
                  <Button type="submit" variant="primary" className="w-50">Actualizar Contraseña</Button>
                </div>
              </Form>
              <div className="back-to-login mt-3 text-center">
                <Link to="/login">← Regresar al inicio de sesión</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordToken;
