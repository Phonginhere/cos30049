import React, { useEffect, useState } from 'react';
import Choropleth from './choropleth/Choropleth';
import BarChart from './bar_chart/BarCharts';
import BubblePlot from './bubble_chart/BubblePlot';
import FormInputPrediction from '../FormInputPrediction'; // Import the FormInputPrediction component
import './chart_styles.css';

const DrawAllCharts = () => {
    const [selectedChart, setSelectedChart] = useState('bubble'); // State to control which chart to display

    useEffect(() => {
        try {
            console.log("DrawAllCharts Mounted");
        } catch (error) {
            console.error("Error in DrawAllCharts:", error);
        }
    }, []);
    
    const handleBubblePlotClick = () => {
        setSelectedChart('bubble');
    };
    
    const handleBarChartClick = () => {
        setSelectedChart('bar');
    };
    
    return (
        <div className="charts">
            {/* Display Choropleth chart by default */}
            <Choropleth />
    
            <div id="right-container">
                <button id="chart-btn" onClick={handleBubblePlotClick}>Bubble Chart</button>
                <button id="chart-btn" onClick={handleBarChartClick}>Bar Chart</button>
                {selectedChart === 'bubble' && (<BubblePlot /> )}
                {selectedChart === 'bar' && <BarChart />}
                {/* User input form */}
                <FormInputPrediction />
            </div>
        </div>
    );
};

export default DrawAllCharts;