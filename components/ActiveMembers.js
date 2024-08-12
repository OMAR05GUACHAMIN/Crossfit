// src/components/ActiveMembers.js
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

const ActiveMembers = () => {
  const [attendancesByGender, setAttendancesByGender] = useState([]);
  const [annualAttendances, setAnnualAttendances] = useState([]);
  const [dailyAttendances, setDailyAttendances] = useState([]);
  const [monthlyAttendances, setMonthlyAttendances] = useState([]);
  const [totalAttendances, setTotalAttendances] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  const fetchAttendancesByGender = async () => {
    try {
      const response = await axios.get('attendances_by_gender', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const attendancesData = Object.values(response.data.attendaces_by_gender);
      if (Array.isArray(attendancesData)) {
        setAttendancesByGender(attendancesData);
      } else {
        console.error('Expected array but got:', attendancesData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchAnnualAttendances = async () => {
    try {
      const response = await axios.get('/annual_attendances', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const annualData = Object.values(response.data.annual_attendance);
      if (Array.isArray(annualData)) {
        setAnnualAttendances(annualData);
      } else {
        console.error('Expected array but got:', annualData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchDailyAttendances = async () => {
    try {
      const response = await axios.get('/daily_attendances', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const dailyData = Object.values(response.data.daily_attendance);
      if (Array.isArray(dailyData)) {
        setDailyAttendances(dailyData);
      } else {
        console.error('Expected array but got:', dailyData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchMonthlyAttendances = async () => {
    try {
      const response = await axios.get('/monthly_attendances', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const monthlyData = Object.values(response.data.monthly_attendance);
      if (Array.isArray(monthlyData)) {
        setMonthlyAttendances(monthlyData);
      } else {
        console.error('Expected array but got:', monthlyData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  const fetchTotalAttendances = async () => {
    try {
      const response = await axios.get('/total_attendances', {
        headers: {
          Authorization: 'Bearer YOUR_ACCESS_TOKEN' // Reemplaza con tu token real
        }
      });
      console.log('API response:', response.data); // Log para depuración
      const totalData = Object.values(response.data.total_attendance);
      if (Array.isArray(totalData)) {
        setTotalAttendances(totalData);
      } else {
        console.error('Expected array but got:', totalData);
        setErrorMessages(['Error: Expected array but got non-array response.']);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessages(['Error fetching data.']);
    }
  };

  useEffect(() => {
    fetchAttendancesByGender();
    fetchAnnualAttendances();
    fetchDailyAttendances();
    fetchMonthlyAttendances();
    fetchTotalAttendances();
  }, []);

  const genderBarChartData = {
    labels: attendancesByGender.map(item => item.gender),
    datasets: [
      {
        label: 'Attendances by Gender',
        data: attendancesByGender.map(item => item.total_attendances),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const annualBarChartData = {
    labels: annualAttendances.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Annual Attendances',
        data: annualAttendances.map(item => item.annual_attendances),
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const dailyBarChartData = {
    labels: dailyAttendances.map(item => new Date(item.day).toLocaleDateString()), // Convierte la fecha a un formato legible
    datasets: [
      {
        label: 'Daily Attendances',
        data: dailyAttendances.map(item => item.daily_attendances),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const monthlyBarChartData = {
    labels: monthlyAttendances.map(item => `Year ${item.year} Month ${item.month}`),
    datasets: [
      {
        label: 'Monthly Attendances',
        data: monthlyAttendances.map(item => item.monthly_attendances),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const totalBarChartData = {
    labels: totalAttendances.map(item => `ID ${item.id}`),
    datasets: [
      {
        label: 'Total Attendances',
        data: totalAttendances.map(item => item.total_attendances),
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
    <div className="active-members-container">
      <h3 style={{ color: 'black' }}>Gráficos de Asistencias</h3>
      {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          {errorMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}> 
          <Bar data={genderBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Asistencias por Género' } }} />
          <h4 style={{ color: 'black' }}>Asistencias por Género</h4>
        </div>
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={annualBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Asistencias Anuales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Anuales</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={dailyBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Asistencias Diarias' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Diarias</h4>
        </div>
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={monthlyBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Asistencias Mensuales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Mensuales</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 chart-container" style={{ height: '400px' }}>
          <Bar data={totalBarChartData} options={{ ...chartOptions, title: { ...chartOptions.title, text: 'Asistencias Totales' } }} />
          <h4 style={{ color: 'black' }}>Asistencias Totales</h4>
        </div>
      </div>
    </div>
  );
};

export default ActiveMembers;
