import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import all_countries_data_processed from '../../ProcessedData/air_quality_health.csv';
// import '../charts/chart_styles.css'; // Import your existing styles if any
import '../chart_styles.css'
const BarChart = () => {
    d3.select("#plot").remove();
    d3.select("#barchart").remove();
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

    const causeLabels = [
        'Asthma',
        'Ischemic heart disease',
        'Chronic obstructive pulmonary disease',
        'Tracheal, bronchus, and lung cancer',
        'Ischemic stroke',
        'Upper respiratory infections',
        'Lower respiratory infections',
        'Cataract'
    ]

    // Initialize the configuration of dimension
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
            // d3.select("#barchart").remove();
            createBarSection();
            createPollutantOption();

            const xScale = d3.scaleBand();
            const yScale = d3.scaleLinear();
            
            // var container = d3.select(svgRef.current)
            var container = d3.select('#barchart')
                                .append('svg')
                                .attr('id', 'barchart-container')
                                .attr("width", cfg.w+2*cfg.padding)
                                .attr("height", cfg.h+2*cfg.padding);
            
            console.log(svgRef.current);

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
                let { year, code, country } = event.detail;
                lastClickedCountry = code;  // Update the last clicked country
                pollutant_change = pollutant_option.value;
                year_slider = slider.value;
                country = lastClickedCountry;
                update_chart(year_slider, lastClickedCountry, pollutant_change);
            });
            
            // Update on Slider change
            // slider.addEventListener('input', function() {
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
    
            function update_chart(year, country, pollutant) {
                return filter_data(year, country, pollutant).then(function(data){
        
                    xScale.domain((data.map(d => d.Cause_Name)).sort());
                    // yScale.domain([0, d3.max(data, d => d.BurMean) * 1.2]);
                    var maxDomainYAxis = d3.max(data, function(d) {return d['Burden Mean'];});
                    yScale.domain([0, Math.ceil(maxDomainYAxis / 100) * 100+ maxDomainYAxis/5]);
        
                    // container.select(".x-axis").remove();
                    // container.select(".y-axis").remove();
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
                        .style("font-size", `${1.2*cfg.fontSize}rem`) // Set the font size here
                        .text(title_name(pollutant, data[0].Country, year));
        
                    // Update bars
                    var bars = svg.selectAll("rect")
                        .data(data);

                    bars.enter()
                        .append("rect")
                        .merge(bars)
                        .transition()
                        .duration(500)
                        .attr("x", function(d) { return xScale(d.Cause_Name)+ xScale.bandwidth()*0.29; })
                        .attr("y", function(d) { return yScale(d['Burden Mean'])-cfg.padding; })
                        .attr("width", xScale.bandwidth() * 0.4)
                        .attr("height", function(d) { return cfg.h - yScale(d['Burden Mean']); })
                        .attr("fill", d => colorScale(d.Cause_Name))
                        // 
                        // .transition()
                        // .duration(500)
        
                    bars.exit().remove();

                });
            }
    
            function filter_data(year,country_code,pollutant){
                return d3.csv(all_countries_data_processed).then (data => {
                    var datafilter = data.filter(function(d) {
                    return (d.ISO3 === country_code && d.Year === year && d.Pollutant === pollutant && d.Cause_Name !== 'All causes');
                    })
                    return datafilter;
                });
                
                
            };

            // Create or update the chart using D3.js
            function draw_barchart(year, country_code, pollutant) {

                return filter_data(year,country_code,pollutant).then(function(data){
                    //Configuring X Scale
                    xScale.range([cfg.padding, (cfg.w - cfg.padding)])
                        .domain((data.map(d => d.Cause_Name)).sort())
                        // .domain(causeLabels.sort())
                        .padding(0.2);
        
                    colorScale.domain(data.map(d => d.Cause_Name));
        
                    //Configuring Y Scale
                    var maxDomainYAxis = d3.max(data, function(d) {return d['Burden Mean'];});
                    yScale
                        // .range([cfg.h, 0])
                        // .domain([0, Math.ceil(maxDomainYAxis / 100) * 100+ maxDomainYAxis/5]);
                        .domain([0, maxDomainYAxis])
                        .range([cfg.h,0]);

                    console.log("cfg.h: "+cfg.h);
                    svg = container 
                        .append("svg")
                        .attr('id', 'bar-svg')
                        .attr('x',0)
                        .attr('y',cfg.padding)
                        .attr("width", cfg.w)
                        .attr("height", cfg.h+cfg.padding);

                    var xAxis = svg.append("g")
                        .attr("class", "x-axis")
                        // .attr("transform", "translate("+0+"," + (cfg.h - cfg.padding) + ")")
                        .attr("transform", `translate(0,${cfg.h - cfg.padding})`)
                        .transition().duration(700);

                    xAxis.call(d3.axisBottom(xScale))
                        .selectAll("text")
                        .attr("transform", `translate(-10,10)rotate(-25)`)
                        .style("text-anchor", "end");
        
        
                    var yAxis = d3.axisLeft(yScale);
                    svg.append("g")
                        .attr("class", "y-axis")
                        // .attr("transform", "translate(" + cfg.padding + ","+ -cfg.padding+")")
                        .attr("transform", `translate(${cfg.padding},${-cfg.padding})`)
                        .transition().duration(700)
                        .call(yAxis);
        
                    // Add x-axis label
                    container.append("text")
                        .attr("id", "bar-category-x-axis")
                        .attr("text-anchor", "middle")
                        .attr("x", cfg.w / 2)
                        .attr("y", cfg.h + cfg.padding * 1.8)
                        .text("Cause of Pollutant (" +pollutant+")")
                        .style("font-size", `${1.2*cfg.fontSize}rem`);
        
                    // Add y-axis label
                    container.append("text")
                        .attr("id", "bar-value-y-axis")
                        .attr("text-anchor", "middle")
                        .attr("transform", "rotate(-90)")
                        .attr("x", -(cfg.h/2+cfg.padding/2))
                        .attr("y", cfg.padding / 2)
                        .text("Burden Mean (DALYs)")
                        .style("font-size", `${1.2*cfg.fontSize}rem`);
                    
                    // Title
                    container.append("text")
                        .attr("x", (cfg.w+cfg.padding*2) / 2)
                        .attr("y", cfg.padding / 2)
                        .attr("id", "chart-title")
                        .style("text-anchor", "middle")
                        .style("font-size", `${1.2*cfg.fontSize}rem`) // Set the font size here
                        .text(title_name(pollutant, data[0].Country, year));
        
        
                    var bars = svg.append("g")
                        .selectAll("#bar-svg")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x", function(d) { return xScale(d.Cause_Name) + xScale.bandwidth()*0.29; })
                        .attr("y", function(d) { return yScale(d["Burden Mean"]) - cfg.padding; })
                        .attr("width", xScale.bandwidth() * 0.4)
                        .attr("height", function(d) {console.log(`Burden Mean of ${d.Cause_Name}: ${d['Burden Mean']} \nBur height: ${cfg.h - yScale(d['Burden Mean'])})`); return  (cfg.h - yScale(d['Burden Mean'])); })
                        // .attr("fill", "#69b3a2");
                        .attr("fill", function (d) { return colorScale(d.Cause_Name); });
    

                     // Create legend with IBM colors
                    var legend = container.append("g")
                    .attr("id", "legend")
                    .attr("transform", `translate(${cfg.w - cfg.padding*1.2}, ${cfg.padding})`);
        
                    legend.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d, i) => i * 20)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", d => colorScale(d.Cause_Name));
        
                    legend.selectAll("text")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("x", 24)
                        .attr("y", (d, i) => i * 20 + 14)
                        .text(d => d.Cause_Name)
                        .style("font-size", "12px");
                })
        
            }
    
            function title_name(pollutant_option, country, year) {
                var pollutant;
                if (pollutant_option === 'pm25') {
                    pollutant = 'Ambient Particulate Matter Pollution (PM2.5)';
                }
                else if (pollutant_option === 'no2') {
                    pollutant = 'Nitrogen Dioxide Pollution (NO2)';
                }
                else if (pollutant_option === 'ozone') {
                    pollutant = 'Ambien Ozone Pollution';
                }
                else if (pollutant_option === 'hap') {
                    pollutant = "Householf Air Pollution from Solid Fuels";
                }
            
                return `Burden of disease to ${pollutant} of ${country} in ${year}`;
            }
            
            
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
                // ['no2', 'pm25', 'ozone', 'hap']
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
        function createBarSection(){
            d3.select("#right-container")
                .append("div")  
                .attr("id", "barchart");
        }
        d3.csv(all_countries_data_processed).then(data => {
            data = data.filter(function(d) {return d.Cause_Name !== 'All causes'})
            console.log("Data loaded:", data);
            draw_chart(data); // Call function to draw the chart
        }).catch(error => {
            console.error("Error loading data:", error);
        });
        
    }, []); // Only run once on component mount

    return <div ref={svgRef}></div>;

}; 


export default BarChart;
