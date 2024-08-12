import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import './TrainerMembership.css';  // Asegúrate de tener este archivo CSS en tu proyecto

const TrainerMembership = () => {
  const [memberships, setMemberships] = useState([
    { id: 1, userName: 'Edwin Smith', plan: 'Gold', price: '100', duration: '1 año', status: 'Presente' },
    { id: 2, userName: 'Omar Johnson', plan: 'Silver', price: '80', duration: '1 año', status: 'Ausente' },
  ]);

  const toggleStatus = (id) => {
    setMemberships(prevMemberships =>
      prevMemberships.map(membership =>
        membership.id === id ? { ...membership, status: membership.status === 'Presente' ? 'Ausente' : 'Presente' } : membership
      )
    );
  };

  return (
    <div className="trainer-membership-container">
      <h3>Membresías de Entrenadores</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Plan</th>
            <th>Precio</th>
            <th>Duración del Plan</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map(membership => (
            <tr key={membership.id}>
              <td>{membership.userName}</td>
              <td>{membership.plan}</td>
              <td>{membership.price}</td>
              <td>{membership.duration}</td>
              <td>{membership.status}</td>
              <td>
                <Button variant="info" onClick={() => toggleStatus(membership.id)}>
                  Cambiar Estado
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TrainerMembership;
