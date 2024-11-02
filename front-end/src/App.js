import React, { useState } from 'react';
import axios from 'axios';
import BmiChart from './components/BmiChart';
// import BarChart from './components/charts/BarChart';

function App() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [prediction, setPrediction] = useState('');
    const [bmiData, setBmiData] = useState([]); // To store numeric data for chart

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send height and weight to FastAPI for prediction
            const response = await axios.post('http://localhost:8000/predict', {
                height: parseFloat(height),
                weight: parseFloat(weight),
            });
            const result = response.data.prediction;
            setPrediction(result);

            // Add some sample numeric data based on prediction
            const newData = [...bmiData, result === "underweight" ? 1 : result === "normal" ? 2 : 3];
            setBmiData(newData);
            
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h1>BMI Predictor</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Height (cm):
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </label>
                <label>
                    Weight (kg):
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            <div>
                <h2>Prediction Result:</h2>
                <p>{prediction ? prediction : "No result yet"}</p>
            </div>

            <div>
                <h2>BMI Data Visualization</h2>
                <BmiChart data={bmiData} />
            </div>
        </div>
    );
}

export default App;
