
// Import necessary libraries and components
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../chart_styles.css'    // Import your existing styles if any

// Data will be loaded from Hugging Face dataset instead of being imported


const BarChart = () => {

// Data will be loaded from public directory instead of being imported


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
        function draw_chart(init_data) {
            // Create the barchart HTML objects and axis options on component mount
            createBarSection();
            createPollutantOption();

            const xScale = d3.scaleBand();
            const yScale = d3.scaleLinear();

            // Create the SVG container for the bar chart
            var container = d3.select('#barchart')
                                .append('svg')
                                .attr('id', 'barchart-container')
                                .attr("width", cfg.w+2*cfg.padding)
                                .attr("height", cfg.h+2*cfg.padding);

            var svg;
    
            // Get value from Year Slider
            const slider = document.getElementById('yearSlider');
            var pollutant_option = document.getElementById('pollutant_option');
            var lastClickedCountry = null;
            var pollutant_change = null;
            var year_slider = null;
    
            // Initialize Chart Variables
            const year = slider.value;                  // Get year from slider value
            const country = 'WORLD';                    // Default country for chart
            const pollutant = pollutant_option.value;   //Default pollutant from option
    
            document.addEventListener('countryClick', function(event) {
                let { code } = event.detail; // Only destructure what we use
                lastClickedCountry = code;  // Update the last clicked country
                pollutant_change = pollutant_option.value;
                year_slider = slider.value;
                update_chart(year_slider, lastClickedCountry, pollutant_change);
            });
            
            // Update on Slider change
            slider.addEventListener('change', function() {
                year_slider = slider.value;
                pollutant_change = pollutant_option.value;
                if (lastClickedCountry !== null){
                    update_chart(year_slider, lastClickedCountry, pollutant_change);
                }else{
                    update_chart(year_slider,country,pollutant_change);
                }
            });
            
            pollutant_option.addEventListener('input', function(){
                year_slider = slider.value;
                pollutant_change = pollutant_option.value;
                if (lastClickedCountry != null){
                    update_chart(year_slider, lastClickedCountry, pollutant_change);
                }else{
                    update_chart(year_slider,country,pollutant_change);
                };
            });
    
            draw_barchart(year,country,pollutant);
    
            // ...existing chart functions...
            function update_chart(year, country, pollutant) {
                return filter_data(year, country, pollutant).then(function(data){
                    xScale.domain((data.map(d => d.Cause_Name)).sort());
                    var maxDomainYAxis = d3.max(data, function(d) {return d['Burden Mean'];});
                    yScale.domain([0, Math.ceil(maxDomainYAxis / 100) * 100+ maxDomainYAxis/5]);
                    var xAxis = d3.axisBottom(xScale);
                    var yAxis = d3.axisLeft(yScale);
                    container.select(".x-axis").transition().duration(700).call(xAxis);
                    container.select(".y-axis").transition().duration(700).call(yAxis);
                    container.select("#chart-title").remove();
                    container.append("text")
                        .attr("x", (cfg.w+cfg.padding*2) / 2)
                        .attr("y", cfg.padding / 2)
                        .attr("id", "chart-title")
                        .style("text-anchor", "middle")
                        .style("font-size", `${1.2*cfg.fontSize}rem`)
                        .text(title_name(pollutant, data[0].Country, year));
                    var bars = svg.selectAll("rect").data(data);
                    bars.enter().append("rect").merge(bars).transition().duration(500)
                        .attr("x", function(d) { return xScale(d.Cause_Name)+ xScale.bandwidth()*0.29; })
                        .attr("y", function(d) { return yScale(d['Burden Mean'])-cfg.padding; })
                        .attr("width", xScale.bandwidth() * 0.4)
                        .attr("height", function(d) { return cfg.h - yScale(d['Burden Mean']); })
                        .attr("fill", d => colorScale(d.Cause_Name));
                    bars.exit().remove();
                });
            }
    
            function filter_data(year,country_code,pollutant){
                return d3.csv('https://huggingface.co/datasets/cos30049-safetywindy/air_quality_health/resolve/main/air_quality_health.csv').then (data => {
                    var datafilter = data.filter(function(d) {
                    return (d.ISO3 === country_code && d.Year === year && d.Pollutant === pollutant && d.Cause_Name !== 'All causes');
                    })
                    return datafilter;
                });
            }

            // ...existing chart functions continue...
        } // End of draw_chart function
        
        function createBarSection(){
            d3.select("#right-container")
                .append("div")  
                .attr("id", "barchart");
        }
        
        d3.csv('https://huggingface.co/datasets/cos30049-safetywindy/air_quality_health/resolve/main/air_quality_health.csv').then(data => {
            data = data.filter(function(d) {return d.Cause_Name !== 'All causes'})
            draw_chart(data); // Call function to draw the chart
        }).catch(error => {
            console.error("Error loading data:", error);
        });
        
    }, []); // Only run once on component mount

    return <div ref={svgRef}></div>;

}; 


export default BarChart;
