var graph = function (config) {
    var self = this;

    this.graphData = null; // data binds to the graph

    this._directedPath = []; // _directedPath is a list of visited nodes

    this.config = config || {
        dim: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        edge: {
            baseWidth: 2,
            weightWidth: 18,
            defaultColor: "lightsteelblue",
            visitedColor: "steelblue"
        },
        background: {
            grid: false,
            color: "none"
        },
        zoom: true,
        nodeDraggable: false
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
        .style("fill", self.config.background.color)
        .style("pointer-events", "all")
        .on("click", function (d) {
            clearVisitedPath();
        });

    var container = svg.append("g");

    function dataScreening(graphData) {
        // Verifies if each vertex's id matches its position in the array and the weights of all adjacent vertices sum to 1;
        if (graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }
        var weightSum = 0;
        for (var vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            if (graphData[vertexIdx].id != vertexIdx) {
                console.error("Vertex's id must match its position index in the list of vertices");
                console.error(vertexIdx + " th element in the list does not match its position index");
                return;
            }

            var adjVertices = graphData[vertexIdx].adjacentVertex;
            if (adjVertices) {
                for (var i = 0; i < adjVertices.length; i++) {
                    weightSum += adjVertices[i].weight;
                }
                if (weightSum != 1.0) {
                    console.error("The sum of a vertex's adjacent vertice's weight must be 1");
                    console.error(vertexIdx + "th element's adjacent vertices's weight does not sum to 1");
                    return;
                }
            }
            weightSum = 0;
        }
    }


    function createEdgeInGraphData(graphData) {
        // Takes in the graph data, modifies the graphData by adding a list of edges into the graphData and add to self   
        if (graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        // Go through each vertex in graphData and add 'edges' attribute to each vertex
        for (var vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            var currentVertex = graphData[vertexIdx];
            if (!currentVertex.adjacentVertex) {
                currentVertex.edges = null;
            } else {
                currentVertex.edges = [];
                for (var adjVertexIdx = 0; adjVertexIdx < currentVertex.adjacentVertex.length; adjVertexIdx++) {
                    var targetVertexId = currentVertex.adjacentVertex[adjVertexIdx].id;
                    var targetVertexWeight = currentVertex.adjacentVertex[adjVertexIdx].weight;
                    var edge = {};
                    edge.edgeWeight = targetVertexWeight;
                    edge.edgeNodes = [currentVertex, graphData[targetVertexId]];
                    currentVertex.edges.push(edge);
                }
            }
        }

        // Add the graphData as a class attribute
        self.graphData = graphData;
    };


    function traverseGraph(vertexId) {
        // Takes in the id of a node and traverse trough the graph to connect impacted nodes
        // Returns the id of the visited node

        function chooseRandomAdjVertex(vertex) {
            // Takes in a vertex and choose a random adjacent vertex in the next layer based on the edge weights 
            var weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
            var weight = 0;
            for (var i = 0; i < vertex.adjacentVertex.length; i++) {
                weight += vertex.adjacentVertex[i].weight
                weightDistribution.push(weight);
            }

            var randomPick = Math.random();
            console.log("weight distribution corresponding to adjacent vertices in the next layer: (" + weightDistribution + ") random pick: " + randomPick);
            for (var i = 0; i < weightDistribution.length - 1; i++) {
                if (randomPick >= weightDistribution[i] && randomPick <= weightDistribution[i + 1]) {
                    return vertex.adjacentVertex[i].id;
                }
            }
        }

        var visitedNodes = [vertexId];
        var node = self.graphData[vertexId];
        while (node.adjacentVertex) {
            console.log("Current Vertex: " + vertexId);
            var vertexId = chooseRandomAdjVertex(node);
            console.log("Vextex chosen: " + vertexId);
            console.log("--------");
            node = self.graphData[vertexId];
            visitedNodes.push(vertexId);
        }

        self._directedPath = visitedNodes;
    }



    function drawGrid() {
        // Draws the axis in the background
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

    this.drawVertices = function () {
        // clear vertices then redraw all the vertices in the grpah
        d3.selectAll(".vertex").remove();

        var vertices = container.append("g")
            .attr("class", "vertex")
            .selectAll("circle")
            .data(data).enter()
            .append("g")
            .attr("id", function (d) {
                return d.id;
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).call(drag);

        vertices.append("circle")
            .attr("class", "node")
            .attr("class", function (d) {
                // if the node is in the path then draw it in a different color
                if (self._directedPath.indexOf(d.id) > -1) {
                    return "visitedVertex";
                }
            })
            .attr("r", function (d) {
                return d.r;
            });

        // Add a text element to the previously added g element.
        vertices.append("text")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.id;
            });

    }

    this.drawEdges = function () {
        // clear edges then redraw all the edges in the graph
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
        var drawLine = function (edgeNodes, edgeWeight) {
            // Takes in two nodes and draw a line between them based on the edge weight

            // If the edge is in the _directedPath then draw different color
            if (self._directedPath.indexOf(edgeNodes[0].id) > -1 && self._directedPath.indexOf(edgeNodes[1].id) > -1) {
                container.append("svg:path")
                    .attr("d", line(edgeNodes))
                    .style("stroke-width", self.config.edge.baseWidth + edgeWeight)
                    .style("stroke", self.config.edge.visitedColor)
                    .style("fill", "none");
            } else {
                container.append("svg:path")
                    .attr("d", line(edgeNodes))
                    .style("stroke-width", self.config.edge.baseWidth + edgeWeight)
                    .style("stroke", self.config.edge.defaultColor)
                    .style("fill", "none");
            }

        }

        // Draw each vertex's edges based on weight
        if (self.graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }
        for (var vertexIdx = 0; vertexIdx < self.graphData.length; vertexIdx++) {
            var currentVertex = self.graphData[vertexIdx];
            if (currentVertex.edges) {
                for (var edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    var edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    var edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * self.config.edge.weightWidth;
                    drawLine(edgeNodes, edgeWeight);
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
        var clickedVertexId = parseInt(this.id);
        traverseGraph(clickedVertexId);
        self.draw();

        // testing 
        $('.path strong').text(self._directedPath);
    }

    function drag(d) {
        if (self.config.nodeDraggable) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            self.draw();
        }
    }

    function dragend(d) {
        d3.select(this).classed("dragging", false);
    }


    function clearVisitedPath() {
        self._directedPath = [];
        self.draw();
    }

    // Used to redraw the graph on start and when moving
    this.draw = function () {
        self.drawEdges();
        self.drawVertices();
    };

    // Used to bind the data to the graph and render the graph
    this.bind = function (graphData) {
        dataScreening(graphData);
        createEdgeInGraphData(graphData);
        if (self.config.background.grid) drawGrid();
        self.draw();
    };

};