import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../hook/Dimensions';
import Choropleth from './choropleth/Choropleth';
import BarChart from './bar_chart/BarCharts';
import BubblePlot from './bubble_chart/BubblePlot';

import './chart_styles.css'

// import { choropleth, scatter_plot, initializeDensityChart, bar_chart } from '../charts'; // Adjust imports to your chart files

// import '../charts/chart_styles.css'; // Import your existing styles if any

const DrawAllCharts = () => {

    useEffect(() => {
        try {
            // Initialization or chart rendering logic here
            console.log("DrawAllCharts Mounted");

        } catch (error) {
            console.error("Error in DrawAllCharts:", error);
        }

    }, []); // Only run once on component mount

    return (
        <div className="charts">
            {/* <Choropleth/> */}
            {/* <div id="choropleth"> */}
                <Choropleth/>
            {/* </div>  */}

            <div id="right-container">
                <button id="chart-btn" onClick={() => <BubblePlot/>}>Bubble Chart</button>
                {/* <button id="chart-btn" onClick={() => initializeDensityChart()}>Distribution</button> */}
                {/* <button id="chart-btn" onClick={() => <Choropleth/>}>Distribution</button> */}
                <button id="chart-btn" onClick={() => <BarChart/>}>Bar Chart</button>
            </div>
            
            <BarChart/>
        </div>
    );
};

export default DrawAllCharts;
