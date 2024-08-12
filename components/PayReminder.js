import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PayReminder = ({ showModal, handleClose, nextPaymentDate, daysLeft }) => {
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Recordatorio de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: 'black' }}>La próxima fecha de pago es el <strong style={{ color: 'black' }}>{nextPaymentDate}</strong>.</p>
        <p style={{ color: 'black' }}>Quedan <strong style={{ color: 'black' }}>{daysLeft}</strong> días para realizar el pago.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PayReminder;
