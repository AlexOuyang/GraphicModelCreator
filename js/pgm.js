/*  jshint undef:true
    global $:false, jQuery:false, d3:false
*/

/* This is the probabilistic graphic model */

var graph = function (graphConfiguration) {
    "use strict";

    var graphData = [], // data binds to the graph
        clusterMat = [], // data specifies the number of nodes each layer
        directedPath = [], // directedPath is a list of visited nodes
        config = graphConfiguration || {
            dim: {
                width: window.innerWidth,
                height: window.innerHeight - 120
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
        },
        margin = {
            top: -5,
            right: -5,
            bottom: -5,
            left: -5
        },
        width = config.dim.width - margin.left - margin.right,
        height = config.dim.height - margin.top - margin.bottom,

        // Zoom behavior
        zoom = d3.behavior.zoom().scaleExtent([1, 10])
        .on("zoom", function () {
            if (config.zoom) {
                container.attr(
                    "transform",
                    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
                );
            }
        }),

        // Dragging nodes behavior
        drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("dragstart", function (d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
            var clickedVertexId = parseInt(this.id, 10);
            traverseGraph(clickedVertexId);
            drawGraph();

            // testing 
            $('.path strong').text(directedPath);
        }),

        svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        .call(zoom),

        rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", config.background.color)
        .style("pointer-events", "all")
        .on("click", function (d) {
            clearVisitedPath();
        }),

        container = svg.append("g");

    function dataScreening(graphData) {

        // Verifies if each vertex's id matches its position in the array 
        // and the weights of all adjacent vertices sum to 1;

        if (graphData.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        let weightSum = 0;

        for (let vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            if (graphData[vertexIdx].id !== vertexIdx) {
                console.error("Vertex's id must match its position index in the list of vertices");
                console.error(vertexIdx + " th element in the list does not match its position index");
                return;
            }

            var adjVertices = graphData[vertexIdx].adjacentVertex;
            if (adjVertices) {
                for (let i = 0; i < adjVertices.length; i++) {
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


    function createEdgesInGraphData(graphData) {
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
    }


    function traverseGraph(vertexId) {
        // Takes in the id of a node and traverse trough the graph to connect impacted nodes
        // Returns the id of the visited node

        function chooseRandomAdjVertex(vertex) {
            // Takes in a vertex and choose a random adjacent vertex in the next layer based on the edge weights 
            let weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
            let weight = 0;
            for (let i = 0; i < vertex.adjacentVertex.length; i++) {
                weight += vertex.adjacentVertex[i].weight;
                weightDistribution.push(weight);
            }

            let randomPick = Math.random();
            console.log("weight distribution corresponding to adjacent vertices in the next layer: (" + weightDistribution + ") random pick: " + randomPick);
            for (let i = 0; i < weightDistribution.length - 1; i++) {
                if (randomPick >= weightDistribution[i] && randomPick <= weightDistribution[i + 1]) {
                    return vertex.adjacentVertex[i].id;
                }
            }
        }

        let visitedNodes = [vertexId];
        let node = graphData[vertexId];

        while (node.adjacentVertex) {
            console.log("Current Vertex: " + vertexId);
            vertexId = chooseRandomAdjVertex(node);
            console.log("Vextex chosen: " + vertexId);
            console.log("--------");
            node = graphData[vertexId];
            visitedNodes.push(vertexId);
        }

        directedPath = visitedNodes;
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

    function drawVertices() {
        // clear vertices then redraw all the vertices in the grpah
        d3.selectAll(".vertex").remove();

        let vertices = container.append("g")
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
                if (directedPath.indexOf(d.id) > -1) {
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

    function drawEdges() {
        // clear edges then redraw all the edges in the graph
        d3.selectAll("path").remove();

        // Specify the function for generating path data   
        // "linear" for piecewise linear segments
        // Creating path using data in pathinfo and path data generator
        // d3line.
        let line = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");

        //
        //        var diagonal = d3.svg.diagonal()
        //            .x(function (d) {
        //                return d.x;
        //            }).y(function (d) {
        //                return d.y;
        //            }).projection(function (d) {
        //                var r = d.y,
        //                    a = (d.x - 90) / 180 * Math.PI;
        //                return [r * Math.cos(a), r * Math.sin(a)];
        //            });


        function drawEdge(edgeNodes, edgeWeight) {
            // A helper function takes in a pair of nodes and draw a line 
            // between them based on the edge weight

            // If the edge is in the directedPath then draw different color
            if (directedPath.indexOf(edgeNodes[0].id) > -1 && directedPath.indexOf(edgeNodes[1].id) > -1) {
                container.append("svg:path")
                    .attr("d", line(edgeNodes))
                    .style("stroke-width", config.edge.baseWidth + edgeWeight)
                    .style("stroke", config.edge.visitedColor)
                    .style("fill", "none");
            } else {
                container.append("svg:path")
                    .attr("d", line(edgeNodes))
                    .style("stroke-width", config.edge.baseWidth + edgeWeight)
                    .style("stroke", config.edge.defaultColor)
                    .style("fill", "none");
            }

        }

        // Draw each vertex's edges based on weight
        for (let vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            let currentVertex = graphData[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
                    drawEdge(edgeNodes, edgeWeight);
                }
            }
        }

        // Draw the vertex in visitedNodes slowly one by one
        for (let vertexIdx = 0; vertexIdx < graphData.length; vertexIdx++) {
            let currentVertex = graphData[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
                    drawEdge(edgeNodes, edgeWeight);
                }
            }
        }
    }

    function drawGraph() {
        // Used to redraw the graph on start and when moving

        drawEdges();
        drawVertices();
    }


    function clearVisitedPath() {
        directedPath = [];
        drawGraph();
    }


    this.bind = function (data) {
        // Used to bind the data to the graph and render the graph

        if (data.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        // Add the graphData as a class attribute
        graphData = data;
        dataScreening(graphData);
        createEdgesInGraphData(graphData);
        if (config.background.grid) drawGrid();
        drawGraph();
    };

    this.createCluster = function (clusterMat) {
        // Used to create a clusters of nodes based on the cluster matrix
        // Ex of cluster mat [2, 3, 4] creates a cluster of 9 nodes where
        // 2 in first layer, 3 in 2nd layer and 4 in 3rd layer
        clusterMat = clusterMat;
        let data = [];
        let layerPosX = [1];

        function getLayerPoxX(clusterMat) {
            let firstNodePosX = config.dim.width / (clusterMat.length + 1);

        }


    };
};


var data = [{
    id: 0,
    x: 300,
    y: 100,
    r: 25,
    adjacentVertex: [{
        id: 2,
        weight: 0.1
        }, {
        id: 3,
        weight: 0.4
        }, {
        id: 4,
        weight: 0.5
        }]
    }];