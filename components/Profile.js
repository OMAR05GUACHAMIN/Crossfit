import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Form, Button, Container, Row, Col, Alert, Card, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faEnvelope, faPhone, faBirthdayCake, faMapMarkerAlt, faTransgender, faFlag } from '@fortawesome/free-solid-svg-icons';
import './Profile.css'; // Importa el archivo CSS

const Profile = () => {
  const initialProfileState = {
    identification: '',
    name: '',
    lastname: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    bornDate: '',
    direction: '',
    gender: '',
    nacionality: '',
    status: true,
    image: '',
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [firstTime, setFirstTime] = useState(false); // Estado para controlar la primera vez
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Estado para el modal de cambio de contraseña
  const [password, setPassword] = useState(''); // Contraseña actual
  const [newPassword, setNewPassword] = useState(''); // Nueva contraseña
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('No token found, please log in again.');
          return;
        }

        const response = await axios.get('/view_profile', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          const userProfile = response.data.user;
          setProfile(userProfile);
          if (!userProfile.image) {
            setFirstTime(true);
            setIsEditing(true);
            Swal.fire({
              title: 'Bienvenido',
              text: 'Por favor, actualiza tu foto de perfil.',
              icon: 'info',
            });
          }
        } else {
          setErrorMessage(response.data ? response.data.message : 'Ocurrió un error.');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage(error.response?.data?.message || 'Ocurrió un error.');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const requiredFields = ['name', 'lastname', 'email', 'phone', 'emergencyPhone', 'direction', 'gender', 'nacionality'];
      for (let field of requiredFields) {
        if (!profile[field]) {
          Swal.fire({
            title: 'Error',
            text: `Por favor, complete el campo ${field}.`,
            icon: 'error',
          });
          return;
        }
      }

      if (profile.phone.length !== 10) {
        Swal.fire({
          title: 'Error',
          text: 'El teléfono debe tener 10 dígitos.',
          icon: 'error',
        });
        return;
      }

      if (profile.emergencyPhone.length !== 10) {
        Swal.fire({
          title: 'Error',
          text: 'El teléfono de emergencia debe tener 10 dígitos.',
          icon: 'error',
        });
        return;
      }

      if (firstTime && !imageUpload) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor, sube una foto de perfil.',
          icon: 'error',
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Error',
          text: 'No token found, please log in again.',
          icon: 'error',
        });
        return;
      }

      profile.password = undefined;

      let imageUrl = profile.image;
      let imageChanged = false;
      if (imageUpload) {
        const imageRef = ref(storage, `profile_images/${profile.email}`);
        await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(imageRef);
        imageChanged = true;
      }

      const response = await axios.put(
        '/edit_profile',
        { ...profile, image: imageUrl },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setIsEditing(false);
        setSuccessMessage('Perfil actualizado con éxito.');
        setErrorMessage('');
        if (firstTime) {
          setFirstTime(false);
        }
        Swal.fire({
          title: 'Éxito',
          text: 'Perfil actualizado con éxito.',
          icon: 'success',
        }).then(() => {
          if (imageChanged) {
            window.location.reload(); // Refrescar la pantalla para actualizar la imagen
          }
        });
        setProfile((prevProfile) => ({ ...prevProfile, image: imageUrl }));
      } else {
        const message = response.data ? response.data.message : 'Ocurrió un error.';
        setErrorMessage(message);
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Ocurrió un error.';
      setErrorMessage(message);
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
      });
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.');
      return;
    }

    if (password === newPassword) {
      setPasswordError('La nueva contraseña no puede ser igual a la contraseña anterior.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          title: 'Error',
          text: 'No token found, please log in again.',
          icon: 'error',
        });
        return;
      }

      const response = await axios.put(
        '/change_password',
        {
          password,
          newPassword,
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setShowPasswordModal(false);
        setPassword('');
        setNewPassword('');
        setPasswordError('');
        Swal.fire({
          title: 'Éxito',
          text: 'Contraseña actualizada con éxito.',
          icon: 'success',
        });
      } else {
        const message = response.data ? response.data.message : 'Ocurrió un error.';
        if (message === 'La contraseña anterior no coincide.') {
          setPasswordError('No coincide con la contraseña anterior.');
        } else {
          setPasswordError(message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Ocurrió un error.';
      if (message === 'La contraseña anterior no coincide.') {
        setPasswordError('No coincide con la contraseña anterior.');
      } else {
        setPasswordError(message);
      }
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const genderDisplay = (gender) => {
    return gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : gender;
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="mt-5 profile-card">
            <Card.Body>
              <div className="profile-header">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
                <h1 className="profile-title">PERFIL</h1>
              </div>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {isEditing ? (
                <Form>
                  <Form.Group controlId="identification">
                    <Form.Label>Identificación</Form.Label>
                    <Form.Control
                      type="text"
                      value={profile.identification}
                      readOnly
                      style={{
                        backgroundColor: '#f8f9fa', // Color de fondo más claro
                        color: '#6c757d',           // Color de texto más oscuro
                        cursor: 'not-allowed'       // Cambia el cursor para indicar que no es editable
                      }} 
                    />
                  </Form.Group>
                  <Form.Group controlId="name" className="mt-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="lastname" className="mt-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={profile.lastname}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="email" className="mt-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="phone" className="mt-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="emergencyPhone" className="mt-3">
                    <Form.Label>Teléfono de Emergencia</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyPhone"
                      value={profile.emergencyPhone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="bornDate" className="mt-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={profile.bornDate.split('T')[0]}
                      readOnly
                      style={{
                        backgroundColor: '#f8f9fa', // Color de fondo más claro
                        color: '#6c757d',           // Color de texto más oscuro
                        cursor: 'not-allowed'       // Cambia el cursor para indicar que no es editable
                      }} 
                    />
                  </Form.Group>
                  <Form.Group controlId="direction" className="mt-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direction"
                      value={profile.direction}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="gender" className="mt-3">
                    <Form.Label>Género</Form.Label>
                    <Form.Select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona un género</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="nacionality" className="mt-3">
                    <Form.Label>Nacionalidad</Form.Label>
                    <Form.Select
                      name="nacionality"
                      value={profile.nacionality}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona una nacionalidad</option>
                      <option value="Ecuatoriano">Ecuatoriano</option>
                      <option value="Extranjero">Extranjero</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="image" className="mt-3">
                    <Form.Label>Imagen de Perfil</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setImageUpload(e.target.files[0])}
                      required={firstTime}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSaveClick} className="mt-3">
                    Guardar
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)} className="mt-3 ml-2">
                    Cancelar
                  </Button>
                </Form>
              ) : (
                <div className="profile-info">
                  <p><FontAwesomeIcon icon={faIdCard} /> <strong>Identificación:</strong> {profile.identification}</p>
                  <p><FontAwesomeIcon icon={faUser} /> <strong>Nombre:</strong> {profile.name}</p>
                  <p><FontAwesomeIcon icon={faUser} /> <strong>Apellido:</strong> {profile.lastname}</p>
                  <p><FontAwesomeIcon icon={faEnvelope} /> <strong>Correo Electrónico:</strong> {profile.email}</p>
                  <p><FontAwesomeIcon icon={faPhone} /> <strong>Teléfono:</strong> {profile.phone}</p>
                  <p><FontAwesomeIcon icon={faPhone} /> <strong>Teléfono de Emergencia:</strong> {profile.emergencyPhone}</p>
                  <p><FontAwesomeIcon icon={faBirthdayCake} /> <strong>Fecha de Nacimiento:</strong> {profile.bornDate.split('T')[0]}</p>
                  <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Dirección:</strong> {profile.direction}</p>
                  <p><FontAwesomeIcon icon={faTransgender} /> <strong>Género:</strong> {genderDisplay(profile.gender)}</p>
                  <p><FontAwesomeIcon icon={faFlag} /> <strong>Nacionalidad:</strong> {profile.nacionality}</p>
                  <div className="button-container">
                    <Button variant="primary" onClick={() => setIsEditing(true)} className="mt-3">
                      Editar Perfil
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(true)} className="mt-3 ml-2">
                      Cambiar Contraseña
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          <Form>
            <Form.Group controlId="currentPassword">
              <Form.Label>Contraseña Anterior</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña anterior"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword" className="mt-3">
              <Form.Label>Contraseña Nueva</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Cambiar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
