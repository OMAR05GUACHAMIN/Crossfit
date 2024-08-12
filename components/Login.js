// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages
    setEmailError(''); // Clear email error
    setPasswordError(''); // Clear password error

    let valid = true;

    if (!email) {
      setEmailError('Por favor, ingrese el correo electrónico.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Por favor, ingrese la contraseña.');
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axios.post('/login', { email, password });
      
      const { token, user } = response.data;

      setMessage('Autenticación exitosa');

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role) {
        case 'ADMIN':
          navigate('/admin-profile/profile');
          break;
        case 'TRAINER':
          navigate('/trainer-profile/profile');
          break;
        default:
          navigate('/customer-profile/profile');
          break;
      }
    } catch (error) {
      console.log('Error:', error);
      setMessage('Error al iniciar sesión. Por favor, intenta nuevamente. revise el correo o la contraseña');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <img src="/images/avatar.jpg" alt="Avatar" className="avatar" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
          <h1 style={{ color: 'white' }}>Bienvenido</h1>
            <input
              type="email"
              placeholder="Email o nombre de usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <button type="submit" className="login-button">Iniciar Sesión</button>
          {message && <p className="message">{message}</p>}
        </form>
        <p className="register-link">
          No tienes cuenta? <a href="/register" style={{ color: '#3498db' }}>Regístrate aquí!</a>
        </p>
        <p className="forgot-password-link">
          <a href="/forgot-password" style={{ color: '#3498db' }}>Olvidé mi contraseña</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
