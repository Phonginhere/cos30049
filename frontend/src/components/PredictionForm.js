import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const PredictionForm = ({ setPredictionData }) => {
  const [formData, setFormData] = useState({
    iso3: '',
    exposureMean: '',
    pollutant: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [pollutants, setPollutants] = useState([]);

  // Fetch pollutant options (or define them statically)
  useEffect(() => {
    setPollutants([
      { key: 'pm25', display: 'Particulate Matter 2.5' },
      { key: 'ozone', display: 'Ozone' },
      // { key: 'no2', display: 'Nitrogen Dioxide' },
      { key: 'hap', display: 'Hazardous Air Pollutants' },
      // Add more pollutants as needed
    ]);

    // Set up the countryClick event listener to update the iso3 field
    const handleCountryClick = (event) => {
      const { code } = event.detail; // Extract the country code from the event
      setFormData((prevFormData) => ({
        ...prevFormData,
        iso3: code, // Update the ISO3 field with the clicked country code
      }));
    };

    document.addEventListener('countryClick', handleCountryClick);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('countryClick', handleCountryClick);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      iso3: formData.iso3.trim(),
      exposure_mean: parseFloat(formData.exposureMean),
      pollutant: formData.pollutant.trim(),
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', payload);
      setPrediction(response.data.predicted_burden_mean);
      setPredictionData({
        iso3: formData.iso3,
        input_exposure_mean: formData.exposureMean,
        input_pollutant: formData.pollutant,
        predicted_burden_mean: response.data.predicted_burden_mean,
      });
    } catch (error) {
      setError(error.response?.data?.detail || "Please choose the country on Choropleth map");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Predict Health Burden
      </Typography>

      {/* Exposure Mean Input */}
      <TextField
        label="Exposure Mean"
        name="exposureMean"
        value={formData.exposureMean}
        onChange={handleChange}
        type="number"
        fullWidth
        margin="normal"
        required
      />

      {/* Pollutant Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Pollutant</InputLabel>
        <Select
          label="Pollutant"
          name="pollutant"
          value={formData.pollutant}
          onChange={handleChange}
          required
        >
          {pollutants.map((pollutant) => (
            <MenuItem key={pollutant.key} value={pollutant.key}>
              {pollutant.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>

      {prediction && (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Predicted Health Burden for {formData.iso3}: {prediction}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PredictionForm;
