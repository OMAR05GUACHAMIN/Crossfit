// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">CROSSFIT</Link>
      </div>
    {/*
     <nav className="nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/services">Servicios</Link></li>
          <li><Link to="/memberships">Membresías</Link></li>
          <li><Link to="/contact">Contáctanos</Link></li>
        </ul>
      </nav>
    
     
      <div className="login-button">
        <Link to="/login">INICIAR SESIÓN</Link>
      </div>

*/}

    </header>
  );
};

export default Header;
