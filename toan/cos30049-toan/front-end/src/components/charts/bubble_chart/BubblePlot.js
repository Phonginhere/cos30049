import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../../hook/Dimensions';
import all_countries_data_processed from '/Users/phongporter/Downloads/cos30049-toan/front-end/src/components/ProcessedData/all_countries_data_processed.csv'
import population from '/Users/phongporter/Downloads/cos30049-toan/front-end/src/components/ProcessedData/Population.csv';

import '../chart_styles.css'

d3.csv("../HomePage/Processed_Data/Life_expectancy.csv"),
d3.csv("../HomePage/Processed_Data/GDP_processed.csv"),
d3.csv("../HomePage/Processed_Data/country_continent.csv"),
d3.csv("../HomePage/Processed_Data/Population.csv"),
d3.csv("../HomePage/Processed_Data/Health_expenditure.csv")
// import '../charts/chart_styles.css'; // Import your existing styles if any

const BubblePlot = () => {
    const containerRef = useRef();
    const {mouse_x, mouse_y} = MouseHandler();
    const json = world;   
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
    var cfg = {
        w: window.innerWidth*0.4,
        h: window.innerWidth*0.2,
        h2: (window.innerHeight*0.86),
        padding: window.innerWidth*0.04,
        radius: window.innerWidth*0.4*0.0066666,
        border: 1,
        fontSize: window.innerWidth*0.4/600 //rem
    };
    var continentColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
    .range(d3.schemeSet1);

    
    useEffect(() => {
        
        createPlotSection();
        createPlotAxisOption();

        // Create container holding chart
        var container = d3.select('#plot')
        .append("svg")
        .attr('id', 'plot-container')
        .attr("width", cfg.w+2*cfg.padding)
        // .attr("height", cfg.h+1*cfg.padding);
        .attr("height", cfg.h);

        var svg;

        // Create a tooltip div
        var tooltip;
    
        var population_scale = d3.scaleSqrt();

        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
    
        var x_option = document.getElementById('xAxis_option');
        var y_option = document.getElementById('yAxis_option');
    
        x_option.addEventListener('input', handleAxisChange);
        y_option.addEventListener('input', handleAxisChange);

        function handleAxisChange(update = false) {
            let x = x_option.value;
            let y = y_option.value;
            if (update == true){
                // updatePlot
                console.log("UPDATE");
            }
            else{
                return [x, y]; 
            }
        }

        function get_data_from_year(year){
            return Promise.all([
                d3.csv("../HomePage/Processed_Data/Life_expectancy.csv"),
                d3.csv("../HomePage/Processed_Data/GDP_processed.csv"),
                d3.csv("../HomePage/Processed_Data/country_continent.csv"),
                d3.csv("../HomePage/Processed_Data/Population.csv"),
                d3.csv("../HomePage/Processed_Data/Health_expenditure.csv")
    
            ]).then(function(data){
                var lifeExpectancyData = data[0];
                var gdpData = data[1];
                var continentData = data[2];
                var populationData = data[3];
                var healthExpenditureData = data[4];
    
                var lifeExpectancy_in_year = lifeExpectancyData.filter(d => d.Year === year);
                var gdp_in_year = gdpData.filter(d => d.Year === year);
                var population_in_year = populationData.filter(d => d.Year === year);
                var healthExpenditureData_in_year = healthExpenditureData.filter(d => d.Year === year);
    
                var mergedData = lifeExpectancy_in_year.map(d => {
                    var gdpMatch = gdp_in_year.find(g => g.Country_code === d.Country_code);
                    var continentMatch = continentData.find(c => c.Country_code === d.Country_code);
                    var populationMatch = population_in_year.find(p => p.Country_code === d.Country_code);
                    var healthExpenditureMatch = healthExpenditureData_in_year.find(p => p.Country_code === d.Country_code);
                    return {
                        country: d.Country,
                        lifeExpectancy: +d.Life_expectancy,
                        gdp: gdpMatch ? +gdpMatch.GDP : null,
                        gdp_capita: gdpMatch ? +gdpMatch.GDP_capita : null,
                        continent: continentMatch ? continentMatch.Continent : null,
                        population: populationMatch ? populationMatch.Population : null,
                        health_expenditure_gdp_share: healthExpenditureMatch ? healthExpenditureMatch.health_expenditure_gdp_share : null,
                        health_expenditure: healthExpenditureMatch ? healthExpenditureMatch.health_expenditure : null,
                        health_expenditure_capita: healthExpenditureMatch ? healthExpenditureMatch.health_expenditure_capita : null,
                    };
                }).filter(d => d.gdp_capita !== null);
                // Extract columns from the merged data
                var columns = Object.keys(mergedData[0]);
                mergedData.columns = columns; // Add columns to mergedData for easier access
                var filteredColumns = mergedData.columns.filter(function(column) {
                    return column !== 'country' && column !== 'continent' && column !== 'population';
                });
                return mergedData;
            });
        }
    





        function createPlotSection(){
            d3.select("#right-container")
                .append("div")  
                .attr("id", "plot");
        }
        function createPlotAxisOption(){
            var plotOptionDiv = d3.select('#plot')
            .append("div")
            .attr("id", "plot-option");
        
            // Adding label and select elements to the plot-option div for X Axis
            plotOptionDiv.append("label")
                .attr("for", "xAxis_option")
                .text("X Axis Option: ");
        
            var xAxisSelect = plotOptionDiv.append("select")
                .attr("id", "xAxis_option")
                .attr("name", "xAxis_option");
        
            xAxisSelect.append("option")
                .attr("value", "gdp_capita")
                .text("GDP per Capita");
        
            xAxisSelect.append("option")
                .attr("value", "lifeExpectancy")
                .text("Life Expectancy");
        
            xAxisSelect.append("option")
                .attr("value", "gdp")
                .text("GDP");
        
            // Adding some spacing between the X Axis and Y Axis options
            plotOptionDiv.append("span")
                .html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        
            // Adding label and select elements to the plot-option div for Y Axis
            plotOptionDiv.append("label")
                .attr("for", "yAxis_option")
                .text("Y Axis Option: ");
        
            var yAxisSelect = plotOptionDiv.append("select")
                .attr("id", "yAxis_option")
                .attr("name", "yAxis_option");
        
            yAxisSelect.append("option")
                .attr("value", "lifeExpectancy")
                .text("Life Expectancy");
        
            yAxisSelect.append("option")
                .attr("value", "gdp_capita")
                .text("GDP per Capita");
        
            yAxisSelect.append("option")
                .attr("value", "gdp")
                .text("GDP");
            // yAxisSelect.append("option")
            //     .attr("value", "health_expenditure_capita")
            //     .text("Health Expenditure/Capita");
        }

    }, []); // Only run once on component mount

    return (
    <div> 

    </div>
    );

};

export default BubblePlot;
