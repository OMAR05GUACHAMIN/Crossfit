// src/components/AdminProfile.js
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Users from './Users';
import Memberships from './Memberships';
import Attendance from './Attendance';
import Pay from './Pay';
import TrainerMembership from './TrainerMembership';
import Client from './Client';
import ClientHistoryPay from './ClientHistoryPay';
import AdminPlan from './AdminPlan';
import ActiveMembers from './ActiveMembers';
import EarningStatistics from './EarningStatistics'
import MemberStatistics from './MemberStatistics'
import UserProfile from './UserProfile';
import AdminPays from './AdminPays';
import AdminInfoPays from './AdminInfoPays';
import Homep from './Homep';
import './AdminProfile.css';
import Navbar from './Navbar';

const AdminProfile = () => {
  const [name, setName] = useState('Admin User');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <Navbar />
      <div className="content-container">
        <div className="profile-content">
          <Routes>
            <Route path="profile" element={<Profile name={name} setName={setName} />} />
            <Route path="homep" element={<Homep />} />
            <Route path="users" element={<Users />} />
            <Route path="memberships" element={<Memberships />} />
            <Route path="pay" element={<Pay/>} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="trainerMembership" element={<TrainerMembership />} />
            <Route path="client" element={<Client />} />
            <Route path="clientHistoryPay" element={<ClientHistoryPay />} />
            <Route path="adminPlan" element={<AdminPlan />} />
            <Route path="activeMembers" element={<ActiveMembers/>} />
            <Route path="earningStatistics" element={<EarningStatistics/>} />
            <Route path="memberStatistics" element={<MemberStatistics/>} />
            <Route path="userProfile" element={<UserProfile/>} />
            <Route path="adminPays" element={<AdminPays/>} />
            <Route path="adminInfoPays" element={<AdminInfoPays/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

