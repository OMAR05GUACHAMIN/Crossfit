// src/components/UserProfile.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import ClienteMembresias from './ClienteMembresias';
import ClientePlans from './ClientePlans';
import ClientePagos from './ClientePagos';
import ClienteAsistencias from './ClienteAsistencias';
import PayInfo from './PayInfo';
import Navbar from './Navbar';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <div className="user-container">
      <Navbar />
      <div className="content-container">
        <div className="profile-content">
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="clienteMembresias" element={<ClienteMembresias />} />
            <Route path="clientePlans" element={<ClientePlans />} />
            <Route path="clientePagos" element={<ClientePagos />} />
            <Route path="clienteAsistencias" element={<ClienteAsistencias />} />
            <Route path="payInfo" element={<PayInfo />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
