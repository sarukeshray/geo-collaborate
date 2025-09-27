// frontend/src/components/SubmissionForm.js
import React, { useState } from 'react';
import axios from 'axios';

// This is now just the form's logic, to be placed inside the modal
function SubmissionForm({ onNewReport, closeModal }) {
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMessage('Location found. Uploading report...');
        const { latitude, longitude } = position.coords;
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lat', latitude);
        formData.append('lon', longitude);

        axios.post('http://127.0.0.1:8000/reports/', formData)
        .then(response => {
          setMessage('Report submitted successfully!');
          onNewReport(); // Tell the map to refresh
          setTimeout(() => closeModal(), 1500); // Close modal after success
        })
        .catch(error => {
          console.error('Error submitting report:', error);
          setMessage('Error submitting report. Please try again.');
          setIsLoading(false);
        });
      },
      (error) => {
        setMessage('Could not get your location. Please enable location services.');
        setIsLoading(false);
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit a New Report</h3>
      <p>Select an image and we'll automatically detect your location.</p>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
      <div>
        <button type="button" className="cancel" onClick={closeModal} disabled={isLoading}>Cancel</button>
        <button type="submit" disabled={isLoading || !selectedFile}>
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}

export default SubmissionForm;