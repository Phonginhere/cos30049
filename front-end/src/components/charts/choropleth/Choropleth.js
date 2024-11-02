import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import '../charts/chart_styles.css'; // Import your existing styles if any

const Choropleth = () => {

    const svgRef = useRef();

    const json = d3.json("../HomePage/charts/choropleth/world.json");   

    

    useEffect(() => {
        // Create or update the chart using D3.js
        function drawChoropleth(data){
            
            const color = d3.scaleQuantize()
                    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'])

            const color_legend = d3.scaleQuantize()
                    .range(['#969696','#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'])

            const projection = d3.geoMercator()
                    .center([0,55])
                    .translate([cfg.w/2,cfg.h/2])
                    .scale(cfg.w/7);
            const path = d3.geoPath()
                    .projection(projection);

            var container = d3.select('#choropleth')
                    .append("svg")
                    .attr('id', 'choropleth-container')
            
                    .attr("width", cfg.w)
                    .attr("height", cfg.h);

        }

        d3.csv("../../ProcessedData/all_countries_data_processed.csv").then(data => {
            // Process data and draw chart
            drawChoropleth(data);
        });

    }, []); // Only run once on component mount

    return <svg ref={svgRef} width={600} height={400}></svg>;
};

export default Choropleth;
