// import React, { useState, useEffect } from 'react';
// import { TextField, Button, MenuItem, Box, Typography, Select, FormControl, InputLabel, Alert } from '@mui/material';
// import axios from 'axios';

// const FormInputPrediction = () => {
//   const [iso3, setIso3] = useState(''); // ISO3 field updated by 'countryClick' event
//   const [exposureMean, setExposureMean] = useState('');
//   const [pollutant, setPollutant] = useState('');
//   const [pollutants, setPollutants] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [formErrors, setFormErrors] = useState({});

//   // Fetch pollutants on component mount
//   useEffect(() => {
//     const fetchPollutants = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/pollutants');
//         setPollutants(response.data.pollutants || []);
//       } catch (error) {
//         console.error('Error fetching pollutants:', error);
//       }
//     };
//     fetchPollutants();
//   }, []);

//   // Event listener for 'countryClick' event
//   useEffect(() => {
//     const handleCountryClick = (event) => {
//       const { iso3 } = event.detail;
//       setIso3(iso3); // Update ISO3 state with country code from event
//     };

//     document.addEventListener('countryClick', handleCountryClick);

//     // Clean up event listener on component unmount
//     return () => {
//       document.removeEventListener('countryClick', handleCountryClick);
//     };
//   }, []);

//   const validateInputs = () => {
//     const errors = {};
//     if (!iso3.trim()) {
//       errors.iso3 = 'ISO3 Code is required.';
//     } else if (!/^[A-Za-z]{3}$/.test(iso3.trim())) {
//       errors.iso3 = 'ISO3 Code must be a 3-letter alphabetic code.';
//     }

//     if (!exposureMean) {
//       errors.exposureMean = 'Exposure Mean is required.';
//     } else if (isNaN(exposureMean) || Number(exposureMean) < 0) {
//       errors.exposureMean = 'Exposure Mean must be a positive number.';
//     }

//     if (!pollutant.trim()) {
//       errors.pollutant = 'Pollutant is required.';
//     }

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateInputs();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     setFormErrors({});
//     setErrors([]);
//     setPrediction(null);
//     try {
//       const response = await axios.post('http://localhost:8000/predict', {
//         iso3,
//         exposure_mean: exposureMean,
//         pollutant,
//       });
//       setPrediction(response.data.prediction.predicted_burden_mean);
//     } catch (error) {
//       console.error('Error:', error);
//       setErrors(['An unexpected error occurred.']);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, border: '1px solid #0E39B4', borderRadius: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Predict Health Burden
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="ISO3 Country Code"
//           value={iso3}
//           disabled
//           fullWidth
//           margin="normal"
//           variant="outlined"
//         />
//         <TextField
//           label="Exposure Mean"
//           type="number"
//           value={exposureMean}
//           onChange={(e) => setExposureMean(e.target.value)}
//           fullWidth
//           margin="normal"
//           variant="outlined"
//           error={!!formErrors.exposureMean}
//           helperText={formErrors.exposureMean}
//         />
//         <FormControl fullWidth margin="normal" variant="outlined">
//           <InputLabel>Pollutant</InputLabel>
//           <Select
//             value={pollutant}
//             onChange={(e) => setPollutant(e.target.value)}
//             label="Pollutant"
//             error={!!formErrors.pollutant}
//           >
//             <MenuItem value="">
//               <em>Select Pollutant</em>
//             </MenuItem>
//             {pollutants.map((pollutant, index) => (
//               <MenuItem key={index} value={pollutant.key}>
//                 {pollutant.display}
//               </MenuItem>
//             ))}
//           </Select>
//           {formErrors.pollutant && (
//             <Typography variant="body2" color="error">
//               {formErrors.pollutant}
//             </Typography>
//           )}
//         </FormControl>
//         <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
//           Predict
//         </Button>
//       </form>
//       {errors.length > 0 && (
//         <Alert severity="error" sx={{ mt: 2 }}>
//           {errors.map((error, index) => (
//             <Typography key={index}>{error}</Typography>
//           ))}
//         </Alert>
//       )}
//       {prediction && (
//         <Alert severity="success" sx={{ mt: 2 }}>
//           Predicted Rate of Year Lost: {prediction}
//         </Alert>
//       )}
//     </Box>
//   );
// };

// export default FormInputPrediction;























import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Select, FormControl, InputLabel, Alert } from '@mui/material';
import axios from 'axios';

