// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap';
import SubmissionModal from './components/SubmissionModal';
import './components/SubmissionForm.css';

function App() {
  const mapCenter = [20.5937, 78.9629];
  const [reports, setReports] = useState([]);
  const [viewMode, setViewMode] = useState('markers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightMarkers, setHighlightMarkers] = useState(false); // New state for animation

  const fetchReports = useCallback(() => {
    axios.get('http://127.0.0.1:8000/reports/')
      .then(response => setReports(response.data))
      .catch(error => console.error("Error fetching data!", error));
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  
  // Function to trigger the animation
  const handleStatCardClick = () => {
    setHighlightMarkers(true);
    // Reset the animation state after 2 seconds
    setTimeout(() => {
      setHighlightMarkers(false);
    }, 2000);
  };

  const heatmapPoints = reports.map(report => [report.latitude, report.longitude, 1]);

  // Create a dynamic icon that includes the highlight class when needed
  const createPotholeIcon = (isHighlighted) => {
    return new L.DivIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
               <path fill-rule="evenodd" d="M11.484 2.172a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 1 7.877 7.877.75.75 0 0 1 0 1.032A11.209 11.209 0 0 1 12 21.828a11.209 11.209 0 0 1-7.877-7.877.75.75 0 0 1 0-1.032A11.209 11.209 0 0 1 11.484 2.172ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clip-rule="evenodd" />
             </svg>`,
      className: `pothole-marker ${isHighlighted ? 'highlight' : ''}`, // Conditionally add class
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
  };

  return (
    <>
      <SubmissionModal show={isModalOpen} onClose={() => setIsModalOpen(false)} onNewReport={fetchReports} />
      <div className="app-container">
        <div className="sidebar">
          <div className="header"><h1>Roadflow AI</h1><p>Urban Infrastructure Monitor</p></div>
          <button className="new-report-button" onClick={() => setIsModalOpen(true)}>+ Submit New Report</button>
          {/* Pass the handler function to the Dashboard */}
          <Dashboard onStatCardClick={handleStatCardClick} />
          <div className="view-toggle">
            <button className={viewMode === 'markers' ? 'active' : ''} onClick={() => setViewMode('markers')}>Markers</button>
            <button className={viewMode === 'heatmap' ? 'active' : ''} onClick={() => setViewMode('heatmap')}>Heatmap</button>
          </div>
        </div>
        <div className="map-container">
          <MapContainer center={mapCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {viewMode === 'markers' && reports.map(report => (
              <Marker key={report.id} position={[report.latitude, report.longitude]} icon={createPotholeIcon(highlightMarkers)}>
                <Popup>
                  <div className="popup-content">
                    <h4>Report ID: {report.id}</h4>
                    <img src={report.image_filename} alt="Report" style={{width: '100%', borderRadius: '8px', marginBottom: '10px'}} />
                    <p><strong>Potholes Detected:</strong> {report.pothole_count}</p>
                    <p><strong>Avg. Confidence:</strong> {(report.average_confidence * 100).toFixed(1)}%</p>
                    <p><strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className={`status-${report.status}`}>{report.status}</span></p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {viewMode === 'heatmap' && <Heatmap points={heatmapPoints} />}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default App;