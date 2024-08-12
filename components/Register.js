import React, { useState } from 'react';
import './Register.css';
import axios from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const Register = () => {
  const [identification, setIdentification] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [bornDate, setBornDate] = useState('');
  const [direction, setDirection] = useState('');
  const [gender, setGender] = useState('');
  const [nacionality, setNacionality] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateIdentification = (id) => /^[0-9]{10}$/.test(id);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateBornDate = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    return age > 15 || (age === 15 && month >= 0);
  };
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };
  const validateName = (name) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(name);

  const onRegister = async (e) => {
    e.preventDefault();

    if (!validateIdentification(identification)) {
      setErrorMessage('La identificación debe tener 10 dígitos numéricos.');
      setSuccessMessage('');
      return;
    }

    if (!validateName(name)) {
      setErrorMessage('El nombre solo puede contener letras.');
      setSuccessMessage('');
      return;
    }

    if (!validateName(lastname)) {
      setErrorMessage('El apellido solo puede contener letras.');
      setSuccessMessage('');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('El teléfono debe tener 10 dígitos numéricos.');
      setSuccessMessage('');
      return;
    }

    if (!validatePhone(emergencyPhone)) {
      setErrorMessage('El teléfono de emergencia debe tener 10 dígitos numéricos.');
      setSuccessMessage('');
      return;
    }

    if (!validateBornDate(bornDate)) {
      setErrorMessage('La fecha de nacimiento debe indicar una edad mayor a 15 años.');
      setSuccessMessage('');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('El correo electrónico no es válido.');
      setSuccessMessage('');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post(
        '/register',
        { 
          identification,
          name,
          lastname,
          phone,
          emergencyPhone,
          bornDate,
          direction,
          gender,
          nacionality,
          email,
          password 
        },
        { headers: { 'accept': 'application/json' } }
      );

      console.log("Server response:", response);

      if (response.data && response.data.success) {
        setSuccessMessage('Registro exitoso! Por favor, revisa tu correo para el enlace de confirmación.');
        setErrorMessage('');

        // Limpiar los campos del formulario
        setIdentification('');
        setName('');
        setLastname('');
        setPhone('');
        setEmergencyPhone('');
        setBornDate('');
        setDirection('');
        setGender('');
        setNacionality('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setSuccessMessage('');
        setErrorMessage(response.data ? response.data.message : 'Ocurrió un error.');
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('Ocurrió un error. Por favor, intenta nuevamente.');
      setSuccessMessage('');
    }
  };

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={8} lg={6}>
          <Card className="register-card">
            <Card.Body>
              <div className="profile-icon-container text-center mb-4">
                <div className="profile-icon">
                  <img src="../images/avatar.jpg" alt="Profile Icon" />
                </div>
              </div>
              <h1 className="text-center mb-4">Registro</h1>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <Form onSubmit={onRegister}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Identificación</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu identificación"
                        value={identification}
                        onChange={e => setIdentification(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu apellido"
                        value={lastname}
                        onChange={e => setLastname(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu teléfono"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono de Emergencia</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu teléfono de emergencia"
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Ingresa tu fecha de nacimiento"
                        value={bornDate}
                        onChange={e => setBornDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu dirección"
                        value={direction}
                        onChange={e => setDirection(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Género</Form.Label>
                      <Form.Control
                        as="select"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
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
                        value={nacionality}
                        onChange={e => setNacionality(e.target.value)}
                        required
                      >
                        <option value="">Selecciona tu nacionalidad</option>
                        <option value="Ecuatoriano">Ecuatoriano</option>
                        <option value="Extranjero">Extranjero</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          setPasswordError(validatePassword(e.target.value) ? '' : 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
                        }}
                        required
                      />
                      {passwordError && <div className="text-danger">{passwordError}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirma tu contraseña"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" className="w-100">Registrar</Button>
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

export default Register;

