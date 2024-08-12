// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from './Navbar'

const Home = () => {
  const navigate = useNavigate();

  const handleJoinClub = () => {
    navigate('/login');
  };

  return (
    
    <main className="home-container">
  
      <div className="home-content">
        <h1>CROSSFIT</h1>
        <p>ÚNETE AL CLUB</p>
        <button onClick={handleJoinClub}>ÚNETE AL CLUB</button>
      </div>
    </main>
  );
}

export default Home;
