// src/components/ProfileTab.js
import React, { useState } from 'react';
import './ProfileTab.css';

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Omar Guachamin');
  const [tempName, setTempName] = useState(name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setName(tempName);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setTempName(name);
    setIsEditing(false);
  };

  return (
    <div className="profile-tab">
      <img src="/images/profile-photo.jpg" alt="Profile" />
      <div className="profile-info">
        <p><strong>Nombre:</strong> {isEditing ? <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} /> : name}</p>
        <p><strong>Rol:</strong> Cliente</p>
        {isEditing ? (
          <div className="profile-buttons">
            <button onClick={handleSaveClick}>Guardar</button>
            <button onClick={handleCancelClick}>Cancelar</button>
          </div>
        ) : (
          <button onClick={handleEditClick}>Editar Perfil</button>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
