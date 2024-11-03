import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../../hook/Dimensions';
import all_countries_data_processed from '../../ProcessedData/all_countries_data_processed.csv';
import Population from '../../ProcessedData/Population.csv';
import country_continent from '../../ProcessedData/country_continent.csv';
import '../chart_styles.css'

const BubblePlot = () => {
    const containerRef = useRef();
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
        // d3.select("#yAxis_option").on("change", function(d) {
        //     // recover the option that has been chosen
        //     var selectedOption = d3.select(this).property("value")
        //     // run the updateChart function with this selected option
        //     update_option_axis(update_x = null, update_y = selectedOption)
        // })
        // d3.select("#xAxis_option").on("change", function(d) {
        //     // recover the option that has been chosen
        //     var selectedOption = d3.select(this).property("value")
        //     // run the updateChart function with this selected option
        //     update_option_axis(update_x = selectedOption, update_y = null)
        // })

        const slider = document.getElementById('yearSlider');
        const year = slider.value;  

        // Get value from Year Slider
        // slider.addEventListener('input', function() {
        //     let year = slider.value;
        //     get_data_from_year(year).then(function(data){
        //         updatePlot(data,chart_year = year);
        //     });
        // });

        // draw_chart(x_update = null, y_update = null);


        function filterData(year, pollutant){
            return Promise.all([
                d3.csv(all_countries_data_processed),
                d3.csv(country_continent),
                d3.csv(Population),
            ]).then(function(data){
                var airQualityHealth = data[0];
                var continentData = data[1];
                var populationData = data[2];

                
            });
        }



        function drawChart(){

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
