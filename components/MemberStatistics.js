// src/components/MemberStatistics.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MemberStatistics = () => {
  const [activeMembersData, setActiveMembersData] = useState([]);
  const [inactiveMembersData, setInactiveMembersData] = useState([]);
  const [totalMembersData, setTotalMembersData] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const fetchActiveMembersData = async () => {
    try {
      const response = await axios.get('/active_members', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Reemplaza con tu token real
        },
      });
      console.log('API response:', response.data); // Log para depuración
      const membersData = Object.values(response.data.active_membership);
      if (Array.isArray(membersData)) {
        setActiveMembersData(membersData);
      } else {
        console.error('Expected array but got:', membersData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchInactiveMembersData = async () => {
    try {
      const response = await axios.get('/inactive_members', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Reemplaza con tu token real
        },
      });
      console.log('API response:', response.data); // Log para depuración
      const membersData = Object.values(response.data.inactive_membership);
      if (Array.isArray(membersData)) {
        setInactiveMembersData(membersData);
      } else {
        console.error('Expected array but got:', membersData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchTotalMembersData = async () => {
    try {
      const response = await axios.get('/total_members', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Reemplaza con tu token real
        },
      });
      console.log('API response:', response.data); // Log para depuración
      const membersData = Object.values(response.data.total_membership);
      if (Array.isArray(membersData)) {
        setTotalMembersData(membersData);
      } else {
        console.error('Expected array but got:', membersData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  useEffect(() => {
    fetchActiveMembersData();
    fetchInactiveMembersData();
    fetchTotalMembersData();
  }, []);

  const activeBarChartData = {
    labels: activeMembersData.map(item => `ID ${item.id}`),
    datasets: [
      {
        label: 'Active Memberships',
        data: activeMembersData.map(item => item.active_memberships),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const inactiveBarChartData = {
    labels: inactiveMembersData.map(item => `ID ${item.id}`),
    datasets: [
      {
        label: 'Inactive Memberships',
        data: inactiveMembersData.map(item => item.inactive_memberships),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const totalBarChartData = {
    labels: totalMembersData.map(item => `ID ${item.id}`),
    datasets: [
      {
        label: 'Total Memberships',
        data: totalMembersData.map(item => item.total_memberships),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <div className="member-statistics-container">
      <h3 style={{ color: 'black' }}>Gráficos de Membresías</h3>
      {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          {errorMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={activeBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Membresías Activas' } }} />
          <h4 style={{ color: 'black' }}>Membresías Activas</h4>
        </div>
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={inactiveBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Membresías Inactivas' } }} />
          <h4 style={{ color: 'black' }}>Membresías Inactivas</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={totalBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Membresías Totales' } }} />
          <h4 style={{ color: 'black' }}>Membresías Totales</h4>
        </div>
      </div>
    </div>
  );
};

export default MemberStatistics;
