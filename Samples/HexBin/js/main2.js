var svgHeight = 1000;
var svgWidht = 1000;

var chartMargin = {
    top: 50,
    right: 50,
    bottom: 50,
    left:50
}

var chartWidth = svgWidht - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.bottom - chartMargin.top;

var svg = d3.select('body').append('svg')
.attr('width', svgWidht)
.attr('height', svgHeight);

// create group
// Translate it to the right and down
chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// Define the projection and path generator required for the map
// const projection = d3.geoAlbers().fitSize([chartWidth, chartHeight]);
const projection = d3.geoAlbers()
                        .translate([chartWidth / 2, chartHeight / 2])
                        .scale(120);


d3.csv("MOCK_DATA.csv")
    .then(data => {
        console.log(data);

        data.forEach(d => {
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
            d.temperature = +d.temperature;
            d.precipitation = +d.precipitation;
        });

        var radiusScale = d3.scaleSqrt().domain([0, 1000]).range([0, 30]);

        // Produce and configure the hexbin instance
        var hexbin = d3.hexbin()
            .extent([[0,0], [chartWidth, chartHeight]]).radius(10);
            // .radius(d => radiusScale(d.length));

        // Convert the lon lat to pixle coordinate to show on the screen
        var points = data.map(d => projection([d.longitude, d.latitude]));

        // Generate the hexbins
        var bins = hexbin(points);

        console.log(bins.map(d => d.length));

        
        var color = d3.scaleSequential(d3.extent(data, d => d.precipitation), d3.interpolateSpectral);

        // Draw the hexes
        chartGroup.selectAll('.hex')
            .data(bins)
            .enter()
            .append('path')
            .attr('class', 'hex')
            .attr('d', d => hexbin.hexagon(d.length / 2))
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('fill', d => color(d.length));

        //  chartGroup.selectAll(".bin")
        //     .data(bins)
        //     .enter().append("path")
        //     .attr("class", "bin")
        //     .attr("transform", function(d) { return "translate(" + hexbin.x()(d) + "," + hexbin.y()(d) + ")"; });


    }).catch(error => console.log(error));
        

// If your code does not work or show the result properly
    // 1. Double check all spellings
    // 2. Double check the projection method