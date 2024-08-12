import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import './Memberships.css';

const ClienteAsistencias = () => {
  const [attendances, setAttendances] = useState([]);

  const fetchAttendances = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage
      const response = await axios.get('/attendances', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const attendancesData = Object.values(response.data.attendance);
      setAttendances(attendancesData);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  return (
    <div className="memberships-container">
      <h3>Historial de Asistencias</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Plan del Miembro</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map(attendance => (
            <tr key={attendance.id}>
              <td>{attendance.id}</td>
              <td>{new Date(attendance.date).toLocaleDateString()}</td>
              <td>{attendance.status ? 'Presente' : 'Ausente'}</td>
              <td>{attendance.Member.plan.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClienteAsistencias;
