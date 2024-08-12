import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import './ClientePlans.css';

const ClientePlans = () => {
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del localStorage
      const response = await axios.get('/plans', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const plansData = Object.values(response.data.plan);
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const getColorClass = (index) => {
    const colors = ['primary', 'info', 'warning', 'info', 'danger'];
    return `bg-${colors[index % colors.length]}`;
  };

  return (
    <Container className="memberships-container">
      <h3>Planes Disponibles</h3>
      <Row>
        {plans.map((plan, index) => (
          <Col md={4} key={plan.id} className="mb-4">
            <Card className={`text-white ${getColorClass(index)} plan-card`}>
              <Card.Body>
                <Card.Title>{plan.name}</Card.Title>
                <Card.Text><strong>ID:</strong> {plan.id}</Card.Text>
                <Card.Text>{plan.description}</Card.Text>
                <Card.Text><strong>Precio:</strong> ${plan.price}</Card.Text>
                <Card.Text><strong>Duración:</strong> {plan.duration} días</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ClientePlans;
