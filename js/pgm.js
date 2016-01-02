/*=============== Utilities ==================*/

// Used to replace console.log,  EX: log('hello'); // hello 
const log = mesg => console.log(mesg);

// Implement max and min function for array
Array.max = array => Math.max.apply(Math, array);
Array.min = array => Math.min.apply(Math, array);

var Utils = {};

(function () {
    "use strict";

    Utils.cloneDR = function cloneDR(o) {
        /* Clone an object deeply and recursively */

        const gdcc = "__getDeepCircularCopy__";
        if (o !== Object(o)) {
            return o; // primitive value
        }

        let set = gdcc in o,
            cache = o[gdcc],
            result;
        if (set && typeof cache == "function") {
            return cache();
        }
        // else
        o[gdcc] = () => result;
        // overwrite
        if (o instanceof Array) {
            result = [];
            for (let i = 0; i < o.length; i++) {
                result[i] = cloneDR(o[i]);
            }
        } else {
            result = {};
            for (let prop in o) {
                if (prop != gdcc) {
                    result[prop] = cloneDR(o[prop]);
                } else if (set)
                    result[prop] = cloneDR(cache);
            }
        }
        if (set) {
            o[gdcc] = cache; // reset
        } else {
            delete o[gdcc]; // unset again
        }
        return result;
    };



    Utils.isObjLiteral = function isObjLiteral(_obj) {
        /* verify if an object is an object literal */
        let _test = _obj;
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
    };

}());





/*=============== Probability Graphic Model ====================*/

