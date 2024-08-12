import React, { useState } from 'react';
import axios from '../axiosConfig'; // Usa la configuración de Axios existente
import './ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('/reset_password', {
        token: formData.token,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSuccessMessage('¡La contraseña se cambió correctamente! Revisa tu correo para el enlace de confirmación.');
        setErrorMessage('');

        // Enviar correo de confirmación
        await axios.post('/verify_email', {
          email: response.data.email,
        });
      } else {
        setErrorMessage(response.data.message || 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al conectar con el servidor. Por favor, inténtalo de nuevo.');
      setSuccessMessage('');
    }
  };

  return (
    <main className="reset-password-container">
      <div className="reset-password-content">
        <div className="reset-password-form-container">
          <h1>Restablecerrr Contraseña</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="token">Token</label>
              <input 
                type="text" 
                id="token" 
                name="token" 
                placeholder="Ingresa el token recibido en tu correo" 
                value={formData.token} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                placeholder="Ingresa tu nueva contraseña" 
                value={formData.newPassword} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                id="confirmNewPassword" 
                name="confirmNewPassword" 
                placeholder="Confirma tu nueva contraseña" 
                value={formData.confirmNewPassword} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit">Restablecer Contraseña</button>
          </form>
        </div>
        <div className="reset-password-image-container">
          <img src="/images/registrar.jpeg" alt="Reset Password Illustration" />
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
