// FormInputPrediction.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FormInputPrediction.css';

const FormInputPrediction = () => {
  const [iso3, setIso3] = useState('');
  const [exposureMean, setExposureMean] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const validateInputs = () => {
    const errors = {};
    if (!iso3.trim()) {
      errors.iso3 = 'ISO3 Code is required.';
    } else if (!/^[A-Za-z]{3}$/.test(iso3.trim())) {
      errors.iso3 = 'ISO3 Code must be a 3-letter alphabetic code.';
    }

    if (!exposureMean) {
      errors.exposureMean = 'Exposure Mean is required.';
    } else if (isNaN(exposureMean) || Number(exposureMean) < 0) {
      errors.exposureMean = 'Exposure Mean must be a positive number.';
    }

    if (!pollutant.trim()) {
      errors.pollutant = 'Pollutant is required.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setErrors([]); // Reset errors
    setPrediction(null); // Reset prediction
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iso3, exposure_mean: exposureMean, pollutant }),
      });
      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction.predicted_burden_mean);
      } else {
        setErrors(data.detail);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(['An unexpected error occurred.']);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="iso3" className="form-label">ISO3 Code</label>
          <input
            type="text"
            className={`form-control ${formErrors.iso3 ? 'is-invalid' : ''}`}
            id="iso3"
            placeholder="ISO3 Code"
            value={iso3}
            onChange={(e) => setIso3(e.target.value)}
          />
          {formErrors.iso3 && <div className="invalid-feedback">{formErrors.iso3}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="exposureMean" className="form-label">Exposure Mean</label>
          <input
            type="number"
            className={`form-control ${formErrors.exposureMean ? 'is-invalid' : ''}`}
            id="exposureMean"
            placeholder="Exposure Mean"
            value={exposureMean}
            onChange={(e) => setExposureMean(e.target.value)}
          />
          {formErrors.exposureMean && <div className="invalid-feedback">{formErrors.exposureMean}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="pollutant" className="form-label">Pollutant</label>
          <input
            type="text"
            className={`form-control ${formErrors.pollutant ? 'is-invalid' : ''}`}
            id="pollutant"
            placeholder="Pollutant"
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value)}
          />
          {formErrors.pollutant && <div className="invalid-feedback">{formErrors.pollutant}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Predict</button>
      </form>
      {errors.length > 0 && (
        <div className="alert alert-danger mt-3">
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {prediction && <div className="alert alert-success mt-3">Predicted Rate of Year Lost: {prediction}</div>}
    </div>
  );
};

export default FormInputPrediction;
