import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import axios from '../axiosConfig';
import EditUserForm from './EditUserForm';
import UserForm from './UserForm';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faToggleOn, faToggleOff, faEye, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para manejar el orden ascendente o descendente
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let usersData = Object.values(response.data.user);
      usersData = sortUsers(usersData, sortCriteria, sortOrder);
      setUsers(usersData);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.error || 'Failed to fetch users');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortCriteria, sortOrder]);

  const handleShowModal = (user = null) => {
    setCurrentUser(user);
    setIsNewUser(!user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowViewModal = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const addUser = async (user) => {
    try {
      const response = await axios.post('/users', user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsers();
      Swal.fire({
        title: "Usuario creado",
        text: "Se ha enviado un correo para verificar el nuevo usuario",
        icon: "success"
      });
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire({
        title: "Error",
        text: error.response.data.error || "No se pudo crear el usuario",
        icon: "error"
      });
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await axios.put(`/users/${updatedUser.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
    handleCloseModal();
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(user => user.id === userId);
      await axios.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchUsers();
      Swal.fire({
        title: "Usuario actualizado",
        text: "Usuario actualizado con éxito",
        icon: "success"
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (criteria) => {
    const newSortOrder = (sortCriteria === criteria && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortCriteria(criteria);
    setSortOrder(newSortOrder);
  };

  const sortUsers = (users, criteria, order) => {
    return users.sort((a, b) => {
      const comparison = (a[criteria] || '').localeCompare(b[criteria] || '');
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearchClick = () => {
    // Implementa la lógica de búsqueda aquí si es necesario
  };

  return (
    <div className="users-container">
      <h3 style={{ color: 'black', textAlign: 'center' }}>Administrar Usuarios</h3>
      <div className="button-right">
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FontAwesomeIcon icon={faPlus} /> Crear Usuario
        </Button>
      </div>
      <InputGroup className="mb-3">
      <InputGroup.Text onClick={handleSearchClick} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon icon={faSearch} />
      </InputGroup.Text>
      <Form.Control
      type="text"
      placeholder="Buscar por nombre o apellido"
      value={searchTerm}
      onChange={handleSearch}
      />
      </InputGroup>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>
              Apellido
              <FontAwesomeIcon
                icon={faSort}
                onClick={() => handleSortChange('lastname')}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
              />
            </th>
            <th>
              Nombre
              <FontAwesomeIcon
                icon={faSort}
                onClick={() => handleSortChange('name')}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
              />
            </th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>
                <img
                  src={user.image || '/images/default-profile.png'}
                  alt="Profile"
                  className="profile-image-table"
                />
              </td>
              <td>{user.lastname}</td>
              <td>{user.name}</td>
              <td>{user.status ? 'Activado' : 'Desactivado'}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="" onClick={() => handleShowModal(user)}>
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </Button>
                <Button
                  variant={user.status ? '' : ''}
                  onClick={() => toggleUserStatus(user.id)}
                >
                  <FontAwesomeIcon icon={user.status ? faToggleOff : faToggleOn} /> {user.status ? 'Desactivar' : 'Activar'}
                </Button>
                <Button variant="" onClick={() => handleShowViewModal(user)}>
                  <FontAwesomeIcon icon={faEye} /> Ver
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
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      {showModal && (
        isNewUser ? (
          <UserForm
            showModal={showModal}
            handleClose={handleCloseModal}
            addUser={addUser}
          />
        ) : (
          <EditUserForm
            showModal={showModal}
            handleClose={handleCloseModal}
            updateUser={updateUser}
            user={currentUser}
            isNewUser={isNewUser}
          />
        )
      )}
      {showViewModal && currentUser && (
        <ViewUserModal
          show={showViewModal}
          onHide={handleCloseViewModal}
          user={currentUser}
        />
      )}
    </div>
  );
};

const ViewUserModal = ({ show, onHide, user }) => {
  if (!user) {
    return null;
  }
  
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Identificación:</strong> {user.identification}</p>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Apellido:</strong> {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Teléfono:</strong> {user.phone}</p>
        <p><strong>Teléfono de Emergencia:</strong> {user.emergencyPhone}</p>
        <p><strong>Fecha de Nacimiento:</strong> {new Date(user.bornDate).toLocaleDateString()}</p>
        <p><strong>Dirección:</strong> {user.direction}</p>
        <p><strong>Género:</strong> {user.gender}</p>
        <p><strong>Nacionalidad:</strong> {user.nacionality}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>Estado:</strong> {user.status ? 'Activado' : 'Desactivado'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Users;
