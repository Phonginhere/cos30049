import React, { useState } from 'react';
import axios from 'axios';
import BmiChart from './components/BmiChart';
import Slider from './components/hook/Slider/Slider';
// import BarChart from './components/charts/BarChart';
import DrawAllCharts from './components/charts/charts';
import Choropleth from './components/charts/choropleth/Choropleth';

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


            <div>
                <DrawAllCharts/>
            </div>

            <div>
                <Slider/>
            </div>

        </div>
    );
}

export default App;
