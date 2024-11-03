import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import WindowDimensions from '../../hook/Dimensions';
import all_countries_data_processed from '../../ProcessedData/all_countries_data_processed.csv';
import Population from '../../ProcessedData/Population.csv';
import country_continent from '../../ProcessedData/country_continent.csv';
import '../chart_styles.css'

const BubblePlot = () => {
    d3.select("#plot").remove();
    d3.select("#barchart").remove();
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

        drawChart();

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


                // var airQualityHealthFilter = airQualityHealth.filter(function(d) {
                // return (d.Year === year && d.Pollutant === pollutant && d.Cause_Name !== 'All causes');
                // })
                var airQualityHealthFilter = airQualityHealth.filter(d => (d.Year === year && d.Pollutant === pollutant && d.Cause_Name !== 'All causes'));
                var population_in_year = populationData.filter(d => d.Year === year);
                var mergedData = airQualityHealthFilter.map(d => {
                    var continentMatch = continentData.find(c => c.Country_code === d.ISO3);
                    var populationMatch = population_in_year.find(p => p.Country_code === d.ISO3);
                    return{
                        countryCode: d.ISO3,
                        country: d.Country,
                        exposureMean: d['Exposure Mean'],
                        burdenMean: d['Burden Mean'],
                        pollutant: d.Pollutant,
                        unit: d.Units,
                        population: populationMatch ? populationMatch.Population : null,
                        continent: continentMatch ? continentMatch.Continent : null,
                    }
                });
                
                // return airQualityHealthFilter;
                // return population_in_year;
                // return continentData;
                var columns = Object.keys(mergedData[0]);
                mergedData.columns = columns; // Add columns to mergedData for easier access
                return mergedData;
                
            });
        }




        function drawChart(x_update = null, y_update = null, chart_year = "2020",pollutant = 'pm25'){
            `
                This function will select select data based on the current Axis of the chart
                Eg: xAxis_option = pm25 ; yAxis_option = no2
                    => get cx => data.[xAxis_option ] = data.pm25
                    => get yx => data.[yAxis_option ] = data.no2
            `
            return filterData(chart_year,pollutant).then(function(data){
                var xAxis_option;
                var yAxis_option;
                if (x_update == null && y_update == null){
                    var axis_option = handleAxisChange();
                    xAxis_option = axis_option[0];
                    yAxis_option = axis_option[1];
                    var xAxisData = get_data_by_axis(data,xAxis_option);
                    var yAxisData = get_data_by_axis(data,yAxis_option);
                }
                else{
                    xAxis_option = x_update;
                    yAxis_option = y_update;
                    var xAxisData = get_data_by_axis(data,xAxis_option);
                    var yAxisData = get_data_by_axis(data,yAxis_option);
                }
                var mergedData = filter_null_data(data, [xAxis_option, yAxis_option]);

                population_scale 
                    .domain([d3.max(mergedData, d => d.population), d3.min(mergedData, d => d.population)])
                    .range([ cfg.radius, cfg.radius*1.01]);
                xScale
                    .domain([d3.min(xAxisData)-10, d3.max(xAxisData)+10])
                    .range([0, cfg.w - cfg.padding*2]);
                yScale
                    .domain([d3.min(yAxisData)-10 , d3.max(yAxisData)+10])
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
                        .attr("cx", d => newXScale(d[xAxis_option]))
                        .attr("cy", d => newYScale(d[yAxis_option]));
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
                    .style("opacity", 1)
                    }
                
                    // And when it is not hovered anymore
                var noHighlight = function(event,d){
                    d3.selectAll(".bubbles")
                    .style("opacity", 1)
                    }
        
                var valuesToShow = [10000000, 100000000, 1000000000];
                
                container
                .selectAll("legend")
                .data(valuesToShow)
                .enter()
                .append("circle")
                    .attr("cx", cfg.w)
                    .attr("cy", function(d){ return cfg.h *2/3  - population_scale(d) } )
                    .attr("r", function(d){ return population_scale(d) })
                    .style("fill", "none")
                    .attr("stroke", "black");
                
                container
                .selectAll("legend")
                .data(valuesToShow)
                .enter()
                .append("line")
                    .attr('x1', function(d){ return cfg.w  + population_scale(d) } )
                    .attr('x2', function(d,i) { return cfg.w + cfg.padding*0.5 + cfg.padding*0.3*i})
                    .attr('y1', function(d){ return cfg.h *2/3  - population_scale(d) } )
                    .attr('y2', function(d){ return cfg.h *2/3 - population_scale(d) } )
                    .attr('stroke', 'black')
                    .style('stroke-dasharray', ('2,2'));
        
                //Legend label
                container
                    .selectAll("legend")
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
        
                var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"]
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

                    const testData = { [xAxis_option]: 100 }; // Example data object
                    // console.log(xScale(testData[xAxis_option]));
                    console.log(mergedData);    
                    console.log(xAxis_option);
                    strokes.selectAll("circle")
                        .data(mergedData)
                        .enter()
                        .append("circle")
                        .attr("id", "stroke")
                        .attr("class", function(d) { return "bubbles " + d.continent })
                        // .attr("cx", d => xScale(d[xAxis_option]))
                        // .attr("cy", d => yScale(d[yAxis_option]))
                        // .attr("cx", d => xScale(d.exposureMean))
                        // .attr("cy", d => yScale(d.burdenMean))
                        .attr("cx", d => {
                            // const cx = xScale(d[xAxis_option]);
                            const cx = xScale(d.exposureMean);
                            // console.log("cx for", d, ":", cx);
                            return cx;
                        })
                        .attr("cy", d => {
                            // const cy = yScale(d[yAxis_option]);
                            const cy = yScale((d.burdenMean));
                            // console.log("cy for", d, ":", cy);
                            return cy;
                        })
                        .on("mouseover", handleMouseOver)
                        .on("mouseout", handleMouseOut)
                        .transition().duration(700)
                        .attr("r", function(d) { return population_scale(d.population)})
                        .style("fill", function (d) { return continentColor(d.continent); } )
                        .attr("stroke", "black")
                        .attr("border", 1);

            }); //End of drawChart()
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
                .attr("value", "pm25")
                .text("Particulate Matter 2.5");
        
            xAxisSelect.append("option")
                .attr("value", "no2")
                .text("Nitrogen Dioxide");
        
            xAxisSelect.append("option")
                .attr("value", "ozone")
                .text("Ozone");
            xAxisSelect.append("option")
                .attr("value", "hap")
                .text("Household Air Pollution");
        
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
                .attr("value", "dalys")
                .text("Disability-adjusted Life Years");
        
        }

        function handleMouseOver(event, d) {

            tooltip = d3.select("#plot")
                .append("div")
                .attr("class", "chart-tooltip");
            var tooltipContent = d.lifeExpectancy && d.gdp_capita ? 
                
                `<div><strong>Country:</strong> ${replaceNull(d.country)}<br>
                <strong>Life Expectancy:</strong> ${replaceNull(d.lifeExpectancy)} years<br>
                <strong>GDP/Capita:</strong> ${replaceNull(d.gdp_capita)} $US<br>
                <strong>GDP:</strong> ${replaceNull(d.gdp)} Billions $US<br>
                <strong>Population:</strong> ${replaceNull(d.population)} people<br> 
                <strong>Health Expenditure GDP shared:</strong> ${replaceNull(d.health_expenditure_gdp_share)}% <br> 
                <strong>Health Expenditure:</strong> ${replaceNull(d.health_expenditure)} $US<br> 
                <strong>Health Expenditure per Capita:</strong> ${replaceNull(d.health_expenditure_capita)} $US<br> </div>
    
    
                <div style="font-size:60%"><strong>GDP</strong> & <strong>GDP/capita</strong> are conducted using <strong>Purchasing Power Parity (PPPs)</strong> in $US</div></div>` : 
                
                `<div><strong>Country:</strong> ${d.country}</div>`;
    
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(tooltipContent)
                .style("left", (event.pageX + cfg.padding/5) + "px")
                // .style("top", (event.pageY - cfg.h*3+cfg.padding/2) + "px");
                .style("top", (`${event.pageY- cfg.h2*1.6}px`));
            d3.select(this)
                // .attr("r", cfg.radius + 2);
                .attr("r", function(d) { return population_scale(d.population)+2});
        }
    
        function handleMouseOut() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
    
            d3.select(this)
                // .attr("r", cfg.radius);
                .attr("r", function(d) { return population_scale(d.population)});
            d3.selectAll(".chart-tooltip").remove();
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
                if (axis == 'dalys'){
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
            else if (xAxis == 'dalys') {
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
            else if (yAxis == 'dalys') {
                title_y = "DALYs";
            }

            return `${title_x} - ${title_y} in ${year}`;
        }

        function axis_name(axis){
            if (axis == 'pm25') {
                return "PM25";
            }
            else if (axis == 'no2'){
                return "NO2";
            }
            else if (axis == 'ozone') {
                return 'Ozone';
            }
            else if (axis == 'hap') {
                return "HAP";
            }
            else if (axis == 'dalys') {
                return "DALYs";
            }
            else {
                return "Axis";
            }
        }












    }, []); // Only run once on component mount

    return (
    <div> 

    </div>
    );

};

export default BubblePlot;
