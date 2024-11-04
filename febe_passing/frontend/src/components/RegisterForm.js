// RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/user', {
        name: formData.name,
        email: formData.email,
        age: formData.age ? Number(formData.age) : undefined,
      });

      setSuccessMessage(response.data.message || 'User registered successfully.');
      setFormData({
        name: '',
        email: '',
        age: '',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data.detail);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span style={{ color: 'red' }}>{errors.name}</span>
          )}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span style={{ color: 'red' }}>{errors.email}</span>
          )}
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && (
            <span style={{ color: 'red' }}>{errors.age}</span>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
