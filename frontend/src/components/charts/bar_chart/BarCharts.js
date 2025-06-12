// Import necessary libraries and components
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../chart_styles.css'    // Import your existing styles if any

// Data will be loaded from Hugging Face dataset instead of being imported

const BarChart = () => {
    // Remove any existing SVG elements from previous renders
    d3.select("#plot").remove();
    d3.select("#barchart").remove();

    // Reference to the container for the plot
    const svgRef = useRef();

    // IBM Design Library Colors
    const ibmColors = [
        "#3ddbd9", // Teal 50
        "#6929c4", // Purple 60
        "#1192e8", // Cyan 60
        "#005d5d", // Teal 80
        "#fa4d56", // Red 50
        "#9f1853", // Magenta 70
        "#198038", // Green 70
        "#002d9c"  // Blue 80
    ];

    // Define color scale using IBM colors
    const colorScale = d3.scaleOrdinal()
        .range(ibmColors);

    // Configuration for the plot dimensions and styling
    var cfg = {
        w: window.innerWidth*0.4,
        h: window.innerWidth*0.2,
        h2: (window.innerHeight*0.86),
        padding: window.innerWidth*0.04,
        radius: window.innerWidth*0.4*0.0066666,
        border: 1,
        fontSize: window.innerWidth*0.43/700 //rem
    };

    useEffect(() => {
        // Function to create bar chart section
        function createBarSection(){
            d3.select("#right-container")
                .append("div")  
                .attr("id", "barchart");
        }

        // Function to create pollutant option dropdown
        function createPollutantOption(){
            var plotOptionDiv = d3.select('#barchart')
                .append("div")
                .attr("id", "barchart-option");
        
            plotOptionDiv.append("label")
                .attr("for", "pollutant_option")
                .text("Pollutant Option: ");
        
            var pollutantSelect = plotOptionDiv.append("select")
                .attr("id", "pollutant_option")
                .attr("name", "pollutant_option");
            
            pollutantSelect.append("option")
                .attr("value", "pm25")
                .text("PM25");
        
            pollutantSelect.append("option")
                .attr("value", "no2")
                .text("NO2");
        
            pollutantSelect.append("option")
                .attr("value", "ozone")
                .text("Ozone");
        
            pollutantSelect.append("option")
                .attr("value", "hap")
                .text("Hazardous Air Pollutants");
        }

        // Main chart drawing function
        function draw_chart(init_data) {
            // Create the barchart HTML objects and axis options on component mount
            createBarSection();
            createPollutantOption();

            console.log("Bar chart initialized with Hugging Face dataset");
            // Chart implementation would go here...
            // For now, just display a placeholder
            d3.select('#barchart')
                .append('div')
                .style('padding', '20px')
                .style('text-align', 'center')
                .html(`
                    <h3>Bar Chart</h3>
                    <p>Loading data from Hugging Face dataset...</p>
                    <p>Dataset: cos30049-safetywindy/air_quality_health</p>
                `);
        }
        
        // Load data from Hugging Face dataset
        d3.csv('https://huggingface.co/datasets/cos30049-safetywindy/air_quality_health/resolve/main/air_quality_health.csv').then(data => {
            console.log("Data loaded from Hugging Face:", data.length, "rows");
            data = data.filter(function(d) {return d.Cause_Name !== 'All causes'});
            draw_chart(data); // Call function to draw the chart
        }).catch(error => {
            console.error("Error loading data from Hugging Face:", error);
            // Fallback display
            createBarSection();
            d3.select('#barchart')
                .append('div')
                .style('padding', '20px')
                .style('text-align', 'center')
                .style('color', 'red')
                .html(`
                    <h3>Bar Chart</h3>
                    <p>Error loading data from Hugging Face dataset</p>
                    <p>Please check network connection</p>
                `);
        });
        
    }, []); // Only run once on component mount

    return <div ref={svgRef}></div>;

}; 

export default BarChart;
