
// Import necessary libraries and components
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../../hook/Dimensions';
import '../chart_styles.css'

// Import necessary data for the visualisation
import all_countries_data_processed from '../../ProcessedData/all_countries_data_processed.csv';
import Population from '../../ProcessedData/Population.csv';
import country_continent from '../../ProcessedData/country_continent.csv';
import PredictionForm from '../../PredictionForm';

const BubblePlot = ({ predictionData }) => {
    // Remove any existing SVG elements from previous renders
    if (!predictionData)
    {
        d3.select("#plot").remove();
    }
    // d3.select("#plot").remove();
    d3.select("#barchart").remove();

    // Reference to the container for the plot
    const containerRef = useRef();
    // const predictedData = predictionData

    // Configuration for the plot dimensions and styling
    var cfg = {
        w: window.innerWidth*0.4,
        h: window.innerWidth*0.2,
        h2: (window.innerHeight*0.86),
        win_h: window.screen.height,
        padding: window.innerWidth*0.04,
        radius: window.innerWidth*0.4*0.0066666,
        border: 1,
        fontSize: window.innerWidth*0.43/700 //rem
    };
    console.log(predictionData);
    // Color scale for continents
    var continentColor = d3.scaleOrdinal()
    .domain(['Prediction',"Asia", "Europe", "Americas", "Africa", "Oceania", ])
    .range(d3.schemeSet1);
    
    useEffect(() => {
        
        console.log('abc');
        // Create the plot HTML objects and axis options on component mount
        createPlotSection();
        createPlotAxisOption();

        // Create the SVG container for the plot
        var container = d3.select('#plot')
        .append("svg")
        .attr('id', 'plot-container')
        .attr("width", cfg.w+2*cfg.padding)
        .attr("height", cfg.h);

        var svg;

        // Create a tooltip
        var tooltip;
    
        var population_scale = d3.scaleSqrt();

        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
    
        var x_option = document.getElementById('xAxis_option');
        var y_option = document.getElementById('yAxis_option');
    
        x_option.addEventListener('input', handleAxisChange);
        y_option.addEventListener('input', handleAxisChange);


        const slider = document.getElementById('yearSlider');
        const year = slider.value;  

        var pollutant;
        var x_update;
        var y_update;
        var chart_year;

        function handleAxisChange(update = false) {
            let x = x_option.value;
            let y = y_option.value;
            if (update == true){
                // updatePlot
                console.log("Update Plot");
            }
            else{
                return [x,y]; 
            }
        }

        d3.select("#xAxis_option").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update_option_axis(x_update = selectedOption, y_update = null)
        })



        // Get value from Year Slider
        slider.addEventListener('input', function() {
            let year = slider.value;
            return filterData(year, pollutant).then(function(data){
                updatePlot(data,chart_year = year);
            });
        });

        drawChart(x_update = null, y_update = null, chart_year = "2020",pollutant = 'pm25');
        if(predictionData){
            console.log(predictionData);
            // drawChart(x_update = null, y_update = null, chart_year = "2020",pollutant = 'pm25');
        }
        function update_option_axis(update_x, update_y){
            if (update_x === null){
                update_x = x_option.value;
            }    
            if (update_y === null){
                update_y = y_option.value;
            }
            d3.select("#plot-svg").remove();
            drawChart(x_update = update_x, y_update = update_y, chart_year, pollutant = update_x);
        }


        async function filterData(year, pollutant) {
            try {
                // Await all CSV data loading
                const [airQualityHealth, continentData, populationData] = await Promise.all([
                    d3.csv(all_countries_data_processed),
                    d3.csv(country_continent),
                    d3.csv(Population)
                ]);

                // Filter air quality data based on the provided year and pollutant
                const airQualityHealthFilter = airQualityHealth.filter(
                    d => d.Year === year && 
                         d.Pollutant === pollutant && 
                         d['Cause Name'] === 'All causes'
                );
                let newData = null
                if (predictionData){
                    // console.log(predictionData);
                    newData = {
                        countryCode: predictionData.iso3,
                        country: predictionData.iso3,
                        exposureMean: predictionData.input_exposure_mean,
                        burdenMean: predictionData.predicted_burden_mean,
                        pollutant: predictionData.input_pollutant,
                        unit: "µg/m3",
                        causeName: "All causes",
                        population: 10,
                        continent: 'Prediction'
                    }
                }
                // Filter population data for the specified year
                const population_in_year = populationData.filter(d => d.Year === year);
        
                // Merge data with continent and population data
                const mergedData = airQualityHealthFilter.map(d => {
                    const continentMatch = continentData.find(c => c.Country_code === d.ISO3);
                    const populationMatch = population_in_year.find(p => p.Country_code === d.ISO3);
                    return {
                        countryCode: d.ISO3,
                        country: d.Country,
                        exposureMean: +d['Exposure Mean'],
                        burdenMean: +d['Burden Mean'],
                        pollutant: d.Pollutant,
                        unit: d.Units,
                        causeName: d['Cause Name'],
                        population: populationMatch ? populationMatch.Population : null,
                        continent: continentMatch ? continentMatch.Continent : null,
                    };
                });
                if (newData) {
                    mergedData.push(newData);
                  }
                // Add column names for easier access
                mergedData.columns = Object.keys(mergedData[0]);
                return mergedData;
        
            } catch (error) {
                console.error("Error filtering data:", error);
                return []; // Return empty array in case of error
            }
        }
        
        function updatePlot(data,chart_year) {
            var xAxis_option;
            var yAxis_option;
            var axis_option = handleAxisChange();
            xAxis_option = axis_option[0];
            yAxis_option = axis_option[1];
    
            xScale
                .domain([d3.min(data, d => {return d.exposureMean})-10, d3.max(data, d => {return d.exposureMean})+10])
                .range([0, cfg.w - cfg.padding*2]);
            yScale
                .domain([d3.min(data, d => {return d.burdenMean})-10 , d3.max(data, d => {return d.burdenMean})+10])
                .range([cfg.h - cfg.padding*2, 0]);     
    
            var xAxis = d3.axisBottom(xScale).ticks(7);
            var yAxis = d3.axisLeft(yScale).ticks(7);
    
            svg.select(".x-axis").transition().duration(300).call(xAxis);
            svg.select(".y-axis").transition().duration(300).call(yAxis);
            
            var strokesContainer = d3.select('#strokes-container');
            var circles = strokesContainer.selectAll("circle")
                .data(data);
            
            circles.enter()
                .append("circle")
                .merge(circles)
                .transition().duration(300)
                .attr("cx", d => xScale(d.exposureMean))
                .attr("cy", d => yScale(d.burdenMean))
                .attr("r", function(d) { return population_scale(d.population)})
                .attr("stroke", "black");
    
            circles.exit().remove();
    
            svg.select("#chart-year").remove();
            svg.append("text")
                    .attr("x", cfg.w / 2)
                    .attr("y", cfg.padding / 2)
                    .attr("id", "chart-year")
                    .style("text-anchor", "middle")
                    .style("font-size", `${cfg.fontSize} px`) // Set the font size here
                    .text(title_name(xAxis_option,yAxis_option,chart_year));
        }
    

        function drawChart(x_update, y_update, chart_year = "2020",pollutant = "pm25"){
            return filterData(chart_year,pollutant).then(function(data){
                var xAxis_option;
                var yAxis_option;
                if (x_update == null && y_update == null){
                    var axis_option = handleAxisChange();
                    xAxis_option = axis_option[0];
                    yAxis_option = axis_option[1];
                    var xAxisData = get_data_by_axis(data,xAxis_option);
                }
                else{
                    xAxis_option = x_update;
                    yAxis_option = y_update;
                    var xAxisData = get_data_by_axis(data,xAxis_option);
                }
                var mergedData = filter_null_data(data, [xAxis_option]);

                population_scale 
                    .domain([d3.max(mergedData, d => d.population), d3.min(mergedData, d => d.population)])
                    .range([ cfg.radius*1.3, cfg.radius]);
                
                xScale
                    .domain([d3.min(xAxisData)-10, d3.max(xAxisData)+10])
                    .range([0, cfg.w - cfg.padding*2]);
                yScale
                    .domain([d3.min(data, d => {return d.burdenMean})-10 , d3.max(data, d => {return d.burdenMean})+10])
                    .range([cfg.h - cfg.padding*2, 0]);    
                    
                var xAxis = d3.axisBottom(xScale).ticks(7);
                var yAxis = d3.axisLeft(yScale).ticks(7);

                svg = container //d3.select('#plot-container')
                    .append("svg")
                    .attr('id', 'plot-svg')
                    .attr("width", cfg.w)
                    .attr("height", cfg.h);
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate("+cfg.padding+"," + (cfg.h - cfg.padding) + ")")
                    .transition().duration(700)
                    .call(xAxis);
                svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", "translate(" + cfg.padding + ","+cfg.padding+")")
                    .transition().duration(700)
                    .call(yAxis);
        
                var strokes = d3.select('#plot-svg')
                    .append('svg')
                    .attr('id','strokes-container')
                    .attr("x", cfg.padding)
                    .attr("y", cfg.padding)
                    .attr("width", cfg.w-cfg.padding*2)
                    .attr("height", cfg.h-cfg.padding*2);

                strokes.selectAll("circle").remove();

                svg.append("text")
                    .attr("x", cfg.w / 2)
                    .attr("y", cfg.h - 10)
                    .style("text-anchor", "middle")
                    .style("font-size", `${1.1*cfg.fontSize}rem`)
                    .text(axis_name(xAxis_option));
        
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -cfg.h / 2)
                    .attr("y", cfg.padding*0.22)
                    .style("text-anchor", "middle")
                    .style("font-size", `${1.1*cfg.fontSize}rem`)
                    .text(axis_name(yAxis_option));
        
                const zoom = d3.zoom()
                    .scaleExtent([0.5, 32])
                    .on("zoom", zoomed);
        
                container.call(zoom);

                function zoomed(event) {
                    const transform = event.transform;
                    const newXScale = transform.rescaleX(xScale);
                    const newYScale = transform.rescaleY(yScale);
                    
                    var xAxis = d3.axisBottom(newXScale)
                    var yAxis = d3.axisLeft(newYScale)
        
                    svg.select(".x-axis").call(xAxis);
                    svg.select(".y-axis").call(yAxis);
                    svg.selectAll("circle")
                        .attr("cx", d => newXScale(d.exposureMean))
                        .attr("cy", d => newYScale(d.burdenMean));
                }
                // Title
                svg.append("text")
                    .attr("x", cfg.w / 2)
                    .attr("y", cfg.padding / 2)
                    .attr("id", "chart-year")
                    .style("text-anchor", "middle")
                    .style("font-size", `${1.2*cfg.fontSize}rem`) // Set the font size here
                    .text(title_name(xAxis_option,yAxis_option,chart_year));
        
                var highlight = function(event,d){
                    // reduce opacity of all groups
                    d3.selectAll(".bubbles")
                    .style("opacity", .05)
                    // expect the one that is hovered
                    d3.selectAll("."+d)
                    .style("opacity", 0.9)
                    }
                
                    // And when it is not hovered anymore
                var noHighlight = function(event,d){
                    d3.selectAll(".bubbles")
                    .style("opacity", 0.7)
                    }
        
                var valuesToShow = [10000000, 100000000, 1000000000];
                
                container
                // .selectAll("legend")
                .selectAll(".legend-circle")
                .data(valuesToShow)
                .enter()
                .append("circle")
                    .attr("class", "legend-circle")
                    .attr("cx", cfg.w)
                    .attr("cy", function(d){ return cfg.h *2/3  - population_scale(d) } )
                    .attr("r", function(d){ return population_scale(d) })
                    .style("fill", "none")
                    .attr("stroke", "black");
                
                container
                // .selectAll("legend")
                .selectAll(".legend-line")
                .data(valuesToShow)
                .enter()
                .append("line")
                    .attr("class", "legend-line")
                    .attr('x1', function(d){ return cfg.w  + population_scale(d) } )
                    .attr('x2', function(d,i) { return cfg.w + cfg.padding*0.5 + cfg.padding*0.3*i})
                    .attr('y1', function(d){ return cfg.h *2/3  - population_scale(d) } )
                    .attr('y2', function(d){ return cfg.h *2/3 - population_scale(d) } )
                    .attr('stroke', 'black')
                    .style('stroke-dasharray', ('2,2'));
        
                //Legend label
                container
                    // .selectAll("legend")
                    .selectAll(".legend-text") // Unique selector for text labels
                    .data(valuesToShow)
                    .enter()
                    .append("text")
                    .attr('x', function(d, i){return cfg.w + cfg.padding*0.5 + cfg.padding*0.3*i} )
                    .attr('y', function(d){ return cfg.h*2/3- population_scale(d)} )
                    .text( function(d){ return d/1000000 } )
                    .style("font-size", `${0.7*cfg.fontSize}rem`)
                    .attr('alignment-baseline', 'middle');
        
                // Legend title
                container.append("text")
                    .attr('x', cfg.w+cfg.padding/2)
                    .attr("y", cfg.h * 0.75)
                    .style("font-size", `${0.9*cfg.fontSize}rem`)
                    .text("Population (Millions)")
                    .attr("text-anchor", "middle");
        
                var size = cfg.radius*5;
        
                var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania", "Prediction"]
                    container.selectAll("myrect")
                    .data(allgroups)
                    .enter()
                    .append("circle")
                        .attr("cx", cfg.w)
                        .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                        .attr("r", 7)
                        .style("fill", function(d){ return continentColor(d)})
                        .on("mouseover", highlight)
                        .on("mouseleave", noHighlight)
        
                    container.selectAll("mylabels")
                        .data(allgroups)
                        .enter()
                        .append("text")
                        .attr("x", cfg.w + size*0.8)
                        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                        .style("fill", function(d){ return continentColor(d)})
                        .style("font-size", `${cfg.fontSize}rem`)
                        .text(function(d){ return d})
                        .attr("text-anchor", "left")
                        .style("alignment-baseline", "middle")
                        .on("mouseover", highlight)
                        .on("mouseleave", noHighlight)
 
                    strokes.selectAll("circle")
                        .data(mergedData)
                        .enter()
                        .append("circle")
                        .attr("id", "stroke")
                        .attr("class", function(d) { return "bubbles " + d.continent })
                        .attr("cx", d => {
                            var cx = xScale(d.exposureMean);
                            return cx;
                        })
                        .attr("cy", d => {
                            var cy = yScale(d.burdenMean);
                            return cy;
                        })
                        .on("mouseover", handleMouseOver)
                        .on("mousemove", handlerMouseMove)
                        .on("mouseleave", handleMouseOut)
                        .transition().duration(700)
                        .attr("r", function(d) { return population_scale(d.population)})
                        .style("fill", function (d) { return continentColor(d.continent); })
                        .attr("stroke", "black")
                        .attr("border", 1);

            }); //End of drawChart()
        }


        


        function createPlotSection(){
            d3.select("#right-container")
                .append("div")  
                .attr("id", "plot");
            d3.select("#right-container")
                .append("div")  
                .attr("id", "predict");
        }
        function createPlotAxisOption(){
            var plotOptionDiv = d3.select('#plot')
            .append("div")
            .attr("id", "plot-option");
        
            // Adding label and select elements to the plot-option div for X Axis
            plotOptionDiv.append("label")
                .attr("for", "xAxis_option")
                .text("Pollutant type: ");
        
            var xAxisSelect = plotOptionDiv.append("select")
                .attr("id", "xAxis_option")
                .attr("name", "xAxis_option");
        
            xAxisSelect.append("option")
                .attr("value", "pm25")
                .text("Particulate Matter 2.5");
        
            // No proper data for no2
            // xAxisSelect.append("option")
            //     .attr("value", "no2")
            //     .text("Nitrogen Dioxide");
        
            xAxisSelect.append("option")
                .attr("value", "ozone")
                .text("Ozone");
            xAxisSelect.append("option")
                .attr("value", "hap")
                .text("Household Air Pollution from Solid Fuels");
        
            // Adding some spacing between the X Axis and Y Axis options
            plotOptionDiv.append("span")
                .html("&nbsp;&nbsp;&nbsp;");
        
            // Adding label and select elements to the plot-option div for Y Axis
            plotOptionDiv.append("label")
                .attr("for", "yAxis_option")
                .text("Measurement: ");
        
            var yAxisSelect = plotOptionDiv.append("select")
                .attr("id", "yAxis_option")
                .attr("name", "yAxis_option");
        
            yAxisSelect.append("option")
                .attr("value", "daly")
                .text("Disability-adjusted Life Years");
        
        }

        function handleMouseOver(event, d) {
            tooltip = d3.select("#plot")
                .append("div")
                .attr("class", "plot-tooltip")
                .style("font-family","serif ")
                .style("position", "absolute")
                .style("background-color", "rgba(0, 0, 0, 0.75)")
                .style("color", "white")
                .style("padding", "6px 8px")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("position", "absolute")
                .style("opacity", 0);  // Start hidden for smooth fade-in
            var tooltipContent = d.exposureMean && d.burdenMean ? 
                
                `<div><strong>Country:</strong> ${replaceNull(d.country)}<br>
                <strong>Exposure of ${replaceNull(d.pollutant)}:</strong> ${replaceNull(d.exposureMean)} ${replaceNull(d.unit)}<br>
                <strong>Cause: </strong> ${replaceNull(d.causeName)}<br>
                <strong>Burden of DALYs: </strong> ${replaceNull(d.burdenMean)}<br>
                <strong>Population:</strong> ${replaceNull(d.population)} people<br> ` : 
                `<div><strong>Country:</strong> ${d.country}</div>`;
            
            d3.select(this)
            .transition()
            .duration(300)
            .attr("r", function(d) { return population_scale(d.population)+2});

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(tooltipContent)
                .style("left", `${event.clientX + 10} px`)
                // .style("top", (`${ 1000} px`))
                // .style("top", `${event.clientY - cfg.win_h*0.35}px`)
                .style("top", `${event.clientY +50}px`);
        }

        function handlerMouseMove(event){
            tooltip
            .style("left", `${event.clientX + 10}px`)  // Position tooltip near cursor
            .style("top", `${event.clientY - cfg.win_h*0.35}px`)
        }
        function handleMouseOut() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
    
            d3.select(this)
                // .attr("r", cfg.radius);
                .attr("r", function(d) { return population_scale(d.population)});
            d3.selectAll(".plot-tooltip").remove();
        }

        function replaceNull(data){
            if (data == null) 
                return `No Reported Data`;
            else {
                return data;
            }
        }

        function get_data_by_axis(data,axis){
            return data.map(function(d){
                if (axis == 'pm25'){
                    return d.exposureMean;
                }
                if (axis == 'no2'){
                    return d.exposureMean;
                }
                if (axis == 'ozone'){
                    return d.exposureMean;
                }
                if (axis == 'hap'){
                    return d.exposureMean;
                }
                if (axis == 'daly'){
                    return d.burdenMean;
                }
                return null;
            });
        }
        function filter_null_data(data, keys) {
            return data.filter(row => {
                return keys.every(key => row[key] !== null);
            });
        }

        function title_name(xAxis, yAxis, year) {
            var title_x;
            var title_y;
            if (xAxis == 'pm25') {
                title_x = 'PM25';
            }
            else if (xAxis == 'no2') {
                title_x = 'NO2';
            }
            else if (xAxis == 'ozone') {
                title_x = 'Ozone';
            }
            else if (xAxis == 'hap') {
                title_x = "HAP";
            }
            else if (xAxis == 'daly') {
                title_x = "DALYs";
            }
    
    
            if (yAxis == 'pm25') {
                title_y = 'PM25';
            }
            else if (yAxis == 'no2') {
                title_y = 'NO2';
            }
            else if (yAxis == 'ozone') {
                title_y = 'Ozone';
            }
            else if (yAxis == 'hap') {
                title_y = "HAP";
            }
            else if (yAxis == 'daly') {
                title_y = "DALYs";
            }

            return `Number of ${title_y} Attributable to  ${title_x} in ${year}`;
        }

        function axis_name(axis){
            if (axis == 'pm25') {
                return "PM25 (µg/m3)";
            }
            else if (axis == 'no2'){
                return "NO2 (µg/m3)";
            }
            else if (axis == 'ozone') {
                return 'Ozone (ppb)';
            }
            else if (axis == 'hap') {
                return "HAP (% of population)";
            }
            else if (axis == 'daly') {
                return "DALYs";
            }
            else {
                return "Axis";
            }
        }


    }, []); // Only run once on component mount

    return (
        <div>
            
            <div ref={containerRef}></div>
            {/* <div ref = {useRef()}><PredictionForm /></div> */}
            {/* User Input form */}
            {/* <div ref = {useRef()}><FormInputPrediction /></div> */}
    
        </div>
    );

};

export default BubblePlot;
