import React, { useState } from 'react';
import './ForgotPassword.css';
import axios from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/reset_password', { email });
      console.log(response);
      if (response.data.success) {
        setSuccessMessage('¡Se ha enviado un email para el reseteo de la contraseña!');
        setErrorMessage('');
      } else {
        setErrorMessage('Ocurrió un problema y no se pudo enviar el email de reseteo.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.log('Error:', error);
      setErrorMessage('Ocurrió un problema y no se pudo enviar el email de reseteo: ' + (error.response?.data?.error || error.message));
      setSuccessMessage('');
    }
  };

  return (
    <Container fluid className="forgot-password-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={6} lg={4}>
          <Card className="forgot-password-card">
            <Card.Body>
              <div className="profile-icon-container text-center mb-4">
                <div className="profile-icon">
                  <img src="/images/avatar.jpg" alt="Forgot Password Icon" />
                </div>
              </div>
              <h1 className="text-center mb-4">Olvidé mi contraseña</h1>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div className="text-center">
                  <Button type="submit" variant="primary" className="w-50">Enviar</Button>
                </div>
              </Form>
              <div className="back-to-login mt-3 text-center">
                <Link to="/login">←Inicio de sesión</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
