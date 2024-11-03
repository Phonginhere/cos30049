// FormInputPrediction.js

import React, { useState } from 'react';

const FormInputPrediction = () => {
  const [iso3, setIso3] = useState('');
  const [exposureMean, setExposureMean] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setFormErrors({});

    const inputData = {
      iso3,
      exposure_mean: exposureMean,
      pollutant,
    };

    try {
      const startTime = performance.now();
      const response = await fetch('http://localhost:8002/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.detail);
        console.error(`Error: ${response.status} - ${response.statusText}`);
      } else {
        const result = await response.json();
        console.log(`Prediction: ${result.prediction.predicted_burden_mean}`);
      }

      console.log(`Response time: ${responseTime.toFixed(4)} ms`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ISO3:</label>
        <input
          type="text"
          value={iso3}
          onChange={(e) => setIso3(e.target.value)}
          className={formErrors.iso3 ? 'input-error' : ''}
        />
        {formErrors.iso3 && <span className="error">{formErrors.iso3}</span>}
      </div>
      <div>
        <label>Exposure Mean:</label>
        <input
          type="text"
          value={exposureMean}
          onChange={(e) => setExposureMean(e.target.value)}
          className={formErrors.exposure_mean ? 'input-error' : ''}
        />
        {formErrors.exposure_mean && (
          <span className="error">{formErrors.exposure_mean}</span>
        )}
      </div>
      <div>
        <label>Pollutant:</label>
        <input
          type="text"
          value={pollutant}
          onChange={(e) => setPollutant(e.target.value)}
          className={formErrors.pollutant ? 'input-error' : ''}
        />
        {formErrors.pollutant && (
          <span className="error">{formErrors.pollutant}</span>
        )}
      </div>
      <button type="submit">Predict</button>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <span key={index} className="error">
              {error}
            </span>
          ))}
        </div>
      )}
    </form>
  );
};

export default FormInputPrediction;