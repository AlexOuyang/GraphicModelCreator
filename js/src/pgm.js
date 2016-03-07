/*=============== Probability Graphic Model ====================*/
"use strict";

class GraphicalModel {

    constructor(graphConfiguration, divID) {

        this._weightedAdjMat = null; // holds the adjacency matrix chart 

        let defaultConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight - 80
            },
            vertex: {
                radius: 0.35,
                defaultStyle: {
                    backgroundColor: "#52bf90",
                    outlineColor: "#317256"
                },
                visited: {
                    visitedColor: "#1d4433",
                    outlineColor: "#1d4433"
                }
            },
            edge: {
                baseWidth: 0, // base width offset = baseWidth * circle radius
                width: 0.5, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 600 // timeInterval to complete highlighting on edge is in millisecond
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
                on: false, // true when user clicks on the play button and the graph cycles, else false
                button: {
                    dim: 1, // size of the play button
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 800
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button    
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: true,
        };

        this.config = graphConfiguration || defaultConfig;

        this.graphData = {
            clusterMat: [], // data specifies the nodes in each layer
            data: [] // data binds to the graph
        };

        this.directedPath = []; // directedPath is a list of visited nodes' ID

        this.canClick = true; // Used to keep user from clicking when the graph is traversing

        this.speakerLayerProbabilityDistribution = []; //  an array of probability given to each node in the speaker layer, probabilityDistribution=[] if uniform distribution


        let pgm = this;

        this.divID = divID;

        // Click on the node in the speaker layer to draw visited path
        this.onClick = d3.behavior.drag()
            .origin(d => d)
            .on("dragstart", function(d) {
                // Check if the clicked node is in the first layer
                // which are the num of nodes in first layer of clusterMat
                // Only allow user to click the node if autoplay is off
                if (pgm.canClick && !pgm.config.autoPlayable) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                    pgm._triggerSpeakerNode(this.id);
                }
            });

        this.svg = d3.select(divID).append("svg")
            .attr("class", "graph")
            .attr("width", this.config.transform.width)
            .attr("height", this.config.transform.height)
            .append("g")
            .attr("transform", "translate(" + this.config.transform.x + "," + this.config.transform.y + ")");

        // Set up the background rect wrapper
        this.rect = this.svg.append("rect")
            .attr("class", "background")
            .attr("width", this.config.transform.width)
            .attr("height", this.config.transform.height)
            .style("fill", this.config.background.color)
            .style("pointer-events", "all")
            .on("click", d => {
                pgm._backgroundOnClick();
            });

        this.container = this.svg.append("g");

        // Specify the function for generating path data   
        // "linear" for piecewise linear segments
        // Creating path using data in pathinfo and path data generator
        // Used in _drawEdges() and _drawVisitedPath();
        this.line = d3.svg.line()
            .x(d => d.x)
            .y(d => d.y)
            .interpolate("linear");

        this.vertices = null; // D3 object, initiated in drawVertices()


        // Zoom behavior
        this.zoom = d3.behavior.zoom().scaleExtent([1, 10])
            .on("zoom", () => {
                this.container.attr(
                    "transform",
                    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
                );
            });

