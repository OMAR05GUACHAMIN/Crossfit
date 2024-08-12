// src/App.js
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Services from './components/Services';
import Memberships from './components/Memberships';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import AdminProfile from './components/AdminProfile';
import TrainerProfile from './components/TrainerProfile';
import UserProfile from './components/UserProfile'; // Importar UserProfile
import AdminPays from './components/AdminPays';
import NewVerification from './components/NewVerification';
import ForgotPasswordToken from './components/ForgotPasswordToken';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-profile/*" element={<AdminProfile />} />
        <Route path="/trainer-profile/*" element={<TrainerProfile />} />
        <Route path="/customer-profile/*" element={<UserProfile />} /> {/* Añadir ruta para UserProfile */}
        <Route path="/adminPays" element={<AdminPays />} />
        <Route path="/new-verification" element={<NewVerification />} />
        <Route path="/new-password" element={<ForgotPasswordToken />} />
      </Routes>
    </Router>
  );
}

export default App;
