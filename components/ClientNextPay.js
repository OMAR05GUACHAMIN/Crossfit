import React from 'react';
import { Table } from 'react-bootstrap';

const ClientNextPay = () => {
  const upcomingPayments = [
    { date: '2023-07-01', plan: 'Básico', price: '50 USD', status: 'Pendiente' },
    { date: '2023-07-15', plan: 'Avanzado', price: '75 USD', status: 'Pendiente' },
    // Añadir más registros según necesario
  ];

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Fecha de Pago</th>
          <th>Plan</th>
          <th>Precio</th>
          <th>Estado de Pago</th>
        </tr>
      </thead>
      <tbody>
        {upcomingPayments.map((payment, index) => (
          <tr key={index}>
            <td>{payment.date}</td>
            <td>{payment.plan}</td>
            <td>{payment.price}</td>
            <td>{payment.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ClientNextPay;
