import React, { useState, useEffect } from 'react';
import { Button, Table, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import axios from '../axiosConfig';
import AttendanceRegister from './AttendanceRegister';
import AttendanceEdit from './AttendanceEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faEye, faEdit, faSearch, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import './Attendance.css';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserAttendancesModal, setShowUserAttendancesModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentUserAttendances, setCurrentUserAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(0);

  const recordsPerPage = 10;

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get('/attendances');
      const records = response.data.attendance;
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const handleShowRegisterModal = () => {
    setCurrentRecord(null);
    setShowRegisterModal(true);
  };

  const handleShowUserAttendancesModal = (userAttendances) => {
    setCurrentUserAttendances(userAttendances);
    setShowUserAttendancesModal(true);
  };

  const handleShowEditModal = (record) => {
    setCurrentRecord(record);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setShowEditModal(false);
    setShowUserAttendancesModal(false);
    setCurrentRecord(null);
    fetchAttendanceRecords();
  };

  const handleAddOrUpdateAttendance = async (recordData) => {
    try {
      if (currentRecord && currentRecord.id) {
        await axios.put(`/attendances/${currentRecord.id}`, recordData);
      } else {
        await axios.post('/attendances', recordData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating attendance record:', error);
    }
  };

  const handleDeleteAttendance = async (id, record) => {
    try {
      await axios.delete(`/members/${record.memberId}/attendances/${record.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      Swal.fire({
        title: "Asistencias",
        text: "Registro Eliminado !!",
        icon: "success"
      });
      fetchAttendanceRecords();
      setCurrentUserAttendances(currentUserAttendances.filter(attendance => attendance.id !== id));
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el registro de asistencia",
        icon: "error"
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const groupedRecords = Object.values(attendanceRecords.reduce((acc, record) => {
    const key = `${record.Member.user.name}-${record.Member.user.lastname}`;
    if (!acc[key]) {
      acc[key] = { ...record, count: 1 };
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {}));

  const filteredRecords = groupedRecords
    .filter((record) => 
      record.Member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.Member.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.memberId.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      const valueA = a.Member.user[sortConfig.key] ? a.Member.user[sortConfig.key].toLowerCase() : '';
      const valueB = b.Member.user[sortConfig.key] ? b.Member.user[sortConfig.key].toLowerCase() : '';
      if (sortConfig.direction === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

  const displayedRecords = filteredRecords.slice(currentPage * recordsPerPage, (currentPage + 1) * recordsPerPage);

  return (
    <div className="attendance-container">
      <h3>Registro de Asistencia</h3>
      <div className="button-right">
        <Button variant="primary" onClick={handleShowRegisterModal}>
          <FontAwesomeIcon icon={faPlus} /> Nueva Asistencia
        </Button>
      </div>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar por nombre, apellido o ID de miembro"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortOrderChange('name')}>
              <div className="d-flex justify-content-between align-items-center">
                Nombre
                <FontAwesomeIcon icon={sortConfig.key === 'name' && sortConfig.direction === 'asc' ? faSortAlphaUp : faSortAlphaDown} />
              </div>
            </th>
            <th onClick={() => handleSortOrderChange('lastname')}>
              <div className="d-flex justify-content-between align-items-center">
                Apellido
                <FontAwesomeIcon icon={sortConfig.key === 'lastname' && sortConfig.direction === 'asc' ? faSortAlphaUp : faSortAlphaDown} />
              </div>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayedRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.Member.user.name}</td>
              <td>{record.Member.user.lastname}</td>
              <td>
                <Button variant="" onClick={() => handleShowUserAttendancesModal(attendanceRecords.filter(r => r.memberId === record.memberId))}>
                  <FontAwesomeIcon icon={faEye} /> Ver Asistencias
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(filteredRecords.length / recordsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      {showRegisterModal && (
        <AttendanceRegister
          showModal={showRegisterModal}
          handleClose={handleCloseModal}
          addOrUpdateAttendance={handleAddOrUpdateAttendance}
        />
      )}
      {showEditModal && (
        <AttendanceEdit
          showModal={showEditModal}
          handleClose={handleCloseModal}
          addOrUpdateAttendance={handleAddOrUpdateAttendance}
          attendance={currentRecord}
        />
      )}
      {showUserAttendancesModal && (
        <Modal show={showUserAttendancesModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Asistencias del Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUserAttendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td>{attendance.id}</td>
                    <td>{new Date(attendance.date).toLocaleDateString()}</td>
                    <td>{attendance.Member.user.name}</td>
                    <td>{attendance.Member.user.lastname}</td>
                    <td>
                      <Button variant="" onClick={() => handleShowEditModal(attendance)}>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </Button>
                      <Button variant="" onClick={() => handleDeleteAttendance(attendance.id, attendance)}>
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Attendance;