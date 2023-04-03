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

var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv")
    .then(data => {
        
        console.log(data);

        // Define scales
        var xScale = d3.scaleBand()
        .range([ 0, chartWidth ])
        .domain(myGroups)
        .padding(0.01);

        var yScale = d3.scaleBand()
        .range([ chartHeight, 0 ])
        .domain(myVars)
        .padding(0.01);

        chartGroup.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(xScale));

        chartGroup.append("g")
        .call(d3.axisLeft(yScale));


        var color = d3.scaleLinear()
        .range(["white", "#7d911a"])
        .domain([1,100])

        chartGroup.selectAll()
            .data(data, function(d) {return d.group+':'+d.variable;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return xScale(d.group) })
            .attr("y", function(d) { return yScale(d.variable) })
            .attr("width", xScale.bandwidth() )
            .attr("height", yScale.bandwidth() )
            .style("fill", function(d) { return color(d.value)} );

    }).catch(error => console.log(error));


  

