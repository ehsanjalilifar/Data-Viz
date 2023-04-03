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

d3.csv("MOCK_DATA.csv")
    .then(data => {
        // Che ck the data is read correctly
        // console.log(data);

    data.forEach(d => {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.temperature = +d.temperature;
        d.precipitation = +d.precipitation;
    });

    // Setup X and Y scales
    const lonScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.longitude))
                        .range([0, chartWidth]);


    const latScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d.latitude))
                        .range([chartHeight, 0]);

    // Create a color scale
    const zScale = d3.scaleLinear()
                        .range([0, 1])
                        .domain(d3.extent(data, d => d.precipitation));
   
    var contour = d3.contourDensity()
        .x(d => lonScale(d.longitude))
        .y(d => latScale(d.latitude))
        .size([chartWidth, chartHeight])
        .bandwidth(5);

    const contours = contour(data);
    console.log(contours);


        
      chartGroup.selectAll("path")
      .data(contours)
      .join("path")
        .attr("stroke-width", 2)
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round");

    }).catch(error => console.log(error));

