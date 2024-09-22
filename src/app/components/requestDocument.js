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
    // requirement: null, // Placeholder for single file input
  });

  useEffect(() => {
    // Event listener to close modal on Esc key press
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose(); // Close modal if Escape key is pressed
    };
    document.addEventListener('keydown', handleEsc); // Add event listener
    return () => document.removeEventListener('keydown', handleEsc); // Clean up listener on unmount
  }, [onClose]);

  // Return null if modal is not open
  if (!isOpen) return null;

  // Handle changes for text and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target; // Destructure event target properties
    if (name === 'requirement') {
      setFormData(prev => ({
        ...prev,
        [name]: files ? files[0] : null // Handle single file input
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value })); // Update form data for text inputs
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData(); // Create FormData object
    for (const key in formData) {
      if (key === 'requirement' && formData[key]) {
        data.append(key, formData[key]); // Append file if it exists
      } else {
        data.append(key, formData[key]); // Append other form data
      }
    }

    try {
      await onSubmit(data); // Pass FormData to onSubmit prop
      // Reset form data
      setFormData({
        filename: '',
        purpose: '',
        schoolName: '',
        lastAttended: '',
        course: '',
        major: '',
        copies: '1',
        // requirement: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error); // Log any errors during submission
    }
  };

  return (
    <div className="modal"> {/* Modal container */}
      <div className="modal-content"> {/* Modal content */}
        <button className="close" onClick={onClose}>×</button> {/* Close button */}
        <form onSubmit={handleSubmit}> {/* Form submission handler */}
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
          <button type="submit">Submit</button> {/* Submit button */}
        </form>
      </div>
    </div>
  );
};

export default ModalForm; // Export ModalForm component
