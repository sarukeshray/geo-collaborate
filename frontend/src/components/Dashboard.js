// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/reports/stats';
    axios.get(apiUrl)
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="dashboard-container"><p>Loading stats...</p></div>;
  }

  if (!stats) {
    return <div className="dashboard-container"><p>Could not load stats.</p></div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Live Platform Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p>{stats.total_reports}</p>
        </div>
        <div className="stat-card">
          <h3>Total Potholes Detected (AI)</h3>
          <p>{stats.total_potholes_detected}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;