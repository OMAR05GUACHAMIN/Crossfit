import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AttendanceTab = ({ showModal, handleClose, currentRecord, updateAttendance }) => {
  const [record, setRecord] = useState(currentRecord);

  useEffect(() => {
    if (currentRecord) {
      setRecord({
        ...currentRecord,
        dateTime: currentRecord.dateTime.slice(0, 16) // Prepare dateTime for input control
      });
    }
  }, [currentRecord]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });
  };

  const handleSubmit = () => {
    // Ensure to convert dateTime back to full ISO string if necessary
    updateAttendance({
      ...record,
      dateTime: new Date(record.dateTime).toISOString()
    });
    handleClose();
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Registro de Asistencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" readOnly value={record.id} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha y Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="dateTime"
              value={record.dateTime}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID de Miembro</Form.Label>
            <Form.Control type="text" readOnly value={record.member_id} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" readOnly value={record.member_name} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Apellido</Form.Label>
            <Form.Control type="text" readOnly value={record.member_lastname} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" readOnly value={record.member_email} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control as="select" name="status" value={record.status.toString()} onChange={handleInputChange}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceTab;
