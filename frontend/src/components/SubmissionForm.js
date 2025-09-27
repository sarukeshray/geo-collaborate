// frontend/src/components/SubmissionForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './SubmissionForm.css';

function SubmissionForm({ onNewReport }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setMessage('Getting your location...');

    // 1. Get User's Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMessage('Location found. Uploading report...');
        const { latitude, longitude } = position.coords;

        // 2. Prepare data for API
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lat', latitude);
        formData.append('lon', longitude);

        const apiUrl = 'http://127.0.0.1:8000/reports/';

        // 3. Send data to backend
        axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          setMessage('Report submitted successfully!');
          setSelectedFile(null); // Clear the file input
          onNewReport(); // Tell the map to refresh
        })
        .catch(error => {
          console.error('Error submitting report:', error);
          setMessage('Error submitting report. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setMessage('Could not get your location. Please enable location services.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h3>Submit a New Report</h3>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
      {message && (
        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default SubmissionForm;