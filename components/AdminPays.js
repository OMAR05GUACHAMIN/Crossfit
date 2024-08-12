import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faSortAlphaDown, faSortAlphaUp, faEdit, faUpload, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from '../axiosConfig';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { storage, uploadFile } from '../firebaseConfig';
import './Pay.css';

const AdminPays = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);

  const paymentsPerPage = 10;

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/pays', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const payments = response.data.pay;
      setPayments(payments);
      setGroupedPayments(groupByMember(payments));
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/members', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const members = response.data.members;
      setMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  };

  const groupByMember = (payments) => {
    const grouped = payments.reduce((acc, payment) => {
      const memberId = payment.memberId;
      if (!acc[memberId]) {
        acc[memberId] = [];
      }
      acc[memberId].push(payment);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  const handleShowModal = (payment = null) => {
    setCurrentPayment(payment || { date: '', payment_type: '', memberId: '', status: true });
    setShowModal(true);
  };

  const handleShowViewModal = (memberPayments) => {
    setViewMember(memberPayments);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPayment(null);
    setErrorMessages([]);
    fetchPayments();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewMember(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfUploadChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleAddOrUpdatePayment = async () => {
    const requiredFields = ['date', 'payment_type', ...(currentPayment?.id ? [] : ['memberId'])];
    const emptyFields = requiredFields.filter(field => !currentPayment[field]);

    if (emptyFields.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error"
      });
      return;
    }

    try {
      let pdfUrl = currentPayment.pdfUrl;

      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, `pdfs/${currentPayment.memberId}_${Date.now()}.pdf`);
      }

      const { memberId, id, ...paymentData } = { ...currentPayment, pdfUrl };
      if (id) {
        await axios.put(`/members/${memberId}/pays/${id}`, paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments((prevPayments) =>
          prevPayments.map((p) => (p.id === id ? { ...currentPayment, id, pdfUrl } : p))
        );
        Swal.fire({
          title: "Pago",
          text: "Pago actualizado con éxito",
          icon: "success"
        });
      } else {
        const response = await axios.post(`/members/${memberId}/pays`, paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments((prevPayments) => [...prevPayments, response.data]);
        Swal.fire({
          title: "Pago",
          text: "Pago creado con éxito",
          icon: "success"
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error updating payment:', error);
      setErrorMessages(['Error updating payment. Please try again.']);
    }
  };

  const handlePdfUpload = async (payment) => {
    try {
      if (!pdfFile) {
        Swal.fire({
          title: "Error",
          text: "Por favor, seleccione un archivo PDF.",
          icon: "error"
        });
        return;
      }

      const pdfUrl = await uploadFile(pdfFile, `pdfs/${payment.memberId}_${Date.now()}.pdf`);

      payment.pdf_url = pdfUrl;
      payment.pdfUrl = pdfUrl;
      await axios.put(`/members/${payment.memberId}/pays/${payment.id}`, payment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setPayments((prevPayments) =>
        prevPayments.map((p) => (p.id === payment.id ? { ...p, pdfUrl } : p))
      );

      Swal.fire({
        title: "PDF Subido",
        text: "El PDF se ha subido correctamente.",
        icon: "success"
      });

    } catch (error) {
      console.error('Error uploading PDF:', error);
      Swal.fire({
        title: "Error",
        text: "Error uploading PDF. Please try again.",
        icon: "error"
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortOrderChange = (key) => {
    setSortKey(key);
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Filtrado de pagos antes de la paginación
  const filteredPayments = groupedPayments.filter(group =>
    group.some(payment =>
      payment.Member.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.Member.user?.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Ordenamiento de pagos
  const sortedPayments = filteredPayments.sort((a, b) => {
    const keyA = a[0].Member.user?.[sortKey] || '';
    const keyB = b[0].Member.user?.[sortKey] || '';

    if (sortOrder === 'asc') {
      return keyA.localeCompare(keyB);
    } else {
      return keyB.localeCompare(keyA);
    }
  });

  // Paginación de pagos
  const offset = currentPage * paymentsPerPage;
  const currentPayments = sortedPayments.slice(offset, offset + paymentsPerPage);

  return (
    <div className="pay-container">
      <h3 style={{ color: 'black', textAlign: 'center' }}>Gestión de Pagos</h3>
      <div className="button-right">
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Pago
        </Button>
      </div>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="d-none">ID</th>
            <th className="d-none">Correo del Miembro</th>
            <th onClick={() => handleSortOrderChange('name')}>
              <div className="d-flex justify-content-between align-items-center">
                Nombre
                <FontAwesomeIcon icon={sortOrder === 'asc' && sortKey === 'name' ? faSortAlphaDown : faSortAlphaUp} />
              </div>
            </th>
            <th onClick={() => handleSortOrderChange('lastname')}>
              <div className="d-flex justify-content-between align-items-center">
                Apellido 
                <FontAwesomeIcon icon={sortOrder === 'asc' && sortKey === 'lastname' ? faSortAlphaDown : faSortAlphaUp} />
              </div>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((memberPayments) => (
            <tr key={memberPayments[0].memberId}>
              <td className="d-none">{memberPayments[0].memberId}</td>
              <td className="d-none">{memberPayments[0].Member.email}</td>
              <td>{memberPayments[0].Member.user?.name}</td>
              <td>{memberPayments[0].Member.user?.lastname}</td>
              <td>
                <Button variant="" onClick={() => handleShowViewModal(memberPayments)}>
                  <FontAwesomeIcon icon={faEye} /> Ver Pagos
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
        pageCount={Math.ceil(filteredPayments.length / paymentsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{currentPayment?.id ? 'Editar Pago' : 'Nuevo Pago'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessages.length > 0 && (
              <Alert variant="danger">
                {errorMessages.map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </Alert>
            )}
            <Form>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={currentPayment?.date || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo de Pago</Form.Label>
                <Form.Control
                  as="select"
                  name="payment_type"
                  value={currentPayment?.payment_type || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona un tipo de pago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                </Form.Control>
              </Form.Group>
              {!currentPayment?.id && (
                <Form.Group>
                  <Form.Label>Correo del Miembro</Form.Label>
                  <Form.Control
                    as="select"
                    name="memberId"
                    value={currentPayment?.memberId || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecciona un correo</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.email}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Activo"
                  name="status"
                  checked={currentPayment?.status || false}
                  onChange={(e) =>
                    setCurrentPayment((prev) => ({ ...prev, status: e.target.checked }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleAddOrUpdatePayment}>
              {currentPayment?.id ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showViewModal && (
        <Modal show={showViewModal} onHide={handleCloseViewModal} centered className="pay-modal">
          <Modal.Header closeButton>
            <Modal.Title>Pagos del Miembro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewMember && (
              <div>
                <h5>Pagos para {viewMember[0].Member.email}</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Tipo de Pago</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewMember.map(payment => (
                      <tr key={payment.id}>
                        <td>{payment.id}</td>
                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                        <td>{payment.status ? 'Activo' : 'Inactivo'}</td>
                        <td>{payment.payment_type}</td>
                        <td>
                          <div className="table-actions">
                            <Button variant="" onClick={() => handleShowModal(payment)} size="sm">
                              <FontAwesomeIcon icon={faEdit} size="sm" /> Editar
                            </Button>
                            <Form.Control
                              type="file"
                              accept="application/pdf"
                              onChange={handlePdfUploadChange}
                              className="file-label"
                            />
                            <Button variant="" onClick={() => handlePdfUpload(payment)} size="sm">
                              <FontAwesomeIcon icon={faUpload} size="sm" /> Subir PDF
                            </Button>
                            {payment.pdfUrl && (
                              <Button variant="link" href={payment.pdfUrl} target="_blank" size="sm">
                                <FontAwesomeIcon icon={faEye} size="sm" /> Ver PDF
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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

export default AdminPays;
