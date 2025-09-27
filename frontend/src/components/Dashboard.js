// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Accept a new function prop: onStatCardClick
function Dashboard({ onStatCardClick }) {
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
      <div className="stats-grid">
        {/* Make the stat card a button and call the prop on click */}
        <button className="stat-card" onClick={onStatCardClick}>
          <h3>Total Reports</h3>
          <p>{stats.total_reports}</p>
        </button>
        <button className="stat-card" onClick={onStatCardClick}>
          <h3>Total Potholes Detected (AI)</h3>
          <p>{stats.total_potholes_detected}</p>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;