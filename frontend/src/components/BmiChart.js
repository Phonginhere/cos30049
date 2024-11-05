// src/components/BmiChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BmiChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        // Select the SVG element and clear any previous content
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous content

        // Set dimensions for the chart
        const width = 400;
        const height = 200;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };

        // Define the scale for x-axis and y-axis
        const x = d3.scaleBand()
            .domain(data.map((d, i) => i)) // Assuming data is an array of values
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data)]) // Maximum value in data
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Append bars to the chart
        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d))
            .attr("height", d => y(0) - y(d))
            .attr("width", x.bandwidth());

        // Add the x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => `Data ${i + 1}`).tickSizeOuter(0));

        // Add the y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());

    }, [data]); // Re-run the effect if data changes

    return <svg ref={svgRef} width={400} height={200}></svg>;
};

export default BmiChart;