        // Zoom behavior
        if (this.config.zoomable) {
            this.svg.call(this.zoom);
        }

    }


    _backgroundOnClick() {
        if (this.canClick && !this.config.autoPlay.on) {
            this._clearVisitedPath();
            // Do not allow user to click until visited path highlighting is finished
            this.canClick = false;
            setTimeout(() => this.canClick = true, this.config.edge.timeInterval * (this.directedPath.length - 1));

            // click on background to reset adjacency matrix
            if (this._weightedAdjMat) {
                this._weightedAdjMat.resetMatrixWeight();
                this._weightedAdjMat.resetMatrixColorWeight();
                this._weightedAdjMat.redrawMatrix();
            }
        }
    }

    _dataScreening(data) {
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
            let allEdgeZero = true;
            let adjVertices = data[vertexIdx].adjacentVertex;
            if (adjVertices) {
                // Check if all edges have weight 0

                for (let i = 0; i < adjVertices.length; i++) {
                    weightSum += adjVertices[i].weight;
                    if (adjVertices[i].weight !== 0) allEdgeZero = false;
                }

                if (weightSum !== 1.0 && allEdgeZero === false) {
                    throw new Error("The sum of a vertex's adjacent edge's weight must be 1 or all edges have a weight of 0. " + "The " + vertexIdx + "th vertex is invalid.");
                }
            }
            weightSum = 0;
        }
    }


    _createEdgesInGraphData(data) {
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

    _chooseRandomAdjVertexFromSpeakerLayer() {
        /*
        Choose a random adjacent vertex in the speaker layer based on the edge weights 
        */
        let weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
        let weight = 0;
        for (let i = 0; i < this.speakerLayerProbabilityDistribution.length; i++) {
            weight += this.speakerLayerProbabilityDistribution[i];
            weightDistribution.push(weight);
        }

        let randomPick = Math.random();
        console.log("weight distribution corresponding to the speaker layer: (" + weightDistribution + ") random pick: " + randomPick);
        for (let i = 0; i < weightDistribution.length - 1; i++) {
            if (randomPick >= weightDistribution[i] && randomPick <= weightDistribution[i + 1]) {
                return this.graphData.data[i].id;
            }
        }
    }

    _chooseRandomAdjVertex(vertex) {
        /*
        Takes in a vertex and choose a random adjacent vertex in the next layer based on the edge weights 
        */
        let weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
        let weight = 0;
        for (let i = 0; i < vertex.adjacentVertex.length; i++) {
            weight += vertex.adjacentVertex[i].weight;
            weightDistribution.push(weight);
        }

        let randomPick = Math.random();
        console.log("weight distribution corresponding to adjacent vertices in the next layer: (" + weightDistribution + ") random pick: " + randomPick);

        // if the sum of distribution is 0 then return -1
        let distributionSum = weightDistribution.reduce(function(a, b) {
            return a + b;
        }, 0);
        if (distributionSum === 0) {
            return -1;
        }

        for (let i = 0; i < weightDistribution.length - 1; i++) {
            if (randomPick >= weightDistribution[i] && randomPick <= weightDistribution[i + 1]) {
                return vertex.adjacentVertex[i].id;
            }
        }
    }

    _traverseGraph(vertexId, data) {
        /* 
        Takes in the id of a node and traverse trough the graph to connect 
        impacted nodes and returns the id of the visited node
        */

        let visitedNodes = [vertexId];
        let node = data[vertexId];

        while (node !== undefined && node.adjacentVertex !== undefined) {
            console.log("Current Vertex: " + vertexId);
            vertexId = this._chooseRandomAdjVertex(node);
            // if (vertexId < 0) break;
            console.log("Vextex chosen: " + vertexId);
            console.log("--------");
            node = data[vertexId];
            visitedNodes.push(vertexId);
        }

        this.directedPath = visitedNodes;
    }



    _drawGrid() {
        /* Draws the axis in the background */

        this.container.append("g")
            .attr("class", "x axis")
            .selectAll("line")
            .data(d3.range(0, this.config.transform.width, 10))
            .enter().append("line")
            .attr("x1", d => d)
            .attr("y1", 0)
            .attr("x2", d => d)
            .attr("y2", this.config.transform.height);

        this.container.append("g")
            .attr("class", "y axis")
            .selectAll("line")
            .data(d3.range(0, this.config.transform.height, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", d => d)
            .attr("x2", this.config.transform.width)
            .attr("y2", d => d);
    }


    _drawText() {
        /* Add a text element to the previously added g element. */
        this.vertices.append("text")
            .attr("font-size", d => d.r * this.config.text.size)
            .attr("text-anchor", this.config.text.anchor)
            .attr("alignment-baseline", this.config.text.alignment)
            .attr("fill", this.config.text.color)
            .text(d => {
                if (d.label) {
                    return d.label;
                } else {
                    return d.id;
                }
            });
    }

    _drawVertices(data) {
        /* clear vertices then redraw all the vertices in the grpah */

        d3.selectAll(this.divID + " g .vertex").remove();

        // Create vertex groups, each group contains a cicle and a text
        this.vertices = this.container.append("g")
            .attr("class", "vertex")
            .selectAll("circle")
            .data(data).enter()
            .append("g")
            .attr("id", d => d.id)
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
            .call(this.onClick);

        this.vertices.append("circle")
            .attr("r", d => d.r);

        this._drawText();
    }

    _drawEdges(data) {
        /* Draw all edges and high light visited color */

        // clear edges then redraw all the edges in the graph 
        d3.selectAll(this.divID + " path").remove();

        // Draw all edges based on weight in default color
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            // Iterate through each nodes in data
            let currentVertex = data[vertexIdx];
            if (currentVertex.edges) {
                for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                    // Iterate through each edge in the current node
                    let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                    let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * this.config.edge.width;
                    this.container.append("svg:path")
                        .attr("d", this.line(edgeNodes))
                        .attr("stroke-width", edgeWeight + this.config.edge.baseWidth)
                        .style("stroke", this.config.edge.defaultColor)
                        .style("fill", "none");
                }
            }
        }

    }

    _drawVisitedPath(data) {
        /* Draw visited edges based on weight in highlighted color */

        for (let vertexIdx = 0; vertexIdx < this.directedPath.length; vertexIdx++) {

            // check if there's -1 in directedPath, if yes, do not draw the path and trigger a new speaker
            if (this.directedPath[vertexIdx] < 0) {

                // Draw the first vertex when the path start highlighting
                this.vertices.append("circle")
                    .attr("class", d => {
                        // if the node is in the path then draw it in a different color
                        if (this.directedPath[0] === d.id) {
                            return "visitedVertex";
                        }
                    })
                    .attr("r", d => d.r);

                // Add a text element to the previously added g element.
                this._drawText();

                setTimeout(() => {

                    // If autoplay is on, then restart the cycle after [timeIntervalBetweenCycle] milliseconds
                    if (this.config.autoPlay.on) {
                        console.log("Auto play is on!");
                        setTimeout(() => {
                            this._triggerSpeakerNodeAutoPlay();
                        }, this.config.autoPlay.timeIntervalBetweenCycle);
                    }

                }, this.config.edge.timeInterval);
            } else {

                // If there's no -1 in directed path
                // Iterate through the list of ID in directedPath 
                let currentVertex = data[this.directedPath[vertexIdx]];
                if (currentVertex.edges) {
                    for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                        let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                        let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * this.config.edge.width;
                        // If the edge is in the directedPath then draw different color
                        if (this.directedPath.indexOf(edgeNodes[0].id) > -1 && this.directedPath.indexOf(edgeNodes[1].id) > -1) {

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
                                this.container.append("svg:path")
                                    .style("stroke-width", this.config.edge.baseWidth + edgeWeight)
                                    .style("stroke", this.config.edge.visitedColor)
                                    .style("fill", "none")
                                    .attr({
                                        'd': this.line(tempEdges),
                                        'stroke-dasharray': lineLength + " " + lineLength,
                                        'stroke-dashoffset': lineLength
                                    })
                                    .transition()
                                    .duration(this.config.edge.timeInterval)
                                    .attr('stroke-dashoffset', 0);

                            }, this.config.edge.timeInterval * vertexIdx);

                            // Draw the next visited vertex after time Interval
                            setTimeout(() => {
                                /* clear vertices then redraw all the vertices in the grpah */
                                this.vertices.append("circle")
                                //                                .attr("class", "node")
                                .attr("class", d => {
                                    // if the node is in the path then draw it in a different color
                                    if (this.directedPath.indexOf(d.id) <= (vertexIdx + 1) &&
                                        this.directedPath.indexOf(d.id) > -1) {
                                        return "visitedVertex";
                                    }
                                })
                                    .attr("r", d => d.r);

                                // Add a text element to the previously added g element.
                                this._drawText();

                                // Visited path ending condition
                                let endingVertexIdx = this.directedPath.length - 2;
                                if (vertexIdx === endingVertexIdx) {

                                    // If _weightedAdjMat exists, update the _weightedAdjMat adjacency matrix after the visited path finish highlighting within [timeIntervalBetweenCycle/2] milliseconds
                                    if (this._weightedAdjMat) {
                                        setTimeout(() => {
                                            this._updateChart();
                                        }, this.config.autoPlay.timeIntervalBetweenCycle / 2.0);
                                    }
                                    // If autoplay is on, then restart the cycle after [timeIntervalBetweenCycle] milliseconds
                                    if (this.config.autoPlay.on) {
                                        console.log("Auto play is on!");
                                        setTimeout(() => {
                                            this._triggerSpeakerNodeAutoPlay();
                                        }, this.config.autoPlay.timeIntervalBetweenCycle);
                                    }
                                }

                                // 0.95 is a time offset multiplier to make vertex colored faster since
                                // there is an unknown lag
                            }, this.config.edge.timeInterval * (vertexIdx + 1));

                            // Draw the first vertex when the path start highlighting
                            this.vertices.append("circle")
                                .attr("class", d => {
                                    // if the node is in the path then draw it in a different color
                                    if (this.directedPath[0] === d.id) {
                                        return "visitedVertex";
                                    }
                                })
                                .attr("r", d => d.r);

                            // Add a text element to the previously added g element.
                            this._drawText();
                        }
                    }
                }
            }
        }
    }

    _drawGraph(data) {
        /* Used to redraw the graph on start and when moving */

        this._drawEdges(data);
        this._drawVertices(data);
    }


    _killAllSetTimeOut() {
        // Kill all setTimeOut used to draw the visited path
        for (var i = 1; i < 99999; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
            if (window.mozCancelAnimationFrame) window.mozCancelAnimationFrame(i); // Firefox
        }
    }

    _clearVisitedPath() {
        /* empty the directedPath array and redraw the graph */

        this._killAllSetTimeOut();

        // Then clear the path storage
        this.directedPath = [];
        this._drawGraph(this.graphData.data);
    }


    _createCyclingSpeedControllButton() {
        let pgm = this;

        let sliderID = this.divID.substring(1) + "-slider-range";
        let $DivSlider = $("<div>", {
            id: sliderID
        });
        $(this.divID).prepend($DivSlider);
        $("#" + sliderID).slider({
            range: false, // two buttons caps a range
            min: 10,
            max: 2000,
            value: 800,
            slide: function(event, ui) {
                console.log(ui.value);
                let sphereRad = ui.value;
                pgm.config.edge.timeInterval = ui.value;
                pgm.config.autoPlay.timeIntervalBetweenCycle = ui.value;
            }
        });

        let sliderWidth = (this._weightedAdjMat === null) ? this.config.transform.width : this._weightedAdjMat.config.transform.width + this.config.transform.width;
        $("#" + sliderID).css("width", sliderWidth + "px");
    }

    _createPlayButton() {
        /* Used to create a play button, it modifies the default button property in button.css */

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

        $(this.divID).prepend($Button);

        $Button.append($left);
        $Button.append($right);
        $Button.append($triangle1);
        $Button.append($triangle2);

        // Update button dimension first
        let resizedButton = Array.min([this.config.transform.height, this.config.transform.width]) / 10.0 * this.config.autoPlay.button.dim;
        let maxButtonSize = 35.0; // The max button size is 40px so that buttons won't get too big
        this.config.autoPlay.button.dim = (resizedButton > maxButtonSize) ? maxButtonSize : resizedButton;

        $(this.divID + " .play-button").css("height", this.config.autoPlay.button.dim + "px")
            .css("width", this.config.autoPlay.button.dim + "px");

        $(this.divID + " .triangle-1").css("border-right-width", this.config.autoPlay.button.dim + "px")
            .css("border-top-width", this.config.autoPlay.button.dim / 2.0 + "px")
            .css("border-bottom-width", this.config.autoPlay.button.dim / 2.0 + "px");

        $(this.divID + " .triangle-2").css("border-right-width", this.config.autoPlay.button.dim + "px")
            .css("border-top-width", this.config.autoPlay.button.dim / 1.9 + "px")
            .css("border-bottom-width", this.config.autoPlay.button.dim / 2.0 + "px");

        $(this.divID + " .left").css("background-color", this.config.autoPlay.button.color);
        $(this.divID + " .right").css("background-color", this.config.autoPlay.button.color);

        let pgm = this;
        $(this.divID + " .play-button").click(function() {
            $(this).toggleClass("paused");
            if (pgm.config.autoPlay.on) {
                pgm._stopAutoPlay();
            } else {
                pgm._startAutoPlay();
            }
        });
    }


    _triggerSpeakerNodeAutoPlay() {
        /* Triggers a speaker node randomly following the specified distribution */

        let chosen_id;
        // If speaker node is of uniform distribution
        if (this.speakerLayerProbabilityDistribution.length == 0) {
            chosen_id = Math.floor(Math.random() * this.graphData.clusterMat[0].length);
        } else {
            chosen_id = this._chooseRandomAdjVertexFromSpeakerLayer();
        }
        this._triggerSpeakerNode(chosen_id);
    }

    _triggerSpeakerNode(id) {
        /* triggers a speaker node by id, traverse down and draw the visited path. */

        let speakerLayerLength = this.graphData.clusterMat[0].length;

        // Only allow the node to be clicked if it is in the speaker layer
        if (id < speakerLayerLength) {
            let clickedVertexId = parseInt(id, 10);
            this._traverseGraph(clickedVertexId, this.graphData.data);
            log("visited path = [" + this.directedPath + "]");
            this._drawGraph(this.graphData.data);
            this._drawVisitedPath(this.graphData.data);

            // testing 
            $(this.divID + ' .path strong').text(this.directedPath);
        } else {
            // Else clear the path
            this._clearVisitedPath();
        }

        // Do not allow user to click
        this.canClick = false;
        setTimeout(() => this.canClick = true, this.config.edge.timeInterval * (this.directedPath.length - 1));

    }


    //    bindData(gd) {
    //        /* 
    //        Used to bind an existing JSON object or an object literal to 
    //        the graph and render the graph.
    //        */
    //        if (!Utils.isObjLiteral(gd)) {
    //            // If not an object literal must be a JSON, we parse it
    //            gd = JSON.parse(gd);
    //        }
    //
    //        if (!gd || !gd.data) {
    //            throw new Error("pgm.bindData(gd): Input graph data is invalid input graph data is empty");
    //        }
    //
    //        if (gd.data.length <= 1) {
    //            throw new Error("pgm.bindData(gd): Input graph data is empty");
    //        }
    //
    //        // Add the this.graphData as a class attribute
    //        this.graphData = gd;
    //        this._dataScreening(this.graphData.data);
    //        this._createEdgesInGraphData(this.graphData.data);
    //        if (this.config.background.grid) {
    //            this_drawGrid();
    //        }
    //        this._drawGraph(this.graphData.data);
    //    }


    display() {
        /* Used to display the graph */

        this._dataScreening(this.graphData.data);

        this._createEdgesInGraphData(this.graphData.data);

        if (this.config.autoPlayable) this._createPlayButton();

        if (this.config.cyclingSpeedControllable) this._createCyclingSpeedControllButton();

        if (this.config.background.grid) this._drawGrid();

        this._drawGraph(this.graphData.data);
    }

    getWeightedAdjacencyMatrix() {
        return this._weightedAdjMat;
    }

    setAdjacentVertex(id, adjVtx) {
        /* Set adjacent vertex for vertex with id */

        if (id === undefined || adjVtx === undefined) {
            throw new Error("pgm.setAdjacentVertex(id, adjVtx) params are not satisfied.");
        }

        this.graphData.data[id].adjacentVertex = adjVtx;
    }

    //    this.setLabel = function (id, label) {
    //        /* Set label for vertex */
    //        this.graphData.data[id].label = label;
    //    };

    //    this.getGraphData = function () {
    //        /* Returns the graphData as  JSON object */
    //        let jsonGraphData = Utils.cloneDR(this.graphData);
    //
    //        console.log(jsonGraphData);
    //
    //        // Delete all the edge circular structures in the object
    //        for (let i = 0; i < jsonGraphData.data.length; i++) {
    //            delete(jsonGraphData.data[i].edges);
    //        }
    //
    //        return JSON.stringify(jsonGraphData);
    //    };



    _changeNodeRadius() {
        /* 
        Change the speaker layer ndoe radius based on the probability distribution
        probabilityDistribution is the array of probability given to each node in the speaker layer
        set probabilityDistribution=[] for uniform distribution
        */
        for (let i = 0; i < this.speakerLayerProbabilityDistribution.length; i++) {
            // Normalize the radius
            let normalizationFactor = 1.0 / this.speakerLayerProbabilityDistribution.length;
            this.graphData.data[i].r *= (this.speakerLayerProbabilityDistribution[i] * 1.0) / normalizationFactor;
        }
    }

    createCluster(cMat, probabilityDistribution, changeNodeRadiusBasedOnDistribution) {
        /* 
        Used to create a clusters of nodes (Graphdata) based on the cMat(cluster matrix).
        Also set the speaker layer probabilility distribution and have the option to
        chagne the spekaer nodes radius based on probability
        
        cMat is the cluster matrix. Ex of cluster mat [layer1_label_array, layer2_label_array, layer3_label_array] 
        probabilityDistribution is the array of probability given to each node in the speaker layer
        set probabilityDistribution=[] for uniform distribution
        changeNodeRadiusBasedOnDistribution is the boolean that governs whether nodes radius are affected by its distribution
        */

        // Error checking
        if (probabilityDistribution.length != 0) {
            if (cMat[0].length != probabilityDistribution.length) {
                throw new Error("pgm.createCluster(): the number of the nodes in the first layer in cMat does not match the length of the probabilityDistribution array");
            }
            let tempDistTotal = 0;
            for (let i = 0; i < probabilityDistribution.length; i++) {
                tempDistTotal += probabilityDistribution[i];
            }
            if (tempDistTotal != 1.0) {
                throw new Error("pgm.createCluster(): the probability of each node in the speaker layer does not add up to 1.0 in probabilityDistribution array");
            }
        }

        this.speakerLayerProbabilityDistribution = probabilityDistribution;


        // Populate cMatDim, cMatDim is the dimension of the matrix, ex: [3,3,3]
        let cMatDim = [];
        for (let i = 0; i < cMat.length; i++) {
            cMatDim[i] = cMat[i].length;
        }

        let offsetPosX = this.config.transform.width / (cMatDim.length + 1); // get the x offset for first node
        let minPosY = this.config.transform.height / (Array.max(cMatDim) + 1); // get the y offset for the layer with the most amount of nodes

        // Data properties: id, x, y, r 
        let data = [];
        let id = 0;
        let x;
        let y;
        let r = Array.min([offsetPosX, minPosY]) * this.config.vertex.radius;

        this.config.vertex.radius = r;

        for (let i = 0; i < cMatDim.length; i++) {
            // Reset offset Y coordinate for each layer
            let offSetPosY = this.config.transform.height / (cMatDim[i] + 1);
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

        // Update the this.config edge width and baseWidth
        this.config.edge.width = r * this.config.edge.width;
        this.config.edge.baseWidth = r * this.config.edge.baseWidth;


        // Create the graphData member variable in pgm
        this.graphData = {
            clusterMat: cMat,
            data: data
        };

        // Change speaker node radius based on distribution
        if (changeNodeRadiusBasedOnDistribution && probabilityDistribution.length > 0) {
            this._changeNodeRadius();
        }
    }

    getGraphData() {
        return this.graphData;
    }

    /*=========== Graphical Model Autoplay ===========*/

    resetChart() {
        /* reset the _weightedAdjMat */
        this._weightedAdjMat.resetMatrixWeight();
        this._weightedAdjMat.redrawMatrix();
    }

    _startAutoPlay() {
        /* called by the play button to start autoplay */
        this.canClick = false;
        if (this._weightedAdjMat) this.resetChart();
        this.config.autoPlay.on = true;
        let random_id = Math.floor(Math.random() * this.graphData.clusterMat[0].length);
        this._triggerSpeakerNodeAutoPlay();
    }

    _stopAutoPlay() {
        /* called by the stop button to stop autoplay */
        this.canClick = true;
        this.config.autoPlay.on = false;

        this._clearVisitedPath();

        if (this._weightedAdjMat) {
            this._weightedAdjMat.resetMatrixWeight();
            this._weightedAdjMat.resetMatrixColorWeight();
            // this._weightedAdjMat.redrawMatrix();
        }
    }


    /*======== Binding Adjacency Matrix To The Graphical Model =======*/

    _updateChart() {
        /* Used in _drawVisitedPath() to update the adjacency matrix _weightedAdjMat */
        let _rowIdx = this.directedPath[0];
        let _colIdx = this.directedPath[this.directedPath.length - 1];
        if (_rowIdx < 0 || _colIdx < 0) return;

        let _rowLabel = this.graphData.data[_rowIdx].label;
        let _colLabel = this.graphData.data[_colIdx].label;
        let cellToUpdate = [_rowLabel, _colLabel];
        log("Update Cell: [" + cellToUpdate + "]");
        this._weightedAdjMat.increaseCellWeight(cellToUpdate, 1);
        this._weightedAdjMat.increaseCellColor(cellToUpdate, 1);
        this._weightedAdjMat.redrawMatrix();
    }

    //    bindChart (_weightedAdjMat) {
    //        /* Used to bind to an existing adjacency matrix _weightedAdjMatf to the graphical model */
    //        if (this._weightedAdjMat != null) {
    //            this._weightedAdjMat = _weightedAdjMat;
    //        } else {
    //            throw new Error("pgm.bindChart(): Graph already has a _weightedAdjMat object.")
    //        }
    //    }

    createChart(chartConfig) {
        /* Create a _weightedAdjMat and bind to the graphic model */

        this.chartConfig = chartConfig;

        if (this.graphData.clusterMat.length < 2) {
            throw new Error("pgm.createChart(): Can not create adjacency matrix for graphical model with layer number less than 2");
            return;
        }
        var _rowLabel = this.graphData.clusterMat[0];
        var _colLabel = this.graphData.clusterMat[this.graphData.clusterMat.length - 1];
        this._weightedAdjMat = new WeightedAdjacencyMatrix(this.divID, chartConfig);
        this._weightedAdjMat.createMatrix(_rowLabel, _colLabel);
    }
}