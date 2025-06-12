
// Import necessary libraries and components
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../chart_styles.css'

// Import necessary data for the visualisation
import world from './world.json'

// CSV data will be loaded from public directory




const Choropleth = () => {

    // Reference to the container for the plot
    const containerRef = useRef();

    // World map geoJSON data
    const json = world;   

    // Configuration for the plot dimensions and styling
    const getConfig = () => {
        const containerWidth = containerRef.current ? containerRef.current.offsetWidth : window.innerWidth * 0.43;
        const maxWidth = Math.min(containerWidth - 40, 600); // 40px for padding
        return {
            w: maxWidth,
            h: maxWidth * 0.6, // Better aspect ratio for world map
            h2: (window.innerHeight * 0.72),
            win_h: window.screen.height,
            padding: Math.min(maxWidth / 20, 30),
            fontSize: Math.max(maxWidth / 700, 0.8)
        };
    };

    var cfg = getConfig();

    // const [formState, setFormState] = useState({
    //     visible: false,
    //     country: '',
    //     code: '',
    //     year: '',
    // });

    
    useEffect(() => {
        // Clear any existing content
        d3.select(containerRef.current).selectAll("*").remove();

        // Create or update the chart using D3.js
        function drawChoropleth(initial_data){
            // Color scale for PM2.5 exposure levels
            const color = d3.scaleQuantize()
                    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'])

            // Color legend scale
            const color_legend = d3.scaleQuantize()
                    .range(['#969696','#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'])

            // Map projection and path generator
            const projection = d3.geoMercator()
                    .center([0, 20])
                    .translate([(cfg.w - 2 * cfg.padding)/2, (cfg.h - 2 * cfg.padding)/2])
                    .scale(Math.min((cfg.w - 2 * cfg.padding)/7, (cfg.h - 2 * cfg.padding)/5))
                    .precision(0.1);
            const path = d3.geoPath()
                    .projection(projection);
                
            // Create the SVG container for the choropleth
            var container = d3.select(containerRef.current)
                    .append("svg")
                    .attr('id', 'choropleth-container')
                    .attr("width", cfg.w)
                    .attr("height", cfg.h)
                    .attr("viewBox", `0 0 ${cfg.w} ${cfg.h}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .style("max-width", "100%")
                    .style("height", "auto");

            // Create the main SVG group (remove nested SVG)
            var svg = container
                    .append("g")
                    .attr("id", "choropleth-svg")
                    .attr("transform", `translate(${cfg.padding}, ${cfg.padding})`);

            // Create legend group
            var legend = container.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (cfg.w/2) + "," + (cfg.h - cfg.padding/9) + ")");
            
            var tooltip; // Tooltip container
            drawChart(); // Initial chart draw

            
            const slider = document.getElementById('yearSlider');
            // const year = slider.value;
            // Add slider event for updating the chart based on year
            slider.addEventListener('change', function(event) {

                let year = slider.value;
                get_data_from_year(year).then(function(data) {
                    update_chart(year,data,json); 
                });
            });

            function update_chart(year,data,json){
                Promise.all([data, json]).then(function(values) {
                    var data = values[0];
                    var json = values[1];
                    for (var i = 0; i <data.length; i++) {
                        var dataState = data[i];
                        for (var j = 0; j < json.features.length; j++) {
                            var jsonState = json.features[j];
                            if (jsonState.id === dataState.ISO3) {
                                jsonState.properties.value = +dataState["Exposure Mean"];
                                break;
                            }
                        }
                    }
                    svg.selectAll("path")
                    .data(json.features)
                    .transition()
                    .duration(400)
                    .delay(100)
                    .style("fill", function(d){
                        var value = d.properties.value;
                        if (value) {
                            return color(value);
                        } else {
                            return "#999";
                        }
                    });

                    container.select("#title")
                        .text(`Air Quality (PM25) of World Countries in ${year}`);
                });

            }
            function get_data_from_year(year) {
                //Read the data form CSV file
                return d3.csv('https://huggingface.co/datasets/cos30049-safetywindy/air_quality_health/resolve/main/all_countries_data_processed.csv').then(function(data) {
   
                    var data_in_year = data.filter(function(d) {
                        return d.Year === year;
                    });
                    //Set a range color for each patial
                    color.domain([
                        0.0,
                        100.0
                    ])
                    return data_in_year;
                });
            }

            function drawChart(year = '2020'){
                return get_data_from_year(year).then(function(data){
                    
                    //Specifying the projection and Set the Geometry of the Map
                    Promise.all([data, json]).then(function(values) {
                        
                        var data = values[0];
                        var json = values[1];
                        for (var i = 0; i <data.length; i++) {
                            var dataState = data[i];
                            for (var j = 0; j < json.features.length; j++) {
                                var jsonState = json.features[j];
                                    if (jsonState.id === dataState.ISO3) {
                                    jsonState.properties.value = +dataState["Exposure Mean"];
                                    break;
                                }
                            }
                        }
                        function handleMouseOver(event, d) {
                            tooltip = d3.select("#choropleth")
                            .append("div")
                            .attr("class", "chart-tooltip")
                            // font-family: 'Roboto', sans-serif; /* Apply Roboto only to tooltip */
                            .style("font-family","serif ")
                            .style("position", "absolute")
                            .style("background-color", "rgba(0, 0, 0, 0.75)")
                            .style("color", "white")
                            .style("padding", "6px 8px")
                            .style("border-radius", "4px")
                            .style("pointer-events", "none")
                            .style("opacity", 0);  // Start hidden for smooth fade-in
                            // .style("opacity", 0);
                            var tooltipContent = `
                            <div><strong>Country:</strong> ${d.properties.name}</div>\n
                            <div><strong>PM25:</strong> ${d.properties.value} µg/m3</div><br>
                            <div style="font-size:80%"><strong>Click to see more details for ${d.properties.name} in Bar Chart.</strong></div>
                            <div style="font-size:60%"><strong>Click to set country to Predict</strong></div>`;
                            d3.selectAll(".Country")
                                .transition()
                                .duration(200)
                                .attr("fill","green")
                                .style("opacity", 0.5);
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .style("opacity", 1)
                                .style("stroke", "black");
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(tooltipContent)
                                .style("left", `${event.clientX + 10}px`)  // Position tooltip near cursor
                                .style("top", `${event.pageY}px`)
                                // .style("top", `${event.clientY - cfg.win_h*0.35}px`)
                                .transition()
                                .duration(200)
                                .style("opacity", 0.9);  // Fade in
                        };

                        function handlerMouseOut(event,d){
                
                            d3.selectAll(".Country")
                                .transition()
                                .duration(200)
                                .style("opacity", 0.8);
                            d3.select(this)
                                .transition()
                                .duration(200)
                                .style("stroke", "transparent");
                            tooltip.transition()
                                .duration(cfg.h)
                                .style("opacity", 10);
                            d3.selectAll(".chart-tooltip").remove();
                        }

                        function handlerMouseMove(event){
                            tooltip
                            .style("left", `${event.clientX + 10}px`)  // Position tooltip near cursor
                            .style("top", `${event.clientY - cfg.win_h*0.35}px`)
                        }
                        
                        //Draw the geometry and set its color properties coresponding to the data
                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .attr("class", "country-path")
                            .style("fill", function(d){
                                var value = d.properties.value;
                                if (value) {
                                    return color(value);
                                } else {
                                    return "#999";
                                }
                            })
                            .style("stroke", "#white")
                            .style("stroke-width", 0.5)
                            .style("cursor", "pointer")
                            .style("pointer-events", "all")
                            
                            .on("mouseover", handleMouseOver)
                            .on("mousemove", handlerMouseMove)
                            .on("mouseleave", handlerMouseOut)

                            .on('click', function(event, d) {
                                event.stopPropagation(); // Prevent event bubbling
                                let year = slider.value;
                                let code = d.id;
                                let country = d.properties.name;
                                console.log(`Country clicked! Year: ${year}, Code: ${code}, Country: ${country}`);
                                sendCountryData(year, code, country); 
                            });
                            
                    });
                        //Title
                        container.append("text")
                        .attr("id","title")
                        .style("font-family", "serif ")
                        .attr("x", cfg.w / 2)
                        .attr("y", cfg.padding / 2)
                        .style("opacity", 1)
                        .style("text-anchor", "middle")
                        .style("font-size", `${1.3*cfg.fontSize}rem`) // Set the font size here
                        .text(`Air Quality (pm25) of World Countries in ${year}`);
                        
                        legend.selectAll("rect")
                        .data(color_legend.range().map(function(color) {
                            return {
                                color: color,
                            };
                        }))
                        .enter()
                        .append("rect")
                        .attr("height", cfg.h/27)
                        .attr("x", function(d, i) {
                            return i * (cfg.w/13);
                        })
                        .attr("width", (cfg.w/13-2))
                        .attr("fill", function(d) {
                            return d.color;
                        });
                        legend.selectAll("text")
                        .data(['No data','0-20','21-40','41-60','61-80','81-100'])
                        .enter()
                        .append("text")
                        .attr("y", (-5))
                        .attr("x", function(d, i) {
                            return cfg.w/26+(cfg.w/13)*i;
                        })
                        .style("font-size", `${0.75*cfg.fontSize}rem`)
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d;
                    })
        
                })
            }

        }

        function sendCountryData(year, code, country) {
            console.log("Sending country data:", { year, code, country });
            
            // Create and dispatch the custom event
            const countryClickEvent = new CustomEvent('countryClick', { 
                detail: { year, code, country },
                bubbles: true,
                cancelable: true
            });
            
            document.dispatchEvent(countryClickEvent);
            console.log("Country click event dispatched successfully");
        }
        

        d3.csv('https://huggingface.co/datasets/cos30049-safetywindy/air_quality_health/resolve/main/all_countries_data_processed.csv').then(data => {
            drawChoropleth(data);
        }).catch(error => {
            console.error("Error loading data:", error);
        });

    }, []); // Only run once on component mount

    return (
    <>
        <div id = 'choropleth' ref={containerRef}> </div>
    </>

    
    );

};

export default Choropleth;
