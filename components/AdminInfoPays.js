import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Table, Container, Alert, Pagination, Form, InputGroup, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaDown, faSortAlphaUp, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdminInfoPays.css'; // Importa el archivo CSS personalizado

const AdminInfoPays = () => {
  const [paysInfo, setPaysInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPaysInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErrorMessage('No token found, please log in again.');
          return;
        }

        const response = await axios.get('/pays_info', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.pay) {
          setPaysInfo(response.data.pay);
        } else {
          setErrorMessage(response.data ? response.data.message : 'Ocurrió un error.');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage(error.response?.data?.message || 'Ocurrió un error.');
      }
    };

    fetchPaysInfo();
  }, []);

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? faSortAlphaUp : faSortAlphaDown;
    }
    return faSort;
  };

  const sortedPaysInfo = [...paysInfo].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredPaysInfo = sortedPaysInfo.filter(pay => 
    pay.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pay.user_lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPaysInfo.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    const totalItems = filteredPaysInfo.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <Container>
      {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
      
      <Card className="mt-3">
        <Card.Body style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="text-center">Información de pagos</h2>
          <InputGroup className="my-3">
            <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o apellido"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page number on search
              }}
            />
          </InputGroup>
          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th onClick={() => sortTable('user_name')} className="sortable-column">
                  <div className="d-flex justify-content-center align-items-center">
                    Nombre <FontAwesomeIcon icon={getSortIcon('user_name')} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => sortTable('user_lastname')} className="sortable-column">
                  <div className="d-flex justify-content-center align-items-center">
                    Apellido <FontAwesomeIcon icon={getSortIcon('user_lastname')} className="ml-1" />
                  </div>
                </th>
                <th>Email</th>
                <th>Plan</th>
                <th>Fecha de Primer Pago</th>
                <th>Fecha de Último Pago</th>
                <th>Fecha de Próximo Pago</th>
                <th>Días Restantes</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(pay => (
                <tr key={pay.id} className="text-center">
                  <td>{pay.user_name}</td>
                  <td>{pay.user_lastname}</td>
                  <td>{pay.member_email}</td>
                  <td>{pay.plan_name}</td>
                  <td>{new Date(pay.first_payment_date).toLocaleDateString()}</td>
                  <td>{new Date(pay.last_payment_date).toLocaleDateString()}</td>
                  <td>{new Date(pay.next_payment_date).toLocaleDateString()}</td>
                  <td>{pay.days_remaining}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="mt-3 justify-content-center">
            <Pagination.Prev onClick={() => currentPage > 1 && paginate(currentPage - 1)} />
            {renderPaginationItems()}
            <Pagination.Next onClick={() => currentPage < Math.ceil(filteredPaysInfo.length / itemsPerPage) && paginate(currentPage + 1)} />
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminInfoPays;
