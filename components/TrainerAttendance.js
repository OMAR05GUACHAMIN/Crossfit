import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Card, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import './Memberships.css';

const TrainerAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [groupedAttendances, setGroupedAttendances] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedAttendances, setSelectedAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'asc' });

  const fetchAttendances = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage
      const response = await axios.get('/attendances', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const attendancesData = Object.values(response.data.attendance);
      const groupedData = groupByEmail(attendancesData);
      setAttendances(attendancesData);
      setGroupedAttendances(groupedData);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    }
  };

  const groupByEmail = (attendances) => {
    return attendances.reduce((acc, attendance) => {
      const { email } = attendance.Member;
      if (!acc[email]) {
        acc[email] = [];
      }
      acc[email].push(attendance);
      return acc;
    }, {});
  };

  const handleViewDetails = (email) => {
    setSelectedEmail(email);
    setSelectedAttendances(groupedAttendances[email]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmail('');
    setSelectedAttendances([]);
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAttendances = Object.keys(groupedAttendances).sort((a, b) => {
    if (sortConfig.key === 'email') {
      if (a < b) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a > b) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const filteredAttendances = sortedAttendances.filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="memberships-container">
      <h3>Asistencias Clientes</h3>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar por email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
              Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendances.map(email => (
            <tr key={email}>
              <td>{email}</td>
              <td>
                <Button variant="" onClick={() => handleViewDetails(email)}>
                  <i className="fa fa-eye"></i> Ver Asistencia
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Asistencias para {selectedEmail}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {selectedAttendances.map((attendance, index) => (
              <Col key={index} md={6}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{new Date(attendance.date).toLocaleDateString()}</Card.Title>
                    <Card.Text>
                      Estado: {attendance.status ? 'Presente' : 'Ausente'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrainerAttendance;
