// frontend/src/components/SubmissionModal.js
import React from 'react';
import SubmissionForm from './SubmissionForm';
import './SubmissionModal.css';

function SubmissionModal({ show, onClose, onNewReport }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <SubmissionForm onNewReport={onNewReport} closeModal={onClose} />
      </div>
    </div>
  );
}

export default SubmissionModal;