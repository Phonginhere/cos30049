import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import '../charts/chart_styles.css'; // Import your existing styles if any

const BarChart = () => {
    const svgRef = useRef();

    useEffect(() => {
        // Create or update the chart using D3.js
        function drawBarChart() {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Clear previous chart

            // Set up chart dimensions and configuration
            const width = 600;
            const height = 400;
            const margin = { top: 20, right: 20, bottom: 50, left: 60 };

            const xScale = d3.scaleBand()
                .domain(causeLabels)
                .range([margin.left, width - margin.right])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, 100]) // Example Y axis max value, adjust as necessary
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Append bars to the chart
            svg.append("g")
                .selectAll("rect")
                .data(data) // Replace with your actual data
                .join("rect")
                .attr("x", (d, i) => xScale(d.CauseName))
                .attr("y", d => yScale(d.BurMean))
                .attr("height", d => yScale(0) - yScale(d.BurMean))
                .attr("width", xScale.bandwidth())
                .attr("fill", d => colorScale(d.CauseName));

            // Add the X and Y axis
            svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "rotate(-25)")
                .style("text-anchor", "end");

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));
        }

        drawBarChart(); // Call function to draw the chart
    }, []); // Only run once on component mount

    return <svg ref={svgRef} width={600} height={400}></svg>;
};

export default BarChart;
