import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import './ClienteMembresias.css';

const ClienteMembresias = () => {
  const [membership, setMembership] = useState(null);

  const fetchMembership = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage
      const response = await axios.get('/members', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMembership(response.data.member);
    } catch (error) {
      console.error('Error fetching membership:', error);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  return (
    <div className="memberships-container">
      <h3>Información de Membresías</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de Inscripción</th>
            <th>Estado</th>
            <th>Plan</th>
          </tr>
        </thead>
        <tbody>
          {membership && (
            <tr key={membership.id}>
              <td>{membership.id}</td>
              <td>{new Date(membership.inscriptionDate).toLocaleDateString()}</td>
              <td>{membership.status ? 'Activo' : 'Inactivo'}</td>
              <td>{membership.planId}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ClienteMembresias;
