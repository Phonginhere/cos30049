import React, { useEffect, useState } from 'react';
import Choropleth from './choropleth/Choropleth';
import BarChart from './bar_chart/BarCharts';
import BubblePlot from './bubble_chart/BubblePlot';
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
                {selectedChart === 'bubble' && <BubblePlot />}
                {selectedChart === 'bar' && <BarChart />}
            </div>

        </div>
        {(<div className="country-form-overlay">
            <div className="country-form-container">
                <button className="close-button" onClick={handleFormClose}>×</button>
                <h2>Details for {formState.country} #{formState.code}</h2>
               <FormInputPrediction country={formState.country} iso3={formState.code}/>
            </div>
        </div>)}
    );
};

export default DrawAllCharts;
