// src/components/ClientProfile.js
import React, { useState } from 'react';
import './ClientProfile.css';
import ProfileTab from './ProfileTab';
import ScheduleTab from './ScheduleTab';
import NewsTab from './NewsTab';
import SubscriptionTab from './SubscriptionTab';
import AttendanceTab from './AttendanceTab';

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <ProfileTab />;
      case 'horarios':
        return <ScheduleTab />;
      case 'noticias':
        return <NewsTab />;
      case 'suscripcion':
        return <SubscriptionTab />;
      case 'asistencia':
        return <AttendanceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <img src="/images/register.jpg" alt="Profile" />
        <ul>
          <li className={activeTab === 'perfil' ? 'active' : ''} onClick={() => setActiveTab('perfil')}>Perfil</li>
          <li className={activeTab === 'horarios' ? 'active' : ''} onClick={() => setActiveTab('horarios')}>Horarios</li>
          <li className={activeTab === 'noticias' ? 'active' : ''} onClick={() => setActiveTab('noticias')}>Noticias</li>
          <li className={activeTab === 'suscripcion' ? 'active' : ''} onClick={() => setActiveTab('suscripcion')}>Suscripción</li>
          <li className={activeTab === 'asistencia' ? 'active' : ''} onClick={() => setActiveTab('asistencia')}>Asistencia</li>
        </ul>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ClientProfile;
