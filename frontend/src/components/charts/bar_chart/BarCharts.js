// Import necessary libraries and components
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../chart_styles.css'    // Import your existing styles if any

// Add inline styles for the bar chart
const barChartStyles = `
#barchart {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    min-height: 400px;
}

#barchart svg {
    display: block;
    margin: 0 auto;
}

.bar {
    cursor: pointer;
    transition: opacity 0.2s;
}

.bar:hover {
    opacity: 1 !important;
    stroke: #000;
    stroke-width: 2px;
}

.axis text {
    font-size: 12px;
    font-family: Arial, sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #333;
    shape-rendering: crispEdges;
}
`;

// Inject styles
if (!document.getElementById('bar-chart-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'bar-chart-styles';
    styleSheet.textContent = barChartStyles;
    document.head.appendChild(styleSheet);
}

// Data will be loaded from Hugging Face dataset instead of being imported

const BarChart = () => {
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
        // Initialize chart state variables
        let chartData = null;
        let currentYear = "2020";
        let currentCountry = "USA";
        let currentPollutant = "pm25";
        
        // Function to create bar chart section
        function createBarSection(){
            // Only create if it doesn't already exist
            if (d3.select("#barchart").empty()) {
                d3.select("#right-container")
                    .append("div")  
                    .attr("id", "barchart");
            }
        }

        // Function to create pollutant option dropdown
        function createPollutantOption(){
            // Only create if it doesn't already exist
            if (d3.select("#barchart-option").empty()) {
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
        }

        // Function to update chart with new parameters
        function updateChart(year, country, pollutant) {
            if (!chartData) return;
            
            console.log("Updating bar chart:", { year, country, pollutant });
            
            // Update current state
            currentYear = year;
            currentCountry = country;
            currentPollutant = pollutant;
            
            // Clear only the SVG container, not the entire barchart div
            d3.select('#barchart-container').remove();
            
            // Update the pollutant dropdown to reflect current selection
            d3.select("#pollutant_option").property("value", pollutant);
            
            // Filter data for the specified parameters
            let dataToFilter = chartData.filter(d => 
                d.ISO3 === country && 
                d.Year === year && 
                d.Pollutant === pollutant
            );
            
            // If no data found, try with different fallback strategies
            if (dataToFilter.length === 0) {
                console.log(`No data for ${country} in ${year} with ${pollutant}`);
                
                // Try any available year for this country and pollutant
                const availableYears = [...new Set(chartData.filter(d => 
                    d.ISO3 === country && d.Pollutant === pollutant
                ).map(d => d.Year))];
                
                if (availableYears.length > 0) {
                    const useYear = availableYears[0];
                    dataToFilter = chartData.filter(d => 
                        d.ISO3 === country && 
                        d.Year === useYear && 
                        d.Pollutant === pollutant
                    );
                    console.log(`Using year ${useYear} instead of ${year}`);
                }
            }
            
            // If still no data, try the default country (USA)
            if (dataToFilter.length === 0 && country !== 'USA') {
                console.log(`No data for ${country}, trying USA`);
                dataToFilter = chartData.filter(d => 
                    d.ISO3 === 'USA' && 
                    d.Year === year && 
                    d.Pollutant === pollutant
                );
            }
            
            // If still no data, show message in a temporary div
            if (dataToFilter.length === 0) {
                // Remove any existing no-data message
                d3.select('#barchart .no-data-message').remove();
                
                d3.select('#barchart')
                    .append('div')
                    .attr('class', 'no-data-message')
                    .style('padding', '20px')
                    .style('text-align', 'center')
                    .html(`
                        <h3>Bar Chart</h3>
                        <p>No data available for ${country} in ${year} with ${pollutant}</p>
                        <p>Try selecting a different country from the map</p>
                    `);
                return;
            }
            
            // Remove any existing no-data message before drawing chart
            d3.select('#barchart .no-data-message').remove();
            
            drawBarChart(dataToFilter, year, country, pollutant);
        }

        // Main chart drawing function
        function drawBarChart(data, year, country, pollutant) {
            console.log("Drawing bar chart with data:", data.length, "rows");

            // Create scales
            const xScale = d3.scaleBand();
            const yScale = d3.scaleLinear();

            // Create the SVG container for the bar chart
            var container = d3.select('#barchart')
                                .append('svg')
                                .attr('id', 'barchart-container')
                                .attr("width", cfg.w + 2 * cfg.padding)
                                .attr("height", cfg.h + 2 * cfg.padding);

            // Configure scales
            xScale
                .range([cfg.padding, cfg.w - cfg.padding])
                .domain(data.map(d => d.Cause_Name))
                .padding(0.2);

            const maxValue = d3.max(data, d => +d['Burden Mean']);
            yScale
                .domain([0, maxValue])
                .range([cfg.h, cfg.padding]);

            // Create axes
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            // Add axes to SVG
            container.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${cfg.h})`)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-25)")
                .style("text-anchor", "end");

            container.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${cfg.padding}, 0)`)
                .call(yAxis);

            // Add bars with better styling
            container.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.Cause_Name))
                .attr("y", d => yScale(+d['Burden Mean']))
                .attr("width", xScale.bandwidth())
                .attr("height", d => cfg.h - yScale(+d['Burden Mean']))
                .attr("fill", (d, i) => colorScale(d.Cause_Name))
                .attr("stroke", "#333")
                .attr("stroke-width", 1)
                .style("opacity", 0.8);

            // Add title
            container.append("text")
                .attr("x", (cfg.w + cfg.padding * 2) / 2)
                .attr("y", cfg.padding / 2)
                .attr("text-anchor", "middle")
                .style("font-size", `${1.2 * cfg.fontSize}rem`)
                .text(`Air Quality Health Impact - ${pollutant.toUpperCase()} - ${country} (${year})`);

            // Add axis labels
            container.append("text")
                .attr("text-anchor", "middle")
                .attr("x", cfg.w / 2)
                .attr("y", cfg.h + cfg.padding * 1.8)
                .text("Health Impact Causes")
                .style("font-size", `${cfg.fontSize}rem`);

            container.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(cfg.h / 2))
                .attr("y", cfg.padding / 2)
                .text("Burden Mean (DALYs)")
                .style("font-size", `${cfg.fontSize}rem`);

            console.log("Bar chart rendered successfully!");
        }

        // Initial chart drawing function
        function draw_chart(init_data) {
            chartData = init_data; // Store data for updates
            
            // Only clear if barchart doesn't exist, otherwise preserve it
            if (d3.select('#barchart').empty()) {
                // Create the barchart HTML objects and axis options on component mount
                createBarSection();
                createPollutantOption();
            } else {
                // Clear only the SVG container if it exists
                d3.select('#barchart-container').remove();
                d3.select('#barchart .no-data-message').remove();
            }

            console.log("Bar chart initialized with Hugging Face dataset");
            console.log("Data received:", init_data.length, "rows");

            // Check available countries and data structure
            console.log("Sample data row:", init_data[0]);
            const availableCountries = [...new Set(init_data.map(d => d.ISO3))];
            console.log("Available countries:", availableCountries.slice(0, 10)); // Show first 10 countries
            
            // Filter initial data for default country and pollutant
            let country = currentCountry; // Use current country
            
            // If USA not available, use the first available country
            if (!availableCountries.includes(country)) {
                country = availableCountries[0];
                currentCountry = country; // Update current country
                console.log("Using first available country:", country);
            }

            // Filter data for initial display
            let initialData = init_data.filter(d => 
                d.ISO3 === country && 
                d.Year === currentYear && 
                d.Pollutant === currentPollutant
            );

            // If no data for current year, try any available year for this country
            if (initialData.length === 0) {
                const availableYears = [...new Set(init_data.filter(d => d.ISO3 === country).map(d => d.Year))];
                if (availableYears.length > 0) {
                    const useYear = availableYears[0];
                    currentYear = useYear; // Update current year
                    initialData = init_data.filter(d => 
                        d.ISO3 === country && 
                        d.Year === useYear && 
                        d.Pollutant === currentPollutant
                    );
                    console.log(`No data for ${currentYear}, using year ${useYear}`);
                }
            }

            console.log("Filtered data for", country, ":", initialData.length, "rows");

            if (initialData.length === 0) {
                // If still no data, try without pollutant filter
                initialData = init_data.filter(d => d.ISO3 === country).slice(0, 20); // Take first 20 rows
                console.log("Using any available data for country:", initialData.length, "rows");
            }

            if (initialData.length === 0) {
                // Show message if no data found
                d3.select('#barchart')
                    .append('div')
                    .style('padding', '20px')
                    .style('text-align', 'center')
                    .html(`
                        <h3>Bar Chart</h3>
                        <p>No data available in the dataset</p>
                        <p>Please check the data source</p>
                    `);
                return;
            }

            // Draw the initial chart
            drawBarChart(initialData, currentYear, currentCountry, currentPollutant);
            
            // Add event listeners after chart is created
            setupEventListeners();
        }
        
        // Function to setup event listeners
        function setupEventListeners() {
            // Get slider element
            const slider = document.getElementById('yearSlider');
            if (slider) {
                slider.addEventListener('input', function() {
                    console.log("Year slider changed to:", slider.value);
                    updateChart(slider.value, currentCountry, currentPollutant);
                });
            }
            
            // Get pollutant dropdown
            const pollutantOption = document.getElementById('pollutant_option');
            if (pollutantOption) {
                pollutantOption.addEventListener('change', function() {
                    console.log("Pollutant changed to:", pollutantOption.value);
                    updateChart(currentYear, currentCountry, pollutantOption.value);
                });
            }
            
            // Listen for country clicks from choropleth
            document.addEventListener('countryClick', function(event) {
                const { code, country, year } = event.detail;
                console.log("Bar chart received country click event:", { country, code, year });
                console.log("Current chart state before update:", { currentYear, currentCountry, currentPollutant });
                
                // Update the chart with the clicked country
                updateChart(currentYear, code, currentPollutant);
                
                console.log("Bar chart updated with new country:", code);
            });
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
