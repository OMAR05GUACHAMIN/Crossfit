// src/components/Services.js
import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <h1>En CrossFit te traemos los mejores servicios</h1>
      <p>Clases disponibles</p>
      <div className="services-grid">
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/register.jpg" alt="CrossFit" />
          </div>
          <h2>CrossFit</h2>
          <p>Es un entrenamiento que se basa en ejercicios funcionales continuamente variados que se ejecutan a una intensidad alta</p>
          <button>Ver Más</button>
        </div>
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/servicios.jpg" alt="Halterofilia" />
          </div>
          <h2>Halterofilia</h2>
          <p>Es un deporte que se centra en el levantamiento de peso en una barra con discos en sus extremos.</p>
          <button>Ver Más</button>
        </div>
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/servicios.jpg" alt="Gimnásticos" />
          </div>
          <h2>Gimnásticos</h2>
          <p>Ejercicios, movimientos o elementos en los cuales la resistencia es nuestra propia carga corporal, es decir el trabajo no el propio peso de cada uno</p>
          <button>Ver Más</button>
        </div>
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/servicios.jpg" alt="Endurance" />
          </div>
          <h2>Endurance</h2>
          <p>Entrenamiento funcional de alta intensidad en el que se da prioridad a mejorar los aspectos del cardio (velocidad y resistencia) tanto en la carrera como en otras actividades.</p>
          <button>Ver Más</button>
        </div>
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/servicios.jpg" alt="Mobility" />
          </div>
          <h2>Mobility</h2>
          <p>La movilidad es la capacidad de movimiento de una articulación en su máximo rango de movimiento y se trabaja mediante un conjunto de ejercicios de músculos y articulaciones con la finalidad de preparar al organismo para un mejor rendimiento físico y para evitar algún tipo de contracción muscular o alguna lesión física.</p>
          <button>Ver Más</button>
        </div>
        <div className="service-item">
          <div className="service-icon">
            <img src="/images/servicios.jpg" alt="Próximamente" />
          </div>
          <h2>Próximamente...</h2>
          <p>En CrossFit T-Rex esperamos dentro de poco poder ofrecerte clases de Yoga y Artes Marciales.</p>
          <button>Ver Más</button>
        </div>
      </div>
    </div>
  );
};

export default Services;
