import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    iso3: '',
    exposureMean: '',
    pollutant: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError("An error occurred while making the prediction. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Predict Health Burden
      </Typography>
      <TextField
        label="ISO3 Country Code"
        name="iso3"
        value={formData.iso3}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
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
      <TextField
        label="Pollutant"
        name="pollutant"
        value={formData.pollutant}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>

      {prediction && (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Predicted Health Burden: {prediction}
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
  
//     // Adjust form data keys to match the backend expectations
//     const payload = {
//       iso3: formData.iso3.trim(),
//       exposure_mean: parseFloat(formData.exposureMean), // Convert to float if needed
//       pollutant: formData.pollutant.trim(),
//     };
  
//     try {
//       console.log(response.data.predicted_burden_mean);
//       const response = await axios.post('http://localhost:8000/predict', payload);
//       setPrediction(response.data.predicted_burden_mean);
//     } catch (error) {
//       setError("An error occurred while making the prediction. Please try again.");
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
