import React, { useState, useEffect } from 'react';

const ModalForm = ({ isOpen, onClose, onSubmit }) => {
  // Initialize form data with default values
  const [formData, setFormData] = useState({
    filename: '',
    purpose: '',
    schoolName: '',
    lastAttended: '',
    course: '',
    major: '',
    copies: '1',
    //requirement: null, // Single file
  });

  useEffect(() => {
    // Event listener to close modal on Esc key press
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // Handle changes for text and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'requirement') {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : null // Handle a single file
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === 'requirement' && formData[key]) {
        data.append(key, formData[key]); // Append the single file
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await onSubmit(data); // Pass FormData to onSubmit
      // Reset form data
      setFormData({
        filename: '',
        purpose: '',
        schoolName: '',
        lastAttended: '',
        course: '',
        major: '',
        copies: '1',
    //    requirement: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <label>
            Filename:
            <input
              type="text"
              name="filename"
              value={formData.filename}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Purpose:
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            School Name:
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last Attended:
            <input
              type="text"
              name="lastAttended"
              value={formData.lastAttended}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Course:
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Major:
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Number of Copies:
            <input
              type="number"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
              min="1"
              required
            />
          </label>
          {/* <label>
            Upload Requirement:
            <input
              type="file"
              name="requirement" // Single file input
              onChange={handleChange}
              required
            />
          </label> */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
