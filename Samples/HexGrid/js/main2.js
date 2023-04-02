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

var svg = d3.select('body').append('svg')
.attr('width', svgWidht)
.attr('height', svgHeight);

// create group
// Translate it to the right and down
chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.json("gz_2010_us_040_00_500k.json")
    .then(geoData => {
        console.log(geoData);

        // Define the projection and path generator required for the map
        const projection = d3.geoAlbers().fitSize([chartWidth, chartHeight], geoData);
        const pathGenerator = d3.geoPath().projection(projection); // We need to path an object of type "geometry" to it

        // const geo = geoData.features.geometry; // Extract the geometry

        // Produce and configure the hexgrid instance
        // If the longitude and latitude have some user defined names use #hexgrid.geoKeys([keys])
        const hexgrid = d3.hexgrid()
        .extent([chartWidth, chartHeight])
        .geography(geoData)
        .projection(projection)
        .pathGenerator(pathGenerator)
        .hexRadius(5);

        d3.csv("MOCK_DATA.csv")
            .then(data => {

                data.forEach(d => {
                    d.latitude = +d.latitude;
                    d.longitude = +d.longitude;
                    d.temperature = +d.temperature;
                    d.precipitation = +d.precipitation;
                });

                // Get the hexbin generator and the layout
                const hex = hexgrid(data, ['temperature', 'precipitation']);

                // Create a color scale
                // const colorScale = d3.scaleSequential(d3.interpolateViridis)
                //                         .domain([...hex.grid.extentPointDensity].reverse());
                const colorScale = d3.scaleSequential(d3.interpolateViridis)
                                        .domain([0, 5].reverse());

                // Draw the hexes
                chartGroup.selectAll('.hex')
                    .data(hex.grid.layout)
                    .enter()
                    .append('path')
                    .attr('class', 'hex')
                    .attr('d', hex.hexagon())
                    .attr('transform', d => `translate(${d.x}, ${d.y})`)
                    .style('fill', d => !d.datapoints ? '#bbb' : colorScale(d.datapoints));

            }).catch(error => console.log(error));
        
    }).catch(error => console.log(error));

// If your code does not work or show the result properly
    // 1. Double check all spellings
    // 2. Double check the projection method