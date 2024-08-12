// src/components/Contact.js
import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contactos y Ubicación</h1>
        <p>Ubicados en el corazón de la ciudad, nuestro gimnasio ofrece instalaciones modernas y accesibles. Contáctanos para un estilo de vida saludable. ¡Inspira tu transformación hoy!</p>
      </div>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Información de Contacto</h2>
          <p>Llámamos o visítanos!</p>
          <p><i className="fa fa-phone"></i> 099998882</p>
          <p><i className="fa fa-envelope"></i> CrossFit@gmail.com</p>
          <p><i className="fa fa-map-marker"></i> Av Mariscal Sucre y Amazanos, Quito</p>
        </div>
        <div className="contact-image">
          <img src="/images/mapa.jpg" alt="Gimnasio" />
        </div>
      </div>
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.705793155209!2d-0.2068786847206439!3d-0.18065339969784916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d599e3e4db86db%3A0x2b8b2d5a8e8cbf34!2sAvenida%20General%20Enriquez%2C%20Quito!5e0!3m2!1ses!2sec!4v1620344743587!5m2!1ses!2sec"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
          title="Gimnasio Ubicación"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
