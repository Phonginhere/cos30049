import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Choropleth from './choropleth/Choropleth';
import BarChart from './bar_chart/BarCharts';
import BubblePlot from './bubble_chart/BubblePlot';
import PredictionForm from '../PredictionForm';
import './chart_styles.css';

const DrawAllCharts = () => {
    const [selectedChart, setSelectedChart] = useState('bubble'); // State to control which chart to display
    const [predictionData, setPredictionData] = useState(null); // State to hold prediction data
    useEffect(() => {
        try {
            
            console.log("DrawAllCharts Mounted");
        } catch (error) {
            console.error("Error in DrawAllCharts:", error);
        }
    }, []);

    const handleBubblePlotClick = () => {
        // Clean up bar chart elements before showing bubble plot
        d3.select("#barchart").remove();
        d3.select("#barchart-container").remove();
        d3.select("#barchart-option").remove();
        setSelectedChart('bubble');
    };

    const handleBarChartClick = () => {
        // Clean up bubble plot elements before showing bar chart
        d3.select("#plot").remove();
        d3.select("#plot-container").remove();
        d3.select("#plot-svg").remove();
        d3.select("#plot-option").remove();
        d3.select("#predict").remove();
        setSelectedChart('bar');
    };

    return (
        <div>
            <div>
                <PredictionForm setPredictionData={setPredictionData}/>
            </div>

            <div className="charts">
            {/* Display Choropleth chart by default */}
            <Choropleth />            <div id="right-container">


                <div>
                    <button id="chart-btn" onClick={handleBubblePlotClick}>Bubble Chart</button>
                    <button id="chart-btn" onClick={handleBarChartClick}>Bar Chart</button>
                    {selectedChart === 'bubble' && <BubblePlot predictionData={predictionData}/>}
                    {selectedChart === 'bar' && <BarChart />}
                </div>
                

                
            </div>
        </div>
        
            

        </div>
    );
};

export default DrawAllCharts;
