// src/components/EarningStatistics.js
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EarningStatistics = () => {
  const [annualEarnings, setAnnualEarnings] = useState([]);
  const [earningsByPlan, setEarningsByPlan] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const fetchAnnualEarnings = async () => {
    try {
      const response = await axios.get('annual_earnings', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const earningsData = Object.values(response.data.annual_earning);
      if (Array.isArray(earningsData)) {
        setAnnualEarnings(earningsData);
      } else {
        console.error('Expected array but got:', earningsData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchEarningsByPlan = async () => {
    try {
      const response = await axios.get('/earnings_by_plan', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const earningsData = Object.values(response.data.earnings_by_plan);
      if (Array.isArray(earningsData)) {
        setEarningsByPlan(earningsData);
      } else {
        console.error('Expected array but got:', earningsData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchMonthlyEarnings = async () => {
    try {
      const response = await axios.get('/monthly_earnings', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const earningsData = Object.values(response.data.monthly_earning);
      if (Array.isArray(earningsData)) {
        setMonthlyEarnings(earningsData);
      } else {
        console.error('Expected array but got:', earningsData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchTotalEarnings = async () => {
    try {
      const response = await axios.get('/total_earnings', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const earningsData = Object.values(response.data.total_earning);
      if (Array.isArray(earningsData)) {
        setTotalEarnings(earningsData);
      } else {
        console.error('Expected array but got:', earningsData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  useEffect(() => {
    fetchAnnualEarnings();
    fetchEarningsByPlan();
    fetchMonthlyEarnings();
    fetchTotalEarnings();
  }, []);

  const annualBarChartData = {
    labels: annualEarnings.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Annual Earnings',
        data: annualEarnings.map(item => parseFloat(item.annual_earnings)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const earningsByPlanPieChartData = {
    labels: earningsByPlan.map(item => item.plan_name),
    datasets: [
      {
        label: 'Earnings by Plan',
        data: earningsByPlan.map(item => parseFloat(item.earnings)),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const monthlyPieChartData = {
    labels: monthlyEarnings.map(item => `Year ${item.year} Month ${item.month}`),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: monthlyEarnings.map(item => parseFloat(item.monthly_earnings)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const totalBarChartData = {
    labels: totalEarnings.map(item => `ID ${item.id}`),
    datasets: [
      {
        label: 'Total Earnings',
        data: totalEarnings.map(item => parseFloat(item.total_earnings)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
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
    <div className="earning-statistics-container">
      <h3 style={{ color: 'black' }}>Gráficos de Ganancias</h3>
      {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          {errorMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={annualBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Ganancias Anuales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Diarias</h4>
        </div>
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Pie data={earningsByPlanPieChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Ganancias por Plan' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Diarias</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Pie data={monthlyPieChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Ganancias Mensuales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Diarias</h4>
        </div>
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={totalBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Ganancias Totales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Diarias</h4>
        </div>
      </div>
    </div>
  );
};

export default EarningStatistics;
