import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Estado para controlar la primera carga
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState('/images/register.jpg'); // default image
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.image) {
      setProfileImageUrl(user.image);
    }
  }, [user]);

  useEffect(() => {
    if (user && isFirstLoad) {
      // Redirigir automáticamente a la pantalla de inicio según el rol del usuario
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin-profile');
          break;
        case 'TRAINER':
          navigate('/trainer-profile');
          break;
        default:
          navigate('/customer-profile');
          break;
      }
      setIsFirstLoad(false); // Marcar que la primera carga ha ocurrido
    }
  }, [user, isFirstLoad, navigate]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`sidenav ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="top-section">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isExpanded ? '<<' : '>>'}
        </button>
        {isExpanded && (
          <img src={profileImageUrl} alt="Profile" className="profile-image" />
        )}
      </div>
      <div className="menu-items">
        
        <Link to={`/${user.role.toLowerCase()}-profile/profile`}>
          <i className="fas fa-user"></i>
          {isExpanded && ' Perfil'}
        </Link>
        {user.role === 'ADMIN' ? (
          <>
            <Link to="/admin-profile/users">
              <i className="fas fa-users"></i>
              {isExpanded && ' Usuarios'}
            </Link>
            <Link to="/admin-profile/memberships">
              <i className="fas fa-id-card"></i>
              {isExpanded && ' Membresías'}
            </Link>
            <Link to="/admin-profile/adminPays">
              <i className="fas fa-money-bill-wave"></i>
              {isExpanded && ' Pagos'}
            </Link>
            <Link to="/admin-profile/attendance">
              <i className="fas fa-calendar-check"></i>
              {isExpanded && ' Asistencias'}
            </Link>
            <Link to="/admin-profile/adminPlan">
              <i className="fas fa-dumbbell"></i>
              {isExpanded && ' Planes'}
            </Link>
            <Link to="/admin-profile/activeMembers">
              <i className="fas fa-bar-chart"></i>
              {isExpanded && ' Estadística de Asistencias'}
            </Link>
            <Link to="/admin-profile/earningStatistics">
              <i className="fas fa-chart-line"></i>
              {isExpanded && ' Estadística de Ganancias'}
            </Link>
            <Link to="/admin-profile/memberStatistics">
              <i className="fas fa-area-chart"></i>
              {isExpanded && ' Estadística de Membresías'}
            </Link>
            <Link to="/admin-profile/adminInfoPays">
              <i className="fas fa-area-chart"></i>
              {isExpanded && ' Información Pagos'}
            </Link>
          </>
        ) : user.role === 'TRAINER' ? (
          <>
            <Link to="/trainer-profile/trainerAttendance">
              <i className="fas fa-id-card"></i>
              {isExpanded && ' Trainer Asistencias'}
            </Link>
            <Link to="/trainer-profile/clientePlans">
              <i className="fas fa-dumbbell"></i>
              {isExpanded && ' Planes vigentes'}
            </Link>
          </>
        ) : (
          <>
            <Link to="/customer-profile/clienteMembresias">
              <i className="fas fa-id-card"></i>
              {isExpanded && 'Membresías'}
            </Link>
            <Link to="/customer-profile/clientePlans">
              <i className="fas fa-dumbbell"></i>
              {isExpanded && 'Planes'}
            </Link>
            <Link to="/customer-profile/clientePagos">
              <i className="fas fa-money-bill-wave"></i>
              {isExpanded && 'Pagos'}
            </Link>
            <Link to="/customer-profile/clienteAsistencias">
              <i className="fas fa-calendar-check"></i>
              {isExpanded && 'Asistencias'}
            </Link>
            <Link to="/customer-profile/payInfo">
              <i className="fas fa-calendar-check"></i>
              {isExpanded && 'Información de pagos'}
            </Link>
          </>
        )}
      </div>
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {isExpanded && ' Cerrar Sesión'}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
