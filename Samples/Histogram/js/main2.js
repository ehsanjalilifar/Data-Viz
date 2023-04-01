var svgHeight = 600;
var svgWidht = 800;

var chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left:50
}

var chartWidth = svgWidht - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.bottom - chartMargin.top;

// var shiftRight = 0;

var svg = d3.select('body').append('svg')
.attr('width', svgWidht)
.attr('height', svgHeight);

// create group
// Translate it to the right and down
chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("MOCK_DATA.csv")
    .then(data => {
        // Che ck the data is read correctly
        console.log(data);

    data.forEach(d => {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.temperature = +d.temperature;
        d.precipitation = +d.precipitation;
    });

    // Setup X and Y scales
    const xScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.temperature))
                        .range([0, chartWidth]);

    console.log(xScale.domain());

    const yScale = d3.scaleLinear()
                        .range([chartHeight, 0]);

    // Create histogram generator
    const histogram = d3.histogram()
                            .value(d => d.temperature)
                            .domain(xScale.domain())
                            .thresholds(10); // Number of bins

    const bins = histogram(data);

    console.log(d3.count(bins, d => d.x0));

    // After creating the bins we know the range of the data in y axis
    yScale.domain([0, d3.max(bins, d => d.length)]);

    // Draw bars
    chartGroup.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.x0) + 2)
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 2)
        .attr("height", d => chartHeight - yScale(d.length))
        .attr("fill", "steelBlue")

    // Add X axis label
    chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(xScale));

    // Add Y axis label
    chartGroup.append("g")
    .call(d3.axisLeft(yScale));

    }).catch(error => console.log(error));

