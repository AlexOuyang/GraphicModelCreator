/*  jshint undef:true
    global $:false, jQuery:false, d3:false
*/


/*=============== Utilities ==================*/
// Implement max and min function for array
Array.max = function (array) {
    return Math.max.apply(Math, array);
};

Array.min = function (array) {
    return Math.min.apply(Math, array);
};

function cloneDR(o) {
    /* Clone an object deeply and recursively */

    const gdcc = "__getDeepCircularCopy__";
    if (o !== Object(o)) {
        return o; // primitive value
    }

    var set = gdcc in o,
        cache = o[gdcc],
        result;
    if (set && typeof cache == "function") {
        return cache();
    }
    // else
    o[gdcc] = function () {
        return result;
    }; // overwrite
    if (o instanceof Array) {
        result = [];
        for (var i = 0; i < o.length; i++) {
            result[i] = cloneDR(o[i]);
        }
    } else {
        result = {};
        for (var prop in o)
            if (prop != gdcc)
                result[prop] = cloneDR(o[prop]);
            else if (set)
            result[prop] = cloneDR(cache);
    }
    if (set) {
        o[gdcc] = cache; // reset
    } else {
        delete o[gdcc]; // unset again
    }
    return result;
}


function isObjLiteral(_obj) {
    /* verify if an object is an object literal */
    var _test = _obj;
    return (typeof _obj !== 'object' || _obj === null ?
        false :
        (
            (function () {
                while (!false) {
                    if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                        break;
                    }
                }
                return Object.getPrototypeOf(_obj) === _test;
            })()
        )
    );
}






/*=============== Probability Graphic Model ====================*/

