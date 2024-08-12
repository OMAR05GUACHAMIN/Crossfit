import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import './Client.css';

const Client = () => {
  const [clients, setClients] = useState([
    { id: 1, fullName: 'Edwin Smith', lastAttendance: '2023-06-01 10:30' },
    { id: 2, fullName: 'Omar Johnson', lastAttendance: '2023-06-01 12:45' },
    { id: 3, fullName: 'Omar Guachamin', lastAttendance: '2023-06-01 12:45' },
    { id: 4, fullName: 'Jhon tan', lastAttendance: '2023-06-01 12:45' },
  ]);

  const recordAttendance = (id) => {
    // Usar la fecha y hora local correctamente
    const newAttendance = new Date().toLocaleString();
    setClients(clients.map(client =>
      client.id === id ? { ...client, lastAttendance: newAttendance } : client
    ));
  };

  return (
    <div className="clients-container">
      <h3>Registro de Asistencia de Clientes</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Fecha y Hora de Asistencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.fullName}</td>
              <td>{client.lastAttendance}</td>
              <td>
                <Button variant="success" onClick={() => recordAttendance(client.id)}>
                  Registrar Asistencia
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Client;
