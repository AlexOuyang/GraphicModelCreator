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
                } else if (set) {
                    result[prop] = cloneDR(cache);
                }
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

    /**
     * Darkens or lightens hex color value
     * percentage ranges form -100(dark) to +100(light)
     */
    Utils.shadeColor = function Utils(colorHex, percent) {

        var R = parseInt(colorHex.substring(1, 3), 16);
        var G = parseInt(colorHex.substring(3, 5), 16);
        var B = parseInt(colorHex.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    };

}());





/*=============== Probability Graphic Model ====================*/

function GraphicalModel(graphConfiguration) {
    "use strict";

    this.config = graphConfiguration || defaultConfig;

    this.chart = null; // holds the adjacency matrix chart 

    let self = this,

        defaultConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight - 80
            },
            vertex: {
                radius: 0.35,
                defaultColor: "#52bf90",
                visitedColor: "#1d4433",
            },
            edge: {
                baseWidth: 0.1, // base width offset = baseWidth * circle radius
                width: 0.5, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 600 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: true,
                color: "#ecf6f2"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalToUpdateChart: 400,
                timeInterval: 800
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button
            zoom: true,
        },

        graphData = {
            clusterMat: [], // data specifies the number of nodes each layer
            data: [] // data binds to the graph
        },

        directedPath = [], // directedPath is a list of visited nodes' ID

        canClick = true, // Used to keep user from clicking when the graph is traversing

        // Click on the node in the speaker layer to draw visited path
        onClick = d3.behavior.drag()
        .origin(d => d)
        .on("dragstart", function (d) {
            // Check if the clicked node is in the first layer
            // which are the num of nodes in first layer of clusterMat
            // Only allow user to click the node if autoplay is off
            if (canClick && !self.config.autoPlayable) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
                self.triggerSpeakerNode(this.id);
            }
        }),

        svg = d3.select("#pgm").append("svg")
        .attr("width", self.config.transform.width)
        .attr("height", self.config.transform.height)
        .append("g")
        .attr("transform", "translate(" + self.config.transform.x + "," + self.config.transform.y + ")"),

        // Set up the background rect wrapper
        rect = svg.append("rect")
        .attr("width", self.config.transform.width)
        .attr("height", self.config.transform.height)
        .style("fill", self.config.background.color)
        .style("pointer-events", "all")
        .on("click", d => {
            if (canClick) {
                clearVisitedPath();
                // Do not allow user to click until visited path highlighting is finished
                canClick = false;
                setTimeout(() => canClick = true, self.config.edge.timeInterval * (directedPath.length - 1));
            }
        }),

        container = svg.append("g"),

        // Specify the function for generating path data   
        // "linear" for piecewise linear segments
        // Creating path using data in pathinfo and path data generator
        // Used in drawEdges() and drawVisitedPath();
        line = d3.svg.line()
        .x(d => d.x)
        .y(d => d.y)
        .interpolate("linear"),

        vertices, // D3 object, initiated in drawVertices()


        // Zoom behavior
        zoom = d3.behavior.zoom().scaleExtent([1, 10])
        .on("zoom", () => {
            container.attr(
                "transform",
                "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
            );
        });

    // Zoom behavior
    if (self.config.zoom) {
        svg.call(zoom);
    }


    function dataScreening(data) {
        /* Verifies if each vertex's id matches its position in the array 
        and the weights of all adjacent vertices sum to 1; */

        if (data.length <= 1) {
            throw new Error("input graph data is empty");
        }

        let weightSum = 0;

        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            if (data[vertexIdx].id !== vertexIdx) {
                throw new Error("Vertex's id must match its position index in the list of vertices. The " + vertexIdx + " th element in the list does not match its position index");
            }

            let adjVertices = data[vertexIdx].adjacentVertex;
            if (adjVertices) {
                for (let i = 0; i < adjVertices.length; i++) {
                    weightSum += adjVertices[i].weight;
                }
                if (weightSum !== 1.0) {
                    throw new Error("The sum of a vertex's adjacent vertice's weight must be 1" + "The " + vertexIdx + "th node's adjacent vertices's weights do not sum to 1");
                }
            }
            weightSum = 0;
        }
    }


    function createEdgesInGraphData(data) {
        // Takes in the graph data, modifies the data by adding a list of edges into the data and add to self   
        if (data.length <= 1) {
            throw new Error("input graph data is empty");
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
    }



    function drawGrid() {
        /* Draws the axis in the background */

        container.append("g")
            .attr("class", "x axis")
            .selectAll("line")
            .data(d3.range(0, self.config.transform.width, 10))
            .enter().append("line")
            .attr("x1", d => d)
            .attr("y1", 0)
            .attr("x2", d => d)
            .attr("y2", self.config.transform.height);

        container.append("g")
            .attr("class", "y axis")
            .selectAll("line")
            .data(d3.range(0, self.config.transform.height, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", d => d)
            .attr("x2", self.config.transform.width)
            .attr("y2", d => d);
    }


    function drawText() {
        /* Add a text element to the previously added g element. */
        vertices.append("text")
            .attr("font-size", d => d.r * self.config.text.size)
            .attr("text-anchor", self.config.text.anchor)
            .attr("alignment-baseline", self.config.text.alignment)
            .attr("fill", self.config.text.color)
            .text(d => {
                if (d.label) {
                    return d.label;
                } else {
                    return d.id;
                }
            });
    }

    function drawVertices(data) {
        /* clear vertices then redraw all the vertices in the grpah */

        d3.selectAll(".vertex").remove();

        // Create vertex groups, each group contains a cicle and a text
        vertices = container.append("g")
            .attr("class", "vertex")
            .selectAll("circle")
            .data(data).enter()
            .append("g")
            .attr("id", d => d.id)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .call(onClick);

        vertices.append("circle")
            .attr("r", d => d.r);

        drawText();
    }

    function drawEdges(data) {
        /* Draw all edges and high light visited color */

        // clear edges then redraw all the edges in the graph 
        d3.selectAll("path").remove();

        // Draw all edges based on weight in default color
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            // Iterate through each nodes in data
            let currentVertex = data[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    // Iterate through each edge in the current node
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * self.config.edge.width;
                    container.append("svg:path")
                        .attr("d", line(edgeNodes))
                        .attr("stroke-width", edgeWeight + self.config.edge.baseWidth)
                        .style("stroke", self.config.edge.defaultColor)
                        .style("fill", "none");
                }
            }
        }

    }

    function drawVisitedPath(data) {
        /* Draw visited edges based on weight in highlighted color */

        for (let vertexIdx = 0; vertexIdx < directedPath.length; vertexIdx++) {
            // Iterate through the list of ID in directedPath 
            let currentVertex = data[directedPath[vertexIdx]];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * self.config.edge.width;
                    // If the edge is in the directedPath then draw different color
                    if (directedPath.indexOf(edgeNodes[0].id) > -1 && directedPath.indexOf(edgeNodes[1].id) > -1) {

                        // Create two new points to draw a shorter edge so the new 
                        // edge will not cover the id in the node
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

                        // tempEdges for highlighting the visited edges
                        let tempEdges = [{
                            x: x0 + distX * ratio0,
                            y: y0 - distY * ratio1
                            }, {
                            x: x1 - distX * ratio0,
                            y: y1 + distY * ratio1
                            }];

                        let lineLength = dist; // The line length

                        // Wait for 0.8 second until the next node is highlighted
                        // Draw the next visited path after time Interval
                        setTimeout(() => {

                            // Append a path that completes drawing wthin a time duration
                            container.append("svg:path")
                                .style("stroke-width", self.config.edge.baseWidth + edgeWeight)
                                .style("stroke", self.config.edge.visitedColor)
                                .style("fill", "none")
                                .attr({
                                    'd': line(tempEdges),
                                    'stroke-dasharray': lineLength + " " + lineLength,
                                    'stroke-dashoffset': lineLength
                                })
                                .transition()
                                .duration(self.config.edge.timeInterval)
                                .attr('stroke-dashoffset', 0);

                        }, self.config.edge.timeInterval * vertexIdx);

                        // Draw the next visited vertex after time Interval
                        setTimeout(() => {
                            /* clear vertices then redraw all the vertices in the grpah */
                            vertices.append("circle")
                                //                                .attr("class", "node")
                                .attr("class", d => {
                                    // if the node is in the path then draw it in a different color
                                    if (directedPath.indexOf(d.id) <= (vertexIdx + 1) &&
                                        directedPath.indexOf(d.id) > -1) {
                                        return "visitedVertex";
                                    }
                                })
                                .attr("r", d => d.r);

                            // Add a text element to the previously added g element.
                            drawText();

                            // Draw visited path ending condition
                            let endingVertexIdx = directedPath.length - 2;
                            if (vertexIdx === endingVertexIdx) {

                                // If chart exist, update the chart adjacency matrix after the visited path finish highlighting
                                if (self.chart) {
                                    setTimeout(() => {
                                        updateChart();
                                    }, self.config.autoPlay.timeIntervalToUpdateChart);
                                }
                                // If autoplay is on, then auto click on another node from speak layer
                                if (self.config.autoPlay.on) {
                                    console.log("Auto play is on!");
                                    setTimeout(() => {
                                        let random_id = Math.floor(Math.random() * graphData.clusterMat[0].length);
                                        self.triggerSpeakerNode(random_id);
                                    }, self.config.autoPlay.timeInterval);
                                }
                            }

                            // 0.9 is a time offset multiplier to make vertex colored faster since
                            // there is an unknown lag
                        }, 0.9 * self.config.edge.timeInterval * (vertexIdx + 1));

                        // Draw the first vertex when the path start highlighting
                        vertices.append("circle")
                            .attr("class", d => {
                                // if the node is in the path then draw it in a different color
                                if (directedPath[0] === d.id) {
                                    return "visitedVertex";
                                }
                            })
                            .attr("r", d => d.r);

                        // Add a text element to the previously added g element.
                        drawText();
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


    function killAllSetTimeOut() {
        // Kill all setTimeOut used to draw the visited path
        for (var i = 1; i < 99999; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
            if (window.mozCancelAnimationFrame) window.mozCancelAnimationFrame(i); // Firefox
        }
    }

    function clearVisitedPath() {
        /* empty the directedPath array and redraw the graph */

        killAllSetTimeOut();

        // Then clear the path storage
        directedPath = [];
        drawGraph(graphData.data);
    }



    function createPlayButton() {
        /* Used to create a play button, it modifies the default button property */

        var $Button = $("<div>", {
            class: "play-button paused"
        });
        var $left = $("<div>", {
            class: "left"
        });
        var $right = $("<div>", {
            class: "right"
        });
        var $triangle1 = $("<div>", {
            class: "triangle-1"
        });
        var $triangle2 = $("<div>", {
            class: "triangle-2"
        });

        $("#pgm").prepend($Button);

        $Button.append($left);
        $Button.append($right);
        $Button.append($triangle1);
        $Button.append($triangle2);

        // Update button dimension first
        self.config.autoPlay.button.dim = Array.min([self.config.transform.height, self.config.transform.width]) / 10.0 * self.config.autoPlay.button.dim;

        $(".play-button").css("height", self.config.autoPlay.button.dim + "px")
            .css("width", self.config.autoPlay.button.dim + "px");

        $(".triangle-1").css("border-right-width", self.config.autoPlay.button.dim + "px")
            .css("border-top-width", self.config.autoPlay.button.dim / 2.0 + "px")
            .css("border-bottom-width", self.config.autoPlay.button.dim / 2.0 + "px");

        $(".triangle-2").css("border-right-width", self.config.autoPlay.button.dim + "px")
            .css("border-top-width", self.config.autoPlay.button.dim / 1.9 + "px")
            .css("border-bottom-width", self.config.autoPlay.button.dim / 2.0 + "px");

        $(".left").css("background-color", self.config.autoPlay.button.color);
        $(".right").css("background-color", self.config.autoPlay.button.color);


        $(".play-button").click(function () {
            $(this).toggleClass("paused");
            if (self.config.autoPlay.on) {
                self.stopAutoPlay();
            } else {
                self.startAutoPlay();
            }
        });
    }


    this.triggerSpeakerNode = function (id) {
        /* triggers a speaker node by id, traverse down and draw the visited path. */

        let speakerLayerLength = graphData.clusterMat[0].length;

        // Only allow the node to be clicked if it is in the speaker layer
        if (id < speakerLayerLength) {
            let clickedVertexId = parseInt(id, 10);
            traverseGraph(clickedVertexId, graphData.data);
            drawGraph(graphData.data);
            drawVisitedPath(graphData.data);

            // testing 
            $('.path strong').text(directedPath);
        } else {
            // Else clear the path
            clearVisitedPath();
        }

        // Do not allow user to click
        canClick = false;
        setTimeout(() => canClick = true, self.config.edge.timeInterval * (directedPath.length - 1));

    };


    this.bindData = function (gd) {
        /* 
        Used to bind an existing JSON object or an object literal to 
        the graph and render the graph.
        */
        if (!Utils.isObjLiteral(gd)) {
            // If not an object literal must be a JSON, we parse it
            gd = JSON.parse(gd);
        }

        if (!gd || !gd.data) {
            throw new Error("pgm.bindData(gd): Input graph data is invalid input graph data is empty");
        }

        if (gd.data.length <= 1) {
            throw new Error("pgm.bindData(gd): Input graph data is empty");
        }

        // Add the graphData as a class attribute
        graphData = gd;
        dataScreening(graphData.data);
        createEdgesInGraphData(graphData.data);
        if (self.config.background.grid) {
            drawGrid();
        }
        drawGraph(graphData.data);
    };

    this.display = function () {
        /* Used to display the graph */

        if (self.config.autoPlayable) {
            createPlayButton();
        }
        dataScreening(graphData.data);
        createEdgesInGraphData(graphData.data);
        if (self.config.background.grid) {
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

    this.setLabel = function (id, label) {
        /* Set label for vertex */
        graphData.data[id].label = label;
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
        Used to create a clusters of nodes (Graphdata) based on the cluster matrix
        Ex of cluster mat [layer1_label_array, layer2_label_array, layer3_label_array] 
        */

        // Populate cMatDim, cMatDim is the dimension of the matrix, ex: [3,3,3]
        let cMatDim = [];
        for (let i = 0; i < cMat.length; i++) {
            cMatDim[i] = cMat[i].length;
        }

        let offsetPosX = self.config.transform.width / (cMatDim.length + 1); // get the x offset for first node
        let minPosY = self.config.transform.height / (Array.max(cMatDim) + 1); // get the y offset for the layer with the most amount of nodes

        // Data properties: id, x, y, r 
        let data = [];
        let id = 0;
        let x;
        let y;
        let r = Array.min([offsetPosX, minPosY]) * self.config.vertex.radius;

        self.config.vertex.radius = r;

        for (let i = 0; i < cMatDim.length; i++) {
            // Reset offset Y coordinate for each layer
            let offSetPosY = self.config.transform.height / (cMatDim[i] + 1);
            for (let j = 0; j < cMatDim[i]; j++) {
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

        // Label each vertex based on cMat labels
        let id_temp = 0;
        for (let i = 0; i < cMat.length; i++) {
            for (let j = 0; j < cMat[i].length; j++) {
                data[id_temp++].label = cMat[i][j];
            }
        }

        // Update the self.config edge width and baseWidth
        self.config.edge.width = r * self.config.edge.width;
        self.config.edge.baseWidth = r * self.config.edge.baseWidth;


        // Create the graphData member variable in pgm
        graphData = {
            clusterMat: cMat,
            data: data
        };

        return {
            clusterMat: cMat,
            data: data
        };
    };

    /*=========== Graphical Model Autoplay ===========*/

    function resetChart() {
        /* reset the chart */
        self.chart.resetMatrixWeight();
    }

    this.startAutoPlay = function () {
        /* called by the play button to start autoplay */
        canClick = false;
        if (self.chart) resetChart();
        self.config.autoPlay.on = true;
        let random_id = Math.floor(Math.random() * graphData.clusterMat[0].length);
        self.triggerSpeakerNode(random_id);
    };

    this.stopAutoPlay = function () {
        /* called by the stop button to stop autoplay */
        canClick = true;
        self.config.autoPlay.on = false;

        clearVisitedPath();
    };


    /*======== Binding Adjacency Matrix To The Graphical Model =======*/

    function updateChart() {
        /* Used in drawVisitedPath() to update the adjacency matrix chart */

        let rowLabel = graphData.data[directedPath[0]].label;
        let colLabel = graphData.data[directedPath[directedPath.length - 1]].label;
        let cellToUpdate = [rowLabel, colLabel];
        log("Update Cell: [" + cellToUpdate + "]");
        self.chart.increaseCellWeight(cellToUpdate);
    }

    this.bindChart = function (chart) {
        /* Used to bind to an existing adjacency matrix chart to the graphical model */

        self.chart = chart;
    };

    this.createChart = function (chartConfig) {
        /* Create a chart and bind to the graphic model */

        self.chartConfig = chartConfig;

        if (graphData.clusterMat.length < 2) {
            throw new Error("Can not create adjacency matrix for graphical model with layer number less than 2");
            return;
        }
        var rowLabel = graphData.clusterMat[0];
        var colLabel = graphData.clusterMat[graphData.clusterMat.length - 1];
        self.chart = new Chart(chartConfig);
        self.chart.createMatrix(rowLabel, colLabel);
    };
}