var pgm = function (graphConfiguration) {
    "use strict";

    var graphData = {
            clusterMat: [], // data specifies the number of nodes each layer
            data: [] // data binds to the graph
        },

        directedPath = [], // directedPath is a list of visited nodes
        config = graphConfiguration || {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight - 80
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
        onClick = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("dragstart", function (d) {
            // Check if the clicked node is in the first layer
            // which are the num of nodes in first layer of clusterMat
            if (this.id < graphData.clusterMat[0]) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
                var clickedVertexId = parseInt(this.id, 10);
                traverseGraph(clickedVertexId, graphData.data);
                drawGraph(graphData.data);

                // testing 
                $('.path strong').text(directedPath);
            } else {
                // Else clear the path
                clearVisitedPath();
            }
        }),

        svg = d3.select("body").append("svg")
        .attr("width", config.transform.width)
        .attr("height", config.transform.height)
        .append("g")
        .attr("transform", "translate(" + config.transform.x + "," + config.transform.y + ")")
        .call(zoom),

        rect = svg.append("rect")
        .attr("width", config.transform.width)
        .attr("height", config.transform.height)
        .style("fill", config.background.color)
        .style("pointer-events", "all")
        .on("click", function (d) {
            clearVisitedPath();
        }),

        container = svg.append("g");

    function dataScreening(data) {

        // Verifies if each vertex's id matches its position in the array 
        // and the weights of all adjacent vertices sum to 1;

        if (data.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        let weightSum = 0;

        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            if (data[vertexIdx].id !== vertexIdx) {
                console.error("Vertex's id must match its position index in the list of vertices");
                console.error(vertexIdx + " th element in the list does not match its position index");
                return;
            }

            var adjVertices = data[vertexIdx].adjacentVertex;
            if (adjVertices) {
                for (let i = 0; i < adjVertices.length; i++) {
                    weightSum += adjVertices[i].weight;
                }
                if (weightSum !== 1.0) {
                    console.error("The sum of a vertex's adjacent vertice's weight must be 1");
                    console.error(vertexIdx + "th element's adjacent vertices's weight does not sum to 1");
                    return;
                }
            }
            weightSum = 0;
        }
    }


    function createEdgesInGraphData(data) {
        // Takes in the graph data, modifies the data by adding a list of edges into the data and add to self   
        if (data.length <= 1) {
            console.error("input graph data is empty");
            return;
        }

        // Go through each vertex in data and add 'edges' attribute to each vertex
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            let currentVertex = data[vertexIdx];
            if (!currentVertex.adjacentVertex) {
                currentVertex.edges = null;
            } else {
                currentVertex.edges = [];
                for (let adjVertexIdx = 0; adjVertexIdx < currentVertex.adjacentVertex.length; adjVertexIdx++) {
                    let targetVertexId = currentVertex.adjacentVertex[adjVertexIdx].id;
                    let targetVertexWeight = currentVertex.adjacentVertex[adjVertexIdx].weight;

                    let edge = {
                        edgeWeight: targetVertexWeight,
                        edgeNodes: [currentVertex, data[targetVertexId]]
                    };

                    currentVertex.edges.push(edge);
                }
            }
        }
    }


    function traverseGraph(vertexId, data) {
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
        let node = data[vertexId];

        while (node.adjacentVertex !== undefined) {
            console.log("Current Vertex: " + vertexId);
            vertexId = chooseRandomAdjVertex(node);
            console.log("Vextex chosen: " + vertexId);
            console.log("--------");
            node = data[vertexId];
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

    function drawVertices(data) {
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
            }).call(onClick);

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

    function drawEdges(data) {
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
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            let currentVertex = data[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
                    drawEdge(edgeNodes, edgeWeight);
                }
            }
        }


        // Draw the vertex in visitedNodes slowly one by one
        //        for (let vertexIdx = 0; vertexIdx < directedPath.length - 1; vertexIdx++) {
        //            let currentVertex = directedPath[vertexIdx];
        //            let edgeIdx = directedPath[vertexIdx + 1];
        //
        //            let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
        //            let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
        //            drawEdge(edgeNodes, edgeWeight);
        //        }
    }

    function drawGraph(data) {
        // Used to redraw the graph on start and when moving

        drawEdges(data);
        drawVertices(data);
    }


    function clearVisitedPath() {
        directedPath = [];
        drawGraph(graphData.data);
    }


    this.bind = function (gd) {
        /* 
        Used to bind an existing JSON object or an object literal to 
        the graph and render the graph.
        */
        if (!isObjLiteral(gd)) {
            // If not an object literal must be a JSON, we parse it
            gd = JSON.parse(gd);
        }

        if (!gd || !gd.data) {
            throw new Error("pgm.bind(gd): Input graph data is invalid input graph data is empty");
        }

        if (gd.data.length <= 1) {
            throw new Error("pgm.bind(gd): Input graph data is empty");
        }

        // Add the graphData as a class attribute
        graphData = gd;
        dataScreening(graphData.data);
        createEdgesInGraphData(graphData.data);
        if (config.background.grid) {
            drawGrid();
        }
        drawGraph(graphData.data);
    };

    this.display = function () {
        // Used to display the graph

        dataScreening(graphData.data);
        createEdgesInGraphData(graphData.data);
        if (config.background.grid) {
            drawGrid();
        }
        drawGraph(graphData.data);
    };


    this.setAdjacentVertex = function (id, adjVtx) {
        // Set adjacent vertex for vertex with id 
        if (id === undefined || adjVtx === undefined) {
            console.error("setAdjacentVertex(id, adjVtx) params are not satisfied.");
        }

        graphData.data[id].adjacentVertex = adjVtx;
    };


    this.getGraphData = function () {


        let jsonGraphData = cloneDR(graphData);

        console.log(jsonGraphData);

        // Delete all the edge circular structures in the object
        for (let i = 0; i < jsonGraphData.data.length; i++) {
            delete(jsonGraphData.data[i].edges);
        }

        return JSON.stringify(jsonGraphData);
    };


    this.createCluster = function (cMat) {
        // Used to create a clusters of nodes based on the cluster matrix
        // Ex of cluster mat [2, 3, 4] creates a cluster of 9 nodes where
        // 2 in first layer, 3 in 2nd layer and 4 in 3rd layer

        let offsetPosX = config.transform.width / (cMat.length + 1); // get the x offset for first node
        let minPosY = config.transform.height / (Array.max(cMat) + 1); // get the y offset for the layer with the most amount of nodes

        // Data properties: id, x, y, r 
        let data = [];
        let id = 0;
        let x;
        let y;
        let r = Array.min([offsetPosX, minPosY]) / 3.0;

        for (let i = 0; i < cMat.length; i++) {
            // Reset offset Y coordinate for each layer
            let offSetPosY = config.transform.height / (cMat[i] + 1);
            for (let j = 0; j < cMat[i]; j++) {
                x = offsetPosX * (i + 1);
                y = offSetPosY * (j + 1);
                data.push({
                    id: id,
                    x: x,
                    y: y,
                    r: r
                });
                id++;
            }

        }

        // Update the graphData instanec in pgm
        graphData = {
            clusterMat: cMat,
            data: data
        };

        return {
            clusterMat: cMat,
            data: data
        };
    };

};