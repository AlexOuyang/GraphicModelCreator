var graph = function (config) {
    var self = this;

    this.config = config || {
        dim: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        edge: {
            defaultWidth: 2,
            defaultColor: "steelblue"
        },
        zoom: true,
        nodeDraggable: true
    };

    var margin = {
            top: -5,
            right: -5,
            bottom: -5,
            left: -5
        },
        width = self.config.dim.width - margin.left - margin.right,
        height = self.config.dim.height - margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("dragstart", dragstart)
        .on("drag", drag)
        .on("dragend", dragend);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(zoom);

    var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");

    var container = svg.append("g");



    function createEdgeInGraphData(graphData) {
        // modifies the graphData by adding a list of edges into the graphData and add as an attributes of the graph   
        if (graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        for (var vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            var currentVertex = graphData[vertexIdx];
            if (!currentVertex.adjacentVertex) {
                currentVertex.edge = null;
            } else {
                currentVertex.edge = [];
                for (var adjVertexIdx = 0; adjVertexIdx < currentVertex.adjacentVertex.length; adjVertexIdx++) {
                    var targetVertexId = currentVertex.adjacentVertex[adjVertexIdx].id
                    var edge = [currentVertex, graphData[targetVertexId]];
                    currentVertex.edge.push(edge);
                }
            }
        }

        self.graphData = graphData;
        console.log(graphData);
    };




    function drawAxis() {
        container.append("g")
            .attr("class", "x axis")
            .selectAll("line")
            .data(d3.range(0, width, 10))
            .enter().append("line")
            .attr("x1", function (d) {
                return d;
            })
            .attr("y1", 0)
            .attr("x2", function (d) {
                return d;
            })
            .attr("y2", height);

        container.append("g")
            .attr("class", "y axis")
            .selectAll("line")
            .data(d3.range(0, height, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", function (d) {
                return d;
            })
            .attr("x2", width)
            .attr("y2", function (d) {
                return d;
            });
    }

    function drawVertices() {
        // clear vertices then redraw
        d3.selectAll(".vertex").remove();

        var vertices = container.append("g")
            .attr("class", "vertex")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .call(drag);
    }

    function drawEdges() {
        // clear edges then redraw
        d3.selectAll("path").remove();

        // Specify the function for generating path data             
        var line = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");
        // "linear" for piecewise linear segments
        // Creating path using data in pathinfo and path data generator
        // d3line.
        var drawLine = function (edge) {
            container.append("svg:path")
                .attr("d", line(edge))
                .style("stroke-width", self.config.edge.defaultWidth)
                .style("stroke", self.config.edge.defaultColor)
                .style("fill", "none");
        }

        // Draw each vertex's edges 
        if (self.graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }
        for (var vertexIdx = 0; vertexIdx < self.graphData.length; vertexIdx++) {
            var currentVertex = self.graphData[vertexIdx];
            if (currentVertex.edge) {
                for (var edgeIdx = 0; edgeIdx < currentVertex.edge.length; edgeIdx++) {
                    var edge = currentVertex.edge[edgeIdx];
                    console.log(edge)
                    drawLine(edge);
                }
            }
        }

    }


    function zoomed() {
        if (self.config.zoom) container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function dragstart(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }

    function drag(d) {
        if (self.config.nodeDraggable) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            myGraph.draw();
        }

    }

    function dragend(d) {
        d3.select(this).classed("dragging", false);
    }



    this.draw = function () {
        drawEdges();
        drawVertices();
    };


    this.bind = function (graphData) {
        createEdgeInGraphData(graphData);
        drawAxis();
        self.draw();
    };

};