var pgm = function (graphConfiguration) {
    "use strict";

    let graphData = {
            clusterMat: [], // data specifies the number of nodes each layer
            data: [] // data binds to the graph
        },

        directedPath = [], // directedPath is a list of visited nodes' ID
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
        .on("zoom", () => {
            if (config.zoom) {
                container.attr(
                    "transform",
                    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
                );
            }
        }),

        // Dragging nodes behavior
        onClick = d3.behavior.drag()
        .origin(d => d)
        .on("dragstart", function (d) {
            // Check if the clicked node is in the first layer
            // which are the num of nodes in first layer of clusterMat
            if (this.id < graphData.clusterMat[0]) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
                let clickedVertexId = parseInt(this.id, 10);
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
        .on("click", d => clearVisitedPath()),

        container = svg.append("g");

    function dataScreening(data) {

        // Verifies if each vertex's id matches its position in the array 
        // and the weights of all adjacent vertices sum to 1;

        if (data.length <= 1) {
            throw new Error("input graph data is empty");
            return;
        }

        let weightSum = 0;

        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            if (data[vertexIdx].id !== vertexIdx) {
                throw new Error("Vertex's id must match its position index in the list of vertices");
                throw new Error(vertexIdx + " th element in the list does not match its position index");
                return;
            }

            let adjVertices = data[vertexIdx].adjacentVertex;
            if (adjVertices) {
                for (let i = 0; i < adjVertices.length; i++) {
                    weightSum += adjVertices[i].weight;
                }
                if (weightSum !== 1.0) {
                    throw new Error("The sum of a vertex's adjacent vertice's weight must be 1");
                    throw new Error(vertexIdx + "th node's adjacent vertices's weights do not sum to 1");
                    return;
                }
            }
            weightSum = 0;
        }
    }


    function createEdgesInGraphData(data) {
        // Takes in the graph data, modifies the data by adding a list of edges into the data and add to self   
        if (data.length <= 1) {
            throw new Error("input graph data is empty");
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
        /* 
        Takes in the id of a node and traverse trough the graph to connect 
        impacted nodes and returns the id of the visited node
        */

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
        console.log("traverseGraph():" + directedPath);
    }



    function drawGrid() {
        /* Draws the axis in the background */

        container.append("g")
            .attr("class", "x axis")
            .selectAll("line")
            .data(d3.range(0, config.transform.width, 10))
            .enter().append("line")
            .attr("x1", d => d)
            .attr("y1", 0)
            .attr("x2", d => d)
            .attr("y2", config.transform.height);

        container.append("g")
            .attr("class", "y axis")
            .selectAll("line")
            .data(d3.range(0, config.transform.height, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", d => d)
            .attr("x2", config.transform.width)
            .attr("y2", d => d);
    }

    function drawVertices(data) {
        /* clear vertices then redraw all the vertices in the grpah */

        d3.selectAll(".vertex").remove();

        let vertices = container.append("g")
            .attr("class", "vertex")
            .selectAll("circle")
            .data(data).enter()
            .append("g")
            .attr("id", d => d.id)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .call(onClick);

        vertices.append("circle")
            .attr("class", "node")
            .attr("class", d => {
                // if the node is in the path then draw it in a different color
                if (directedPath.indexOf(d.id) > -1) {
                    return "visitedVertex";
                }
            })
            .attr("r", d => d.r);

        // Add a text element to the previously added g element.
        vertices.append("text")
            .attr("text-anchor", "middle")
            .text(d => d.id);

    }

    function drawEdges(data) {
        /* Draw all edges and high light visited color */

        // clear edges then redraw all the edges in the graph 
        d3.selectAll("path").remove();

        // Specify the function for generating path data   
        // "linear" for piecewise linear segments
        // Creating path using data in pathinfo and path data generator
        // d3line.
        let line = d3.svg.line()
            .x(d => d.x)
            .y(d => d.y)
            .interpolate("linear");


        // Draw all edges based on weight in default color
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            // Iterate through each nodes in data
            let currentVertex = data[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    // Iterate through each edge in the current node
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
                    container.append("svg:path")
                        .attr("d", line(edgeNodes))
                        .style("stroke-width", config.edge.baseWidth + edgeWeight)
                        .style("stroke", config.edge.defaultColor)
                        .style("fill", "none");
                }
            }
        }

        // Draw visited edges based on weight in highlighted color
        for (let vertexIdx = 0; vertexIdx < directedPath.length; vertexIdx++) {
            // Iterate through the list of ID in directedPath 
            let currentVertex = data[directedPath[vertexIdx]];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * config.edge.weightWidth;
                    // If the edge is in the directedPath then draw different color
                    if (directedPath.indexOf(edgeNodes[0].id) > -1 &&
                        directedPath.indexOf(edgeNodes[1].id) > -1) {

                        // Wait for 1 second until the next node is highlighted
                        let timeInterval = 1000;

                        // Create two new points to draw a shorter edge so the new 
                        // edge will not cover the id in the node
                        let getTempEdges = (edgeNodes) => {
                            let x0 = edgeNodes[0].x,
                                y0 = edgeNodes[0].y,
                                r0 = edgeNodes[0].r,
                                x1 = edgeNodes[1].x,
                                y1 = edgeNodes[1].y,
                                r1 = edgeNodes[1].r,
                                distX = x1 - x0,
                                distY = y0 - y1,
                                dist = Math.sqrt(distX * distX + distY * distY),
                                ratio0 = r0 / (1.0 * dist),
                                ratio1 = r1 / (1.0 * dist);
                                return [{
                                    x: x0 + distX * ratio0,
                                    y: y0 - distY * ratio1
                            }, {
                                    x: x1 - distX * ratio0,
                                    y: y1 + distY * ratio1
                            }];
                        };

                        setTimeout(() => {

                            container.append("svg:path")
                                .style("stroke-width", config.edge.baseWidth + edgeWeight)
                                .style("stroke", config.edge.visitedColor)
                                .style("fill", "none")
                                .attr({
                                    'd': line(getTempEdges(edgeNodes)),
                                    'stroke-dasharray': '1000 1000',
                                    'stroke-dashoffset': 1000
                                })
                                .transition()
                                .duration(1500)
                                .attr('stroke-dashoffset', 0);



                        }, timeInterval * vertexIdx);

                        //                        setTimeout(() => {
                        //                            drawVertices(data);
                        //                            
                        //                        }, timeInterval * (vertexIdx + 1));
                    }
                }
            }
        }

    }

    function drawGraph(data) {
        /* Used to redraw the graph on start and when moving */

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
        if (!Utils.isObjLiteral(gd)) {
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
        /* Used to display the graph */

        dataScreening(graphData.data);
        createEdgesInGraphData(graphData.data);
        if (config.background.grid) {
            drawGrid();
        }
        drawGraph(graphData.data);
    };


    this.setAdjacentVertex = function (id, adjVtx) {
        /* Set adjacent vertex for vertex with id */

        if (id === undefined || adjVtx === undefined) {
            throw new Error("setAdjacentVertex(id, adjVtx) params are not satisfied.");
        }

        graphData.data[id].adjacentVertex = adjVtx;
    };


    this.getGraphData = function () {
        /* Returns the graphData as  JSON object */
        let jsonGraphData = Utils.cloneDR(graphData);

        console.log(jsonGraphData);

        // Delete all the edge circular structures in the object
        for (let i = 0; i < jsonGraphData.data.length; i++) {
            delete(jsonGraphData.data[i].edges);
        }

        return JSON.stringify(jsonGraphData);
    };


    this.createCluster = function (cMat) {
        /* 
        Used to create a clusters of nodes based on the cluster matrix
        Ex of cluster mat [2, 3, 4] creates a cluster of 9 nodes where
        2 in first layer, 3 in 2nd layer and 4 in 3rd layer
        */

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