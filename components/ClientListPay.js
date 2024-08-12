import React from 'react';
import { Table } from 'react-bootstrap';

const ClientListPay = () => {
  const payments = [
    { date: '2023-01-15', plan: 'Básico', price: '50 USD', method: 'Tarjeta de Crédito', status: 'Pagado' },
    { date: '2023-02-15', plan: 'Avanzado', price: '75 USD', method: 'PayPal', status: 'Pendiente' },
    // Agrega más pagos según necesites
  ];

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Fecha de Pago</th>
          <th>Plan</th>
          <th>Precio</th>
          <th>Método de Pago</th>
          <th>Estado de Pago</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((pay, index) => (
          <tr key={index}>
            <td>{pay.date}</td>
            <td>{pay.plan}</td>
            <td>{pay.price}</td>
            <td>{pay.method}</td>
            <td>{pay.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ClientListPay;
