import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormInputPrediction = ({ iso3 }) => {
  const [exposureMean, setExposureMean] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [pollutants, setPollutants] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPollutants = async () => {
      try {
        const response = await fetch('http://localhost:8002/pollutants');
        const data = await response.json();
        setPollutants(data.pollutants || []);
      } catch (error) {
        console.error('Error fetching pollutants:', error);
      }
    };

    fetchPollutants();
  }, []);

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
      const response = await fetch('http://localhost:8002/predict', {
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
          <select
            className={`form-control ${formErrors.pollutant ? 'is-invalid' : ''}`}
            id="pollutant"
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value)}
          >
            <option value="">Select Pollutant</option>
            {pollutants.map((pollutant, index) => (
              <option key={index} value={pollutant.key}>{pollutant.display}</option>
            ))}
          </select>
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