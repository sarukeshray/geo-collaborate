// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';
import SubmissionForm from './components/SubmissionForm';
import Dashboard from './components/Dashboard';
import Heatmap from './components/Heatmap'; // Import our new custom component

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  const mapCenter = [20.5937, 78.9629];
  const [reports, setReports] = useState([]);
  const [viewMode, setViewMode] = useState('markers'); // 'markers' or 'heatmap'

  const fetchReports = useCallback(() => {
    const apiUrl = 'http://127.0.0.1:8000/reports/';
    axios.get(apiUrl)
      .then(response => {
        setReports(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Prepare data for our custom Heatmap component: [lat, lng, intensity]
  const heatmapPoints = reports.map(report => [report.latitude, report.longitude, 1]);

  return (
    <div className="app-container">
      <header className="header">
        GeoCollaborate - Urban Infrastructure Monitor
      </header>
      
      <Dashboard />
      <SubmissionForm onNewReport={fetchReports} />

      <div className="view-toggle">
        <button
          className={viewMode === 'markers' ? 'active' : ''}
          onClick={() => setViewMode('markers')}
        >
          Markers
        </button>
        <button
          className={viewMode === 'heatmap' ? 'active' : ''}
          onClick={() => setViewMode('heatmap')}
        >
          Heatmap
        </button>
      </div>

      <MapContainer center={mapCenter} zoom={5} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {viewMode === 'markers' && reports.map(report => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
                <div>
                    <h4>Report ID: {report.id}</h4>
                    <p><strong>Potholes Detected:</strong> {report.pothole_count}</p>
                    <p><strong>Avg. Confidence:</strong> {report.average_confidence.toFixed(2)}</p>
                    <p><strong>Status:</strong> {report.status}</p>
                    <img src={report.image_filename} alt="Report" style={{width: '100%'}} />
                </div>
            </Popup>
          </Marker>
        ))}

        {viewMode === 'heatmap' && <Heatmap points={heatmapPoints} />}
      </MapContainer>
    </div>
  );
}

export default App;