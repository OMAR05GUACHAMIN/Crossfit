// src/components/TrainerProfile.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import TrainerAttendance from './TrainerAttendance';
import ClientePlans from './ClientePlans'
import Navbar from './Navbar';

const TrainerProfile = () => {
  return (
    <div className="trainer-container">
      <Navbar />
      <div className="content-container">
        <div className="profile-content">
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="trainerAttendance" element={<TrainerAttendance />} />
            <Route path="clientePlans" element={<ClientePlans />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
