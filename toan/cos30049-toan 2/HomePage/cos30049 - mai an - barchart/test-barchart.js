var country = 'Afghanistan';
d3.select('#barchart #CountryName')
    .text(country);

var pollutant = document.getElementById('dropdown-pollutant');

pollutant.addEventListener('input', changePollutant);
console.log(pollutant)
d3.select("#dropdown-pollutant")
    .on("change", function(d) {
        var selectedPollutant = d3.select(this).property("value");
        // console.log(selectedPollutant);
        updatePollutant(selectedPollutant);
    });

d3.csv("air_quality_health.csv", function(d) {
    return {
    Country: d.Country,
    Year: +d.Year,
    Pollutant: d.Pollutant,
    ExpMean: +d['Exposure Mean'],
    CauseName: d.Cause_Name,
    BurMean: +d['Burden Mean'],
    }
}
).then(function (dataset) {
    datafilterpollutant = dataset.filter(function(d) {
        return (d.Country == country && d.Pollutant == pollutant.value && d.CauseName != 'All causes');
    })
    // console.log(datafilterpollutant);
    var maxDomainYAxis = d3.max(datafilterpollutant, function(d) {return d.BurMean;});
    d3.selectAll('svg').remove();
    drawBarChart(datafilterpollutant, maxDomainYAxis);

});

function changePollutant(update = false) {
    let newPollutant = pollutant.value;
    if (update == true) {
    }
    else {
        return newPollutant;
    }
}

function updatePollutant(pollutant) {
    // console.log(pollutant);
    d3.csv("air_quality_health.csv", function(d) {
        return {
        Country: d.Country,
        Year: +d.Year,
        Pollutant: d.Pollutant,
        ExpMean: +d['Exposure Mean'],
        CauseName: d.Cause_Name,
        BurMean: +d['Burden Mean'],
        }
    }
    ).then(function (dataset) {
        datafilterpollutant = dataset.filter(function(d) {
            return (d.Country == country && d.Pollutant == pollutant && d.CauseName != 'All causes');
        })
        maxDomainYAxis = d3.max(datafilterpollutant, function(d) {return d.BurMean;});
        d3.selectAll('svg').remove();
        drawBarChart(datafilterpollutant, maxDomainYAxis);

    })
};

function drawBarChart(dataset, maxDomainYAxis) {
    var years = dataset.map(function(d) {return d.Year;});
    
    function unique(value, index, array) {
        return array.indexOf(value) == index;
    }

    years = years.filter(unique);
    // console.log(years);
    var year = d3.max(years);

    var slider = d3.sliderHorizontal()
                    .min(d3.min(years))
                    .max(d3.max(years))
                    .ticks(years.length)
                    .tickValues(years)
                    .step(1)
                    .width(620)
                    .displayValue(true)
                    .value(d3.max(years))
                    .on('onchange', (val) => {
                            d3.select('#value').text(val);
                            // console.log(slider.value());
                            year = slider.value();
                            updateYear(year);
                    });

    d3.select('#barchart #slider-year')
        .append('svg')
        .attr('width', 650)
        .attr('height', 38)
        .append('g')
        .attr('transform', 'translate(15,6)')
        .call(slider);

    var datafilteryear = dataset.filter(function(d) {
        return (d.Year == year);
    }); 
    
    datafilteryear = datafilteryear.slice().sort((a,b) => d3.ascending(a.CauseName, b.CauseName));
    
    // console.log(datafilteryear);

    // BarChart(datatest);

    margin = {top: 10, right: 10, bottom: 200, left: 50}
    height = 500 - margin.top - margin.bottom;
    width = 500 - margin.right - margin.left;

    // append the svg object to the body of the page
    var svg = d3.select("#barchart #visualisation")
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // X axis
    var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(datafilteryear.map(function(d) { return d.CauseName; }))
            .padding(0.2);
            
    var xAxis = svg.append("g")
                    .attr("transform", "translate(0," + height + ")");
    xAxis.call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,10)rotate(-90)")
        .style("text-anchor", "end");

        // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, Math.ceil(maxDomainYAxis / 100) * 100])
        .range([height, 0]);

    var yAxis = svg.append("g");
    yAxis.call(d3.axisLeft(y).ticks(5));

        // Bars
    var barchart = svg.append("g");
    
    barchart.selectAll("mybar")
        .data(datafilteryear)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.CauseName); })
        .attr("y", function(d) { return y(d.BurMean); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.BurMean); })
        .attr("fill", "#69b3a2");

    barchart.selectAll("label")
        .data(datafilteryear)
        .enter()
        .append("text")
        .text(function (d) { return Math.round(d.BurMean * 100) / 100; })
        .attr("x", function(d) { return x(d.CauseName) + x.bandwidth() / 2; })
        .attr("y", function(d) { return y(d.BurMean); })
        .style("text-anchor", "middle")
        .style("font-size", "10px");

    function updateYear(year) {
        datachangeyear = dataset.filter(function(d) {
            return (d.Year == year);
        }); 
        
        // console.log(datachangeyear);

        barchart.selectAll("rect")
            .data(datachangeyear, d => d.CauseName)
            .transition()
            .duration(500)
            .attr("y", function(d) { return y(d.BurMean); })
            .attr("height", function(d) { return height - y(d.BurMean); });

        barchart.selectAll("text")
            .data(datachangeyear, d => d.CauseName)
            .transition()
            .duration(500)
            .text(function (d) { return Math.round(d.BurMean * 100) / 100; })
            .attr("x", function(d) { return x(d.CauseName) + x.bandwidth() / 2; })
            .attr("y", function(d) { return y(d.BurMean); });
    }
}