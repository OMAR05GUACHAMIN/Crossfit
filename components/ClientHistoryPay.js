import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ClientListPay from './ClientListPay'; 
import ClientNextPay from './ClientNextPay'; 

const ClientHistoryPay = () => {
  const [showList, setShowList] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);

  const toggleListModal = () => setShowList(!showList);
  const toggleUpcomingModal = () => setShowUpcoming(!showUpcoming);

  return (
    <div className="client-history-pay-container">
      <h3>Historial y Próximos Pagos de Clientes</h3>
      <Button variant="primary" onClick={toggleListModal}>Lista de Pagos</Button>
      <Button variant="info" onClick={toggleUpcomingModal}>Próximos Pagos</Button>

      <Modal show={showList} onHide={toggleListModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lista de Pagos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientListPay />
        </Modal.Body>
      </Modal>

      <Modal show={showUpcoming} onHide={toggleUpcomingModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Próximos Pagos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientNextPay />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientHistoryPay;
