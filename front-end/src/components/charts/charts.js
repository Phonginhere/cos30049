import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../hook/Dimensions';
import Choropleth from './choropleth/Choropleth';

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

            {/* <div id="right-container"> Right-side Buttons */}
                {/* <button id="chart-btn" onClick={() => scatter_plot()}>Bubble Chart</button> */}
                {/* <button id="chart-btn" onClick={() => initializeDensityChart()}>Distribution</button> */}
                {/* <button id="chart-btn" onClick={() => bar_chart()}>Bar Chart</button> */}
            {/* </div> */}
        </div>
    );
};

export default DrawAllCharts;