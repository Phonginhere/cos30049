import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import all_countries_data_processed from '../../ProcessedData/all_countries_data_processed.csv';
import world from './world.json';
import MouseHandler from '../../mouse_move/MouseHandler';
import '../chart_styles.css';
import './choropleth_additional_styles.css'; // Import additional styles for the form

const Choropleth = () => {
    const containerRef = useRef();
    const { mouse_x, mouse_y } = MouseHandler();
    const json = world;
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
    const [formState, setFormState] = useState({
        visible: false,
        country: '',
        code: '',
        year: '',
    });

    const cfg = {
        w: window.innerWidth * 0.43,
        h: (window.innerWidth * 0.43) * 0.7,
        h2: window.innerHeight * 0.72,
        win_h: window.screen.height,
        padding: window.innerWidth / 13,
        fontSize: (window.innerWidth * 0.43) / 700,
    };

    useEffect(() => {
        // Clear existing SVG before appending
        d3.select(containerRef.current).select("#choropleth-container").remove();

        // Create or update the chart using D3.js
        function drawChoropleth(initial_data) {
            const color = d3.scaleQuantize()
                .range(['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']);

            const color_legend = d3.scaleQuantize()
                .range(['#969696', '#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']);

            const projection = d3.geoMercator()
                .center([0, 55])
                .translate([cfg.w / 2, cfg.h / 2])
                .scale(cfg.w / 7);
            const path = d3.geoPath()
                .projection(projection);

            var container = d3.select(containerRef.current)
                .append("svg")
                .attr('id', 'choropleth-container')
                .attr("width", cfg.w)
                .attr("height", cfg.h);

            var svg = container
                .append("g") // Changed from svg to g for proper transformation
                .attr("id", "choropleth-svg")
                .attr("transform", `translate(${cfg.padding}, ${cfg.padding})`);

            var legend = container.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${cfg.w / 2 - 100}, ${cfg.h - cfg.padding / 2})`);

            const slider = document.getElementById('yearSlider');
            if (slider) {
                slider.addEventListener('change', function (event) {
                    let year = slider.value;
                    get_data_from_year(year).then(function (data) {
                        update_chart(year, data, json);
                    });
                });
            }

            function update_chart(year, data, json) {
                Promise.all([Promise.resolve(data), Promise.resolve(json)]).then(function (values) {
                    var data = values[0];
                    var json = values[1];
                    for (var i = 0; i < data.length; i++) {
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
                        .style("fill", function (d) {
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
                // Read the data from CSV file
                return d3.csv(all_countries_data_processed).then(function (data) {
                    var data_in_year = data.filter(function (d) {
                        return d.Year === year;
                    });
                    // Set a range color for each partial
                    color.domain([0.0, 100.0]);
                    return data_in_year;
                });
            }

            function drawChart(year = '2020') {
                return get_data_from_year(year).then(function (data) {
                    Promise.all([Promise.resolve(data), Promise.resolve(json)]).then(function (values) {
                        var data = values[0];
                        var json = values[1];
                        for (var i = 0; i < data.length; i++) {
                            var dataState = data[i];
                            for (var j = 0; j < json.features.length; j++) {
                                var jsonState = json.features[j];
                                if (jsonState.id === dataState.ISO3) {
                                    jsonState.properties.value = +dataState["Exposure Mean"];
                                    break;
                                }
                            }
                        }

                        // Draw the geometry and set its color properties corresponding to the data
                        svg.selectAll("path")
                            .data(json.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .attr("class", "Country") // Add class for selection
                            .style("fill", function (d) {
                                var value = d.properties.value;
                                if (value) {
                                    return color(value);
                                } else {
                                    return "#999";
                                }
                            })
                            .style("opacity", 0.8)
                            .on("mouseover", handleMouseOver)
                            .on("mousemove", handlerMouseMove)
                            .on("mouseleave", handlerMouseOut)
                            .on('click', function (event, d) {
                                let year = slider ? slider.value : '2020';
                                let code = d.id;
                                let country = d.properties.name;
                                console.log(`Send Data: ${year}, ${code}, ${country}`);
                                // Instead of dispatching an event, update React state
                                setFormState({
                                    visible: true,
                                    country: country,
                                    code: code,
                                    year: year,
                                });
                            });

                        // Title
                        container.append("text")
                            .attr("id", "title")
                            .style("font-family", "serif ")
                            .attr("x", cfg.w / 2)
                            .attr("y", cfg.padding / 2)
                            .style("opacity", 1)
                            .style("text-anchor", "middle")
                            .style("font-size", `${1.3 * cfg.fontSize}rem`) // Set the font size here
                            .text(`Air Quality (PM25) of World Countries in ${year}`);

                        // Legend
                        const legendWidth = 200;
                        const legendHeight = 10;

                        const legendScale = d3.scaleLinear()
                            .domain(color.domain())
                            .range([0, legendWidth]);

                        const legendAxis = d3.axisBottom(legendScale)
                            .ticks(5)
                            .tickFormat(d => d);

                        const legendGradientId = "legend-gradient";

                        // Define gradient
                        const defs = container.append("defs");
                        const linearGradient = defs.append("linearGradient")
                            .attr("id", legendGradientId);

                        linearGradient.selectAll("stop")
                            .data(color.range().map((d, i) => ({
                                offset: `${(i / (color.range().length - 1)) * 100}%`,
                                color: d
                            })))
                            .enter().append("stop")
                            .attr("offset", d => d.offset)
                            .attr("stop-color", d => d.color);

                        // Draw the rectangle and fill with gradient
                        legend.append("rect")
                            .attr("width", legendWidth)
                            .attr("height", legendHeight)
                            .style("fill", `url(#${legendGradientId})`);

                        // Draw the axis
                        legend.append("g")
                            .attr("transform", `translate(0, ${legendHeight})`)
                            .call(legendAxis)
                            .select(".domain").remove();
                    });
                });
            }

            function handleMouseOver(event, d) {
                let tooltipContent = `
                    <div><strong>Country:</strong> ${d.properties.name}</div>
                    <div><strong>PM25:</strong> ${d.properties.value} µg/m3</div><br>
                    Click to see PM25 details for ${d.properties.name}.<br>
                    (Distribution and Bar Chart)
                `;
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .attr("fill", "green")
                    .style("opacity", 0.5);
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black");

                // Create tooltip
                d3.select("#choropleth")
                    .append("div")
                    .attr("class", "chart-tooltip")
                    .html(tooltipContent)
                    .style("left", `${event.clientX + 10}px`)
                    .style("top", `${event.clientY + 10}px`)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9);
            }

            function handlerMouseOut(event, d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .attr("fill", function () {
                        var value = d.properties.value;
                        if (value) {
                            return color(value);
                        } else {
                            return "#999";
                        }
                    });
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke", "transparent");
                d3.selectAll(".chart-tooltip").remove();
                setTooltip({ visible: false, x: 0, y: 0, content: '' });
            }

            function handlerMouseMove(event) {
                setTooltip(tooltip => ({
                    ...tooltip,
                    x: event.clientX + 10,
                    y: event.clientY + 10
                }));
            }

            drawChart();
        }

        d3.csv(all_countries_data_processed).then(data => {
            console.log("Data loaded:", data);
            drawChoropleth(data);
        }).catch(error => {
            console.error("Error loading data:", error);
        });

    }, []); // Only run once on component mount

    const handleFormClose = () => {
        setFormState({
            visible: false,
            country: '',
            code: '',
            year: '',
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const formData = new FormData(e.target);
        const pm25 = formData.get('pm25');
        const description = formData.get('description');
        console.log("Form submitted:", { ...formState, pm25, description });
        // You can add further processing here (e.g., sending data to a server)
        // Close the form after submission
        handleFormClose();
    };

    return (
        <>
            <div id='choropleth' ref={containerRef} style={{ position: 'relative' }}>
                {/* The choropleth map will be rendered here */}
            </div>
            {formState.visible && (
                <div className="country-form-overlay">
                    <div className="country-form-container">
                        <button className="close-button" onClick={handleFormClose}>×</button>
                        <h2>Details for {formState.country}</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="pm25">PM25 Exposure:</label>
                                <input
                                    type="number"
                                    id="pm25"
                                    name="pm25"
                                    defaultValue={0}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Choropleth;
