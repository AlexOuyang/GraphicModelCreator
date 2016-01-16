var width = 300,
    height = 300,
    div = d3.select('#chart'),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height),
    rw = 95,
    rh = 95;

var data = [];
for (var k = 0; k < 3; k += 1) {
    data.push(d3.range(3));
}

// Create a group for each row in the data matrix and
// translate the group vertically
var grp = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(0, ' + 100 * i + ')';
    });

// For each group, create a set of rectangles and bind 
// them to the inner array (the inner array is already
// binded to the group)
grp.selectAll('rect')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
        .attr('x', function(d, i) { return 100 * i; })
        .attr('width', rw)
        .attr('height', rh);