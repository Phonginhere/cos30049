// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography } from '@mui/material';
// import axios from 'axios';

// const PredictionForm = () => {
//   const [formData, setFormData] = useState({
//     iso3: '',
//     exposureMean: '',
//     pollutant: '',
//   });
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const payload = {
//       iso3: formData.iso3.trim(),
//       exposure_mean: parseFloat(formData.exposureMean),
//       pollutant: formData.pollutant.trim(),
//     };

//     try {
//       const response = await axios.post('http://localhost:8000/predict', payload);
//       setPrediction(response.data.predicted_burden_mean);
//     } catch (error) {
//      if (error.response && error.response.data && error.response.data.detail) {
//             // If backend error message is provided, show it
//             setError(error.response.data.detail);
//         } else if (error.message) {
//             // General error message
//             setError(error.message);
//         } else {
//             setError("An unknown error occurred.");
//         }
//       // setError("An error occurred while making the prediction. Please try again.");
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Predict Health Burden
//       </Typography>
//       <TextField
//         label="ISO3 Country Code"
//         name="iso3"
//         value={formData.iso3}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//         required
//       />
//       <TextField
//         label="Exposure Mean"
//         name="exposureMean"
//         value={formData.exposureMean}
//         onChange={handleChange}
//         type="number"
//         fullWidth
//         margin="normal"
//         required
//       />
//       <TextField
//         label="Pollutant"
//         name="pollutant"
//         value={formData.pollutant}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//         required
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//         Submit
//       </Button>

//       {prediction && (
//         <Typography variant="body1" sx={{ mt: 3 }}>
//           Predicted Health Burden: {prediction}
//         </Typography>
//       )}

//       {error && (
//         <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//           {error}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default PredictionForm;





















// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography } from '@mui/material';
// import axios from 'axios';

// const PredictionForm = ({ setPredictionData }) => {
//   const [formData, setFormData] = useState({
//     iso3: '',
//     exposureMean: '',
//     pollutant: '',
//   });
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const payload = {
//       iso3: formData.iso3.trim(),
//       exposure_mean: parseFloat(formData.exposureMean),
//       pollutant: formData.pollutant.trim(),
//     };

//     try {
//       const response = await axios.post('http://localhost:8000/predict', payload);
//       setPrediction(response.data.predicted_burden_mean);
//       setPredictionData({ 
//         iso3: formData.iso3,
//         input_exposure_mean: formData.exposureMean,
//         input_pollutant: formData.pollutant,
//         predicted_burden_mean: response.data.predicted_burden_mean 
//       }); // Update parent state with prediction data
//     } catch (error) {
//       setError(error.response?.data?.detail || "An error occurred while making the prediction. Please try again.");
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Predict Health Burden
//       </Typography>
//       <TextField
//         label="ISO3 Country Code"
//         name="iso3"
//         value={formData.iso3}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//         required
//       />
//       <TextField
//         label="Exposure Mean"
//         name="exposureMean"
//         value={formData.exposureMean}
//         onChange={handleChange}
//         type="number"
//         fullWidth
//         margin="normal"
//         required
//       />
//       <TextField
//         label="Pollutant"
//         name="pollutant"
//         value={formData.pollutant}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//         required
//       />
//       <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//         Submit
//       </Button>

//       {prediction  && (
//         <Typography variant="body1" sx={{ mt: 3 }}>
//           Predicted Health Burden: {prediction }
//         </Typography>
//       )}

//       {error && (
//         <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//           {error}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default PredictionForm;














































import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Select, FormControl, InputLabel, Alert } from '@mui/material';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:8000/pollutants');
        setPollutants(response.data.pollutants || []);
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
    setErrors([]);
    setPrediction(null);
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        iso3,
        exposure_mean: exposureMean,
        pollutant,
      });
      if (response.status === 200) {
        setPrediction(response.data.predicted_burden_mean);
      } else {
        setErrors([response.data.detail]);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(['An unexpected error occurred.']);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Predict Health Burden
      </Typography>
      <TextField
        label="ISO3 Country Code"
        value={iso3}
        disabled
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Exposure Mean"
        type="number"
        value={exposureMean}
        onChange={(e) => setExposureMean(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        error={!!formErrors.exposureMean}
        helperText={formErrors.exposureMean}
      />
      <FormControl fullWidth margin="normal" variant="outlined" error={!!formErrors.pollutant}>
        <InputLabel>Pollutant</InputLabel>
        <Select
          value={pollutant}
          onChange={(e) => setPollutant(e.target.value)}
          label="Pollutant"
        >
          <MenuItem value="">
            <em>Select Pollutant</em>
          </MenuItem>
          {pollutants.map((poll, index) => (
            <MenuItem key={index} value={poll.key}>{poll.display}</MenuItem>
          ))}
        </Select>
        {formErrors.pollutant && (
          <Typography variant="body2" color="error">
            {formErrors.pollutant}
          </Typography>
        )}
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Predict
      </Button>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}
      {prediction && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Predicted Rate of Year Lost: {prediction}
        </Alert>
      )}
    </Box>
  );
};

export default FormInputPrediction;