const FormInputPrediction = () => {
  const [iso3, setIso3] = useState(''); // ISO3 field updated by 'countryClick' event
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

    const handleCountryClick = (event) => {
      const { iso3 } = event.detail;
      setIso3(iso3); // Update ISO3 state with country code from event
    };
      console.log(iso3);
    document.addEventListener('countryClick', handleCountryClick);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('countryClick', handleCountryClick);
    };
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
      console.log(response.data.prediction.predicted_burden_mean);
      setPrediction(response.data.prediction.predicted_burden_mean);
    } catch (error) {
      console.error('Error:', error);
      setErrors(['An unexpected error occurred.']);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, border: '1px solid #0E39B4', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Predict Health Burden
      </Typography>
      <form onSubmit={handleSubmit}>
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
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Pollutant</InputLabel>
          <Select
            value={pollutant}
            onChange={(e) => setPollutant(e.target.value)}
            label="Pollutant"
            error={!!formErrors.pollutant}
          >
            <MenuItem value="">
              <em>Select Pollutant</em>
            </MenuItem>
            {pollutants.map((pollutant, index) => (
              <MenuItem key={index} value={pollutant.key}>
                {pollutant.display}
              </MenuItem>
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
      </form>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.map((error, index) => (
            <Typography key={index}>{error}</Typography>
          ))}
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


















// import React, { useState, useEffect } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css';

// const FormInputPrediction = ({ iso3 }) => {
//   const [exposureMean, setExposureMean] = useState('');
//   const [pollutant, setPollutant] = useState('');
//   const [pollutants, setPollutants] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [formErrors, setFormErrors] = useState({});

//   useEffect(() => {
//     const fetchPollutants = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/pollutants');
//         const data = await response.json();
//         setPollutants(data.pollutants || []);
//       } catch (error) {
//         console.error('Error fetching pollutants:', error);
//       }
//     };

//     fetchPollutants();
//   }, []);

//   const validateInputs = () => {
//     const errors = {};
//     if (!iso3.trim()) {
//       errors.iso3 = 'ISO3 Code is required.';
//     } else if (!/^[A-Za-z]{3}$/.test(iso3.trim())) {
//       errors.iso3 = 'ISO3 Code must be a 3-letter alphabetic code.';
//     }

//     if (!exposureMean) {
//       errors.exposureMean = 'Exposure Mean is required.';
//     } else if (isNaN(exposureMean) || Number(exposureMean) < 0) {
//       errors.exposureMean = 'Exposure Mean must be a positive number.';
//     }

//     if (!pollutant.trim()) {
//       errors.pollutant = 'Pollutant is required.';
//     }

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateInputs();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     setFormErrors({});
//     setErrors([]); // Reset errors
//     setPrediction(null); // Reset prediction
//     try {
//       const response = await fetch('http://localhost:8000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ iso3, exposure_mean: exposureMean, pollutant }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setPrediction(data.prediction.predicted_burden_mean);
//       } else {
//         setErrors(data.detail);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrors(['An unexpected error occurred.']);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="exposureMean" className="form-label">Exposure Mean</label>
//           <input
//             type="number"
//             className={`form-control ${formErrors.exposureMean ? 'is-invalid' : ''}`}
//             id="exposureMean"
//             placeholder="Exposure Mean"
//             value={exposureMean}
//             onChange={(e) => setExposureMean(e.target.value)}
//           />
//           {formErrors.exposureMean && <div className="invalid-feedback">{formErrors.exposureMean}</div>}
//         </div>
//         <div className="mb-3">
//           <label htmlFor="pollutant" className="form-label">Pollutant</label>
//           <select
//             className={`form-control ${formErrors.pollutant ? 'is-invalid' : ''}`}
//             id="pollutant"
//             value={pollutant}
//             onChange={(e) => setPollutant(e.target.value)}
//           >
//             <option value="">Select Pollutant</option>
//             {pollutants.map((pollutant, index) => (
//               <option key={index} value={pollutant.key}>{pollutant.display}</option>
//             ))}
//           </select>
//           {formErrors.pollutant && <div className="invalid-feedback">{formErrors.pollutant}</div>}
//         </div>
//         <button type="submit" className="btn btn-primary">Predict</button>
//       </form>
//       {errors.length > 0 && (
//         <div className="alert alert-danger mt-3">
//           <ul>
//             {errors.map((err, index) => (
//               <li key={index}>{err}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {prediction && <div className="alert alert-success mt-3">Predicted Rate of Year Lost: {prediction}</div>}
//     </div>
//   );
// };

// export default FormInputPrediction;