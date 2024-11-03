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


function bar_chart(){
    // Clear the existing chart if exist
    d3.select("#plot").remove();
    d3.select("#density").remove();
    d3.select("#barchart").remove();

    // Initialize the configuration of dimension
    var cfg = {
        w: window.innerWidth*0.4,
        h: window.innerWidth*0.2,
        h2: (window.innerHeight*0.86),
        padding: window.innerWidth*0.04,
        radius: window.innerWidth*0.4*0.0066666,
        border: 1,
        fontSize: window.innerWidth*0.4/600 //rem
    };

    createBarSection();
    createPollutantOption();
    // Initialize container for barchart
    var container = d3.select('#barchart')
        .append('svg')
        .attr('id', 'barchart-container')
        .attr("width", cfg.w+2*cfg.padding)
        .attr("height", cfg.h+2*cfg.padding);

    var svg;

    // Initialize Scale of chart
    var xScale = d3.scaleBand();
    var yScale = d3.scaleLinear();



    // Get value from Year Slider
    var slider = document.getElementById('yearSlider');
    var pollutant_option = document.getElementById('pollutant_option');
    var lastClickedCountry = null;
    var pollutant_change = null;
    var year_slider = null;

    // Initialize Chart Variables
    const year = slider.value;                  // Get year from slider value
    const country = 'WORLD';                    // Default country for chart
    const pollutant = pollutant_option.value;   //Default pollutant from option

    draw_barchart(year,country,pollutant);

    // Listen for the custom event 'countryClick'
    document.addEventListener('countryClick', function(event) {
        let { year, code, country } = event.detail;
        lastClickedCountry = code;  // Update the last clicked country
        pollutant_change = pollutant_option.value;
        year_slider = slider.value;
        country = lastClickedCountry
        update_chart(year_slider, lastClickedCountry, pollutant_change);
    });

    // Update on Slider change
    slider.addEventListener('input', function() {
        year_slider = slider.value;
        pollutant_change = pollutant_option.value;
        if (lastClickedCountry != null){
            update_chart(year_slider, lastClickedCountry, pollutant_change);
        }else{
            update_chart(year_slider,country,pollutant_change);
        };
        
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






    function update_chart(year, country, pollutant) {

        return filter_data(year, country, pollutant).then(function(data){

            xScale.domain((data.map(d => d.CauseName)).sort());
            // yScale.domain([0, d3.max(data, d => d.BurMean) * 1.2]);
            maxDomainYAxis = d3.max(data, function(d) {return d.BurMean;});
            yScale.domain([0, Math.ceil(maxDomainYAxis / 100) * 100+ maxDomainYAxis/5]);

            // container.select(".x-axis").remove();
            // container.select(".y-axis").remove();
            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);


            container.select(".x-axis").transition().duration(700).call(xAxis);
            container.select(".y-axis").transition().duration(700).call(yAxis);

            container.select("#chart-title").remove();
            container.append("text")
                .attr("x", cfg.w / 2)
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
                .attr("x", function(d) { return xScale(d.CauseName)+ xScale.bandwidth()*0.29; })
                .attr("y", function(d) { return yScale(d.BurMean)-cfg.padding; })
                .attr("width", xScale.bandwidth() * 0.4)
                .attr("height", function(d) { return cfg.h - yScale(d.BurMean); })
                .attr("fill", d => colorScale(d.CauseName))
                // 
                .transition()
                .duration(500)

                bars.exit().remove();
        });
        
    }

    function filter_data(year,country_code,pollutant){
        return d3.csv("../HomePage/Processed_Data/air_quality_health.csv", function(d){
            return{
                Country_code: d.ISO3,
                Country: d.Country,
                Year: +d.Year,
                Pollutant: d.Pollutant,
                ExpMean: +d['Exposure Mean'],
                CauseName: d.Cause_Name,
                BurMean: +d['Burden Mean']
            }
        }).then(function(dataset){
            const datafilterpollutant = dataset.filter(function(d) {
                return (d.Country_code == country_code && d.Year == year && d.Pollutant == pollutant && d.CauseName != 'All causes');
            });
            
            return datafilterpollutant
        });
    };
    
    function draw_barchart(year, country_code, pollutant){
        return filter_data(year,country_code,pollutant).then(function(data){
            //Configuring X Scale
            xScale.range([cfg.padding,cfg.w-cfg.padding])
                .domain((data.map(d => d.CauseName)).sort())
                // .domain(causeLabels)

                .padding(0.2);

            colorScale.domain(data.map(d => d.CauseName));

            //Configuring Y Scale
            maxDomainYAxis = d3.max(data, function(d) {return d.BurMean;});
            yScale.range([cfg.h, 0])
                .domain([0, Math.ceil(maxDomainYAxis / 100) * 100+ maxDomainYAxis/5]);

            svg = container 
                .append("svg")
                .attr('id', 'bar-svg')
                .attr('x',0)
                .attr('y',cfg.padding)
                .attr("width", cfg.w)
                .attr("height", cfg.h+cfg.padding);
            
            var xAxis = svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate("+0+"," + (cfg.h - cfg.padding) + ")")
                .transition().duration(700);
            xAxis.call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "translate(-10,10)rotate(-25)")
                .style("text-anchor", "end");


            var yAxis = d3.axisLeft(yScale);
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", "translate(" + cfg.padding + ","+ -cfg.padding+")")
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
                .attr("x", cfg.w / 2)
                .attr("y", cfg.padding / 2)
                .attr("id", "chart-title")
                .style("text-anchor", "middle")
                .style("font-size", `${1.2*cfg.fontSize}rem`) // Set the font size here
                .text(title_name(pollutant, data[0].Country, year));


            var barchart = svg.append("g")
                .selectAll("#bar-svg")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) { return xScale(d.CauseName)+ xScale.bandwidth()*0.29; })
                .attr("y", function(d) { return yScale(d.BurMean)-cfg.padding; })
                .attr("width", xScale.bandwidth() * 0.4)
                .attr("height", function(d) { return cfg.h - yScale(d.BurMean); })
                // .attr("fill", "#69b3a2");
                .attr("fill", function (d) { return colorScale(d.CauseName); });

            barchart.selectAll("label")
                .data(data)
                .enter()
                .append("text")
                .attr("x", function(d) { return xScale(d.CauseName) + xScale.bandwidth() / 2; })
                .attr("y", function(d) { return yScale(d.BurMean); })
                .style("text-anchor", "middle")
                .style("font-size", "10px");

             // Create legend with IBM colors
            var legend = container.append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${cfg.w - cfg.padding*1.2}, 20)`);

            legend.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", d => colorScale(d.CauseName));

            legend.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("x", 24)
                .attr("y", (d, i) => i * 20 + 14)
                .text(d => d.CauseName)
                .style("font-size", "12px");
        })


    }   //End of draw_barchart()

    

} //End of bar_chart()

function title_name(pollutant_option, country, year) {
    var pollutant;
    if (pollutant_option == 'pm25') {
        pollutant = 'PM25';
    }
    else if (pollutant_option == 'no2') {
        pollutant = 'NO2';
    }
    else if (pollutant_option == 'ozone') {
        pollutant = 'Ozone';
    }
    else if (pollutant_option == 'hap') {
        pollutant = "HAP";
    }

    return `Burden of disease to ${pollutant} of ${country} in ${year}`;
}

function createBarSection(){
    d3.select("#right-container")
        .append("div")  
        .attr("id", "barchart");
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