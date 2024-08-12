import React, { useState, useEffect } from 'react';
import { Button, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import axios from '../axiosConfig';
import MembershipsForm from './MembershipsForm';
import MembershipsNew from './MembershipsNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faToggleOn, faToggleOff, faPlus, faEye, faSearch, faSort } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import './Memberships.css';

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMembership, setViewMembership] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('lastname');
  const [sortOrder, setSortOrder] = useState('asc');
  const membershipsPerPage = 10;

  const fetchMemberships = async () => {
    try {
      const response = await axios.get('/members', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMemberships(response.data.members);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleShowModal = (membership = null) => {
    setCurrentMembership(membership);
    setShowModal(true);
  };

  const handleShowNewModal = () => {
    setShowNewModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMembership(null);
  };

  const handleCloseNewModal = () => {
    setShowNewModal(false);
    fetchMemberships(); // Actualiza la lista de membresías después de cerrar el modal
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMembership(null);
  };

  const handleAddOrUpdateMembership = (membership, isNew = false) => {
    if (isNew) {
      setMemberships(prevMemberships => [...prevMemberships, membership]);
    } else {
      fetchMemberships();
    }
    setShowModal(false);
    setShowNewModal(false);
  };

  const toggleMembershipStatus = async (membership) => {
    try {
      const response = await axios.delete(`/members/${membership.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        const updatedMembership = response.data.member;
        setMemberships(prevMemberships =>
          prevMemberships.map(m =>
            m.id === membership.id ? updatedMembership : m
          )
        );
      } else {
        console.error('Error toggling membership status:', response.data);
      }
    } catch (error) {
      console.error('Error toggling membership status:', error);
    }
  };

  const handleViewMembership = (membership) => {
    setViewMembership(membership);
    setShowViewModal(true);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  const handleSortChange = (criteria) => {
    const newSortOrder = (sortCriteria === criteria && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortCriteria(criteria);
    setSortOrder(newSortOrder);
  };

  const sortMemberships = (memberships, criteria, order) => {
    return memberships.sort((a, b) => {
      const comparison = (a.user?.[criteria] || '').localeCompare(b.user?.[criteria] || '');
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const sortedMemberships = sortMemberships(memberships, sortCriteria, sortOrder);

  const filteredMemberships = sortedMemberships.filter(
    membership =>
      membership.user?.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * membershipsPerPage;
  const currentMemberships = filteredMemberships.slice(offset, offset + membershipsPerPage);

  return (
    <div className="memberships-container">
      <h3>Gestión de Membresías</h3>
      <div className="button-right">
        <Button variant="primary" onClick={handleShowNewModal}>
          <FontAwesomeIcon icon={faPlus} /> Nueva Membresía
        </Button>
      </div>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Buscar por apellido o nombre"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
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
            <th>Plan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMemberships.map(membership => (
            <tr key={membership.id}>
              <td>{membership.user?.lastname || 'N/A'}</td>
              <td>{membership.user?.name || 'N/A'}</td>
              <td>{membership.status ? 'Activo' : 'Inactivo'}</td>
              <td>{membership.plan ? membership.plan.name : 'No Asignado'}</td>
              <td>
                <Button variant="" onClick={() => handleViewMembership(membership)}>
                  <FontAwesomeIcon icon={faEye} /> Ver
                </Button>
                <Button variant="" onClick={() => handleShowModal(membership)}>
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </Button>
                <Button
                  variant={membership.status ? '' : ''}
                  onClick={() => toggleMembershipStatus(membership)}
                >
                  <FontAwesomeIcon icon={membership.status ? faToggleOff : faToggleOn} /> {membership.status ? 'Desactivar' : 'Activar'}
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
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        pageCount={Math.ceil(filteredMemberships.length / membershipsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
      />
      {showModal && (
        <MembershipsForm
          showModal={showModal}
          handleClose={handleCloseModal}
          addOrUpdateMembership={handleAddOrUpdateMembership}
          currentMembership={currentMembership}
        />
      )}
      {showNewModal && (
        <MembershipsNew
          showModal={showNewModal}
          handleClose={handleCloseNewModal}
          addMembership={handleAddOrUpdateMembership}
          memberships={memberships}
        />
      )}
      {showViewModal && (
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Información de Membresía</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewMembership && (
              <div className="text-black">
                <p><strong>ID:</strong> {viewMembership.id}</p>
                <p><strong>Correo Electrónico:</strong> {viewMembership.email}</p>
                <p><strong>Apellido:</strong> {viewMembership.user?.lastname || 'N/A'}</p>
                <p><strong>Nombre:</strong> {viewMembership.user?.name || 'N/A'}</p>
                <p><strong>Estado:</strong> {viewMembership.status ? 'Activo' : 'Inactivo'}</p>
                <p><strong>Plan:</strong> {viewMembership.plan ? viewMembership.plan.name : 'No Asignado'}</p>
                <p><strong>Fecha de Inscripción:</strong> {new Date(viewMembership.inscriptionDate).toLocaleDateString()}</p>
                <p><strong>Fecha de Creación:</strong> {new Date(viewMembership.createdAt).toLocaleDateString()}</p>
                <p><strong>Fecha de Actualización:</strong> {new Date(viewMembership.updatedAt).toLocaleDateString()}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Memberships;
