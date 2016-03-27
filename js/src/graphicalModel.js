/*=============== Probability Graphic Model ====================*/

"use strict";

/**
 * The regular probability Graphical that supports auto play loops and zoom in capability.
 */
class GraphicalModel {

    /**
     * Create a defiend space for the graphical model.
     * @param {object} graphConfiguration - A configuration object for configuring the properties of this _pgm, it can be obtained via Config.getPGMConfig().
     * @param {string} divID - The id of the html tag that contains this pgm, it is of the form '#id_name'.
     */
    constructor(graphConfiguration, divID) {

        /**
         * This graph's configuration.
         * @memberof GraphicalModel
         * @type {object}
         */
        this.config = graphConfiguration;

        /**
         * Graph data includes labels, vertex and edge data.
         * @memberof GraphicalModel
         * @type {object}
         * @property {object} clusterMat - A matrix of vertex labels in every layer.
         * @property {object} data - An arry of vertex data where each vertex specifies its adjacency edges.
         */
        this.graphData = {
            clusterMat: [], // data specifies the nodes in each layer
            data: [] // data binds to the graph
        };

        this._weightedAdjMat = null; // Holds the adjacency matrix chart 

        this._directedPath = []; // _directedPath is a list of visited nodes' ID

        this._canClick = true; // Used to keep user from clicking when the graph is traversing

        this._speakerLayerProbabilityDistribution = []; //  an array of probability given to each node in the speaker layer, probabilityDistribution=[] if uniform distribution


        let _pgm = this;

        this._divID = divID;

        // Click on the node in the speaker layer to draw visited path
        this.onClick = d3.behavior.drag()
            .origin(d => d)
            .on("dragstart", function(d) {
                // Check if the clicked node is in the first layer
                // which are the num of nodes in first layer of clusterMat
                // Only allow user to click the node if autoplay is off
                if (_pgm._canClick && !_pgm.config.autoPlayable) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);
                    _pgm._triggerSpeakerNode(this.id);
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
                _pgm._backgroundOnClick();
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

    /**
     * Reset the adjacency matrix attached to this graphical model when the background is clicked. It is called in the on click listener function defined within this graphical model.
     * @private
     */
    _backgroundOnClickToResetAdjMatrix() {
        if (this._weightedAdjMat) {
            this._weightedAdjMat.resetMatrixWeight();
            this._weightedAdjMat.resetMatrixColorWeight();
            this._weightedAdjMat.redrawMatrix();
        }
    }

    /**
     * Reset the graph after visited path highlighting is finished. It is called in the on click listener function defined within this graphical model.
     * @private
     */
    _backgroundOnClick() {
        if (!this.config.autoPlayable) {
            if (this._canClick && !this.config.autoPlay.on) {
                this._clearVisitedPath();
                // Do not allow user to click until visited path highlighting is finished
                this._canClick = false;
                setTimeout(() => this._canClick = true, this.config.edge.timeInterval * (this._directedPath.length - 1));

                // click on background to reset adjacency matrix
                this._backgroundOnClickToResetAdjMatrix();
            }
        }
    }

    /**
     * Verifies if each vertex's id matches its position in the data array and if the weights of all edges comin from each vertex sum up to 1.
     * @private
     */
    _dataScreening(data) {

        if (data.length <= 1) {
            throw new Error("input graph data is empty");
        }

        let weightSum = 0;
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            if (data[vertexIdx].id !== vertexIdx) {
                throw new Error("Vertex's id must match its position index in the list of vertices. The " + vertexIdx + " th element in the list does not match its position index");
            }
            let allEdgeZero = true;
            let adjVertices = data[vertexIdx].edgeWeights;
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


    /**
     * Modifies the data in graphData by adding a list of edges into each vertex.
     * @private
     */
    _createEdgesInGraphData(data) {

        if (data.length <= 1) {
            throw new Error("GraphicalModel._createEdgesInGraphData(): Input graph data is empty");
        }

        // Go through each vertex in data and add 'edges' attribute to each vertex
        for (let vertexIdx = 0; vertexIdx < data.length; vertexIdx++) {
            let currentVertex = data[vertexIdx];
            if (!currentVertex.edgeWeights) {
                currentVertex.edges = null;
            } else {
                currentVertex.edges = [];
                for (let adjVertexIdx = 0; adjVertexIdx < currentVertex.edgeWeights.length; adjVertexIdx++) {
                    let targetVertexId = currentVertex.edgeWeights[adjVertexIdx].id;
                    let targetVertexWeight = currentVertex.edgeWeights[adjVertexIdx].weight;

                    let edge = {
                        edgeWeight: targetVertexWeight,
                        edgeNodes: [currentVertex, data[targetVertexId]]
                    };

                    currentVertex.edges.push(edge);
                }
            }
        }
    }

    /**
     * Choose a random adjacent vertex in the speaker layer based on the edge weights.
     * @private
     */
    _chooseRandomAdjVertexFromSpeakerLayer() {

        let weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
        let weight = 0;
        for (let i = 0; i < this._speakerLayerProbabilityDistribution.length; i++) {
            weight += this._speakerLayerProbabilityDistribution[i];
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

    /**
     * Takes in a vertex data object from the array of data in graphData and chooses a random adjacent vertex in the next layer based on the edge weights.
     * @private
     */
    _chooseRandomAdjVertex(vertex) {

        let weightDistribution = [0]; // weightDistribution is a distribution from 0 to 1, ex: [0, 0.4, 1]
        let weight = 0;
        for (let i = 0; i < vertex.edgeWeights.length; i++) {
            weight += vertex.edgeWeights[i].weight;
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
                return vertex.edgeWeights[i].id;
            }
        }
    }

    /**
     * Takes in the id of a node and traverse trough the graph to connect. impacted nodes and returns the id of the visited node.
     * @private
     */
    _traverseGraph(vertexId, data) {

        let visitedNodes = [vertexId];
        let node = data[vertexId];

        while (node !== undefined && node.edgeWeights !== undefined) {
            console.log("Current Vertex: " + vertexId);
            vertexId = this._chooseRandomAdjVertex(node);
            // if (vertexId < 0) break;
            console.log("Vextex chosen: " + vertexId);
            console.log("--------");
            node = data[vertexId];
            visitedNodes.push(vertexId);
        }

        this._directedPath = visitedNodes;
    }


    /**
     * Draws the grid in the background.
     * @private
     */
    _drawGrid() {

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

    /**
     * Draws the text labels in each vertex.
     * @private
     */
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

    /**
     * Draws the grpah vertices.
     * @private
     */
    _drawVertices(data) {
        /* clear vertices then redraw all the vertices in the grpah */

        d3.selectAll(this._divID + " g .vertex").remove();

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

    /**
     * Draws the grpah edges highlight the clicked vertex.
     * @private
     */
    _drawEdges(data) {

        // clear edges then redraw all the edges in the graph 
        d3.selectAll(this._divID + " path").remove();

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

    /**
     * Draw an highlighted edge between two vertices.
     * @private
     * @param {object} graphConfiguration - A configuration object for configuring the properties of this _pgm, it can be obtained via Config.getPGMConfig().
     * @param {object} EdgeNodes - A pair of nodes (e.g. [node1, node2]) which are two ends of an edge, lengthMultiplier is used to determine the magnitude of the edge.
     * @param {number} lengthMultiplier - Used to increase the length of the highlighted edge on both ends.
     * @return {object} highlightedEdge - A highlightedEdge objects that contains the nodes information and the length information
     */
    _drawHighlightedEdge(edgeNodes, lengthMultiplier) {
        let x0 = edgeNodes[0].x,
            y0 = edgeNodes[0].y,
            r0 = edgeNodes[0].r,
            x1 = edgeNodes[1].x,
            y1 = edgeNodes[1].y,
            r1 = edgeNodes[1].r,
            distX = x1 - x0,
            distY = y0 - y1,
            dist = Math.sqrt(distX * distX + distY * distY),
            ratio0 = r0 / (lengthMultiplier * dist),
            ratio1 = r1 / (lengthMultiplier * dist),

            // tempEdges for highlighting the visited edges
            highlightedEdgeNodes = [{
                x: x0 + distX * ratio0,
                y: y0 - distY * ratio0
            }, {
                x: x1 - distX * ratio1,
                y: y1 + distY * ratio1
            }];


        let highlightedEdge = {
            nodes: highlightedEdgeNodes,
            length: dist
        };

        return highlightedEdge;
    }

    _drawVisitedPath(data) {
        /* Draw visited edges based on weight in highlighted color */

        for (let vertexIdx = 0; vertexIdx < this._directedPath.length; vertexIdx++) {

            // check if there's -1 in _directedPath, if yes, do not draw the path and trigger a new speaker
            if (this._directedPath[vertexIdx] < 0) {

                // Draw the first vertex when the path start highlighting
                this.vertices.append("circle")
                    .attr("class", d => {
                        // if the node is in the path then draw it in a different color
                        if (this._directedPath[0] === d.id) {
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
                // Iterate through the list of ID in _directedPath 
                let currentVertex = data[this._directedPath[vertexIdx]];
                if (currentVertex.edges) {
                    for (let edgeIdx = 0; edgeIdx < currentVertex.edges.length; edgeIdx++) {
                        let edgeNodes = currentVertex.edges[edgeIdx].edgeNodes;
                        let edgeWeight = currentVertex.edges[edgeIdx].edgeWeight * this.config.edge.width;
                        // If the edge is in the _directedPath then draw different color
                        if (this._directedPath.indexOf(edgeNodes[0].id) > -1 && this._directedPath.indexOf(edgeNodes[1].id) > -1) {

                            // Create two new points to draw a shorter edge so the new 
                            // edge will not cover the id in the node
                            let highlightingEdgeLengthMultiplier = 1.1; // Used to increase the length of the highlighted edge on both ends;
                            let highlightedEdge = this._drawHighlightedEdge(edgeNodes, highlightingEdgeLengthMultiplier);
                            let tempEdges = highlightedEdge.nodes
                            let lineLength = highlightedEdge.length;

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
                                this.vertices
                                    .append("circle")
                                    .attr("class", d => {
                                        // if the node is in the path then draw it in a different color
                                        if (this._directedPath.indexOf(d.id) <= (vertexIdx + 1) &&
                                            this._directedPath.indexOf(d.id) > -1) {
                                            return "visitedVertex";
                                        }
                                    })
                                    .attr("r", d => d.r);

                                // Add a text element to the previously added g element.
                                this._drawText();

                                // Visited path ending condition
                                let endingVertexIdx = this._directedPath.length - 2;
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
                                    if (this._directedPath[0] === d.id) {
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

    /**
     * Used to redraw the graph on start and when moving.
     * @private
     */
    _drawGraph(data) {
        this._drawEdges(data);
        this._drawVertices(data);
    }

    /**
     * Kill all setTimeOut used to draw the visited path.
     * @private
     */
    _killAllSetTimeOut() {
        for (var i = 1; i < 99999; i++) {
            window.clearInterval(i);
            window.clearTimeout(i);
            if (window.mozCancelAnimationFrame) window.mozCancelAnimationFrame(i); // Firefox
        }
    }

    /**
     * Clear the highlighted path and redraw the graph.
     * @private
     */
    _clearVisitedPath() {

        this._killAllSetTimeOut();

        // Then clear the path storage
        this._directedPath = [];
        this._drawGraph(this.graphData.data);
    }

    /**
     * Create the cycling speed control button on the top of the graph.
     * @private
     */
    _createCyclingSpeedControlButton() {
        let _pgm = this;

        let sliderID = this._divID.substring(1) + "-slider-range";
        let $DivSlider = $("<div>", {
            id: sliderID
        });
        $(this._divID).prepend($DivSlider);
        $("#" + sliderID).slider({
            range: false, // two buttons caps a range
            min: 2,
            max: 1000,
            value: _pgm.config.edge.timeInterval,
            slide: function(event, ui) {
                _pgm._cyclingSpeedControlButtonOnClick(ui);
            }
        });

        let sliderWidth = (this._weightedAdjMat === null) ? this.config.transform.width : this._weightedAdjMat.config.transform.width + this.config.transform.width;
        $("#" + sliderID).css("width", sliderWidth + "px");
    }

    /**
     * Called by jQuery slider function defined in _createCyclingSpeedControlButton to update the graph cycling speed based on the position of the UI button.
     * @private
     */
    _cyclingSpeedControlButtonOnClick(ui) {
        console.log("Slider Speed: " + ui.value);
        let sphereRad = ui.value;
        this.config.edge.timeInterval = ui.value;
        this.config.autoPlay.timeIntervalBetweenCycle = ui.value;
    }

    /**
     * Create the auto play button.
     * @private
     */
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

        $(this._divID).prepend($Button);

        $Button.append($left);
        $Button.append($right);
        $Button.append($triangle1);
        $Button.append($triangle2);

        // Update button dimension first
        let resizedButton = Array.min([this.config.transform.height, this.config.transform.width]) / 10.0 * this.config.autoPlay.button.dim;
        let maxButtonSize = 35.0; // The max button size is 40px so that buttons won't get too big
        this.config.autoPlay.button.dim = (resizedButton > maxButtonSize) ? maxButtonSize : resizedButton;

        $(this._divID + " .play-button").css("height", this.config.autoPlay.button.dim + "px")
            .css("width", this.config.autoPlay.button.dim + "px");

        $(this._divID + " .triangle-1").css("border-right-width", this.config.autoPlay.button.dim + "px")
            .css("border-top-width", this.config.autoPlay.button.dim / 2.0 + "px")
            .css("border-bottom-width", this.config.autoPlay.button.dim / 2.0 + "px");

        $(this._divID + " .triangle-2").css("border-right-width", this.config.autoPlay.button.dim + "px")
            .css("border-top-width", this.config.autoPlay.button.dim / 1.9 + "px")
            .css("border-bottom-width", this.config.autoPlay.button.dim / 2.0 + "px");

        $(this._divID + " .left").css("background-color", this.config.autoPlay.button.color);
        $(this._divID + " .right").css("background-color", this.config.autoPlay.button.color);

        let _pgm = this;
        $(this._divID + " .play-button").click(function() {
            $(this).toggleClass("paused");
            if (_pgm.config.autoPlay.on) {
                _pgm._stopAutoPlay();
            } else {
                _pgm._startAutoPlay();
            }
        });
    }


    /**
     * Triggers a speaker node randomly following the specified speaker ndoe probability distribution.
     * @private
     */
    _triggerSpeakerNodeAutoPlay() {

        let chosen_id;
        // If speaker node is of uniform distribution
        if (this._speakerLayerProbabilityDistribution.length == 0) {
            chosen_id = Math.floor(Math.random() * this.graphData.clusterMat[0].length);
        } else {
            chosen_id = this._chooseRandomAdjVertexFromSpeakerLayer();
        }
        this._triggerSpeakerNode(chosen_id);
    }

    /**
     * Triggers a speaker node by id, traverse down and draw the visited path.
     * @private
     */
    _triggerSpeakerNode(id) {

        let speakerLayerLength = this.graphData.clusterMat[0].length;

        // Only allow the node to be clicked if it is in the speaker layer
        if (id < speakerLayerLength) {
            let clickedVertexId = parseInt(id, 10);
            this._traverseGraph(clickedVertexId, this.graphData.data);
            log("visited path = [" + this._directedPath + "]");
            this._drawGraph(this.graphData.data);
            this._drawVisitedPath(this.graphData.data);

            // testing 
            $(this._divID + ' .path strong').text(this._directedPath);
        } else {
            // Else clear the path
            this._clearVisitedPath();
        }

        // Do not allow user to click
        this._canClick = false;
        setTimeout(() => this._canClick = true, this.config.edge.timeInterval * (this._directedPath.length - 1));

    }

    /**
     * Use this to redraw the graph after reset edge weights.
     * @return {object} This graphicalModel object.
     */
    redraw() {
        this._createEdgesInGraphData(this.graphData.data);
        this._drawGraph(this.graphData.data);
        return this;
    }

    /**
     * Used to create and display the graph. Normally called after createCluster().
     * @return {object} this graphicalModel object.
     * @example
     * graphicalModel.init();
     */
    init() {

        this._dataScreening(this.graphData.data);

        this.setUniformEdgeWeights();

        this._createEdgesInGraphData(this.graphData.data);

        if (this.config.autoPlayable) this._createPlayButton();

        if (this.config.cyclingSpeedControllable) this._createCyclingSpeedControlButton();

        if (this.config.background.grid) this._drawGrid();

        this._drawGraph(this.graphData.data);

        return this;
    }

    /**
     * Used to get the weighted adjacency matrix object attached to this graph.
     * @return {object} The weighted adjacency matrix object.
     */
    getWeightedAdjacencyMatrix() {
        return this._weightedAdjMat;
    }

    /**
     * Set the adjacency edges for a vertex by id.
     * @param {number} id - The id or the index of the vertex in the data array of the graphData.
     * @param {object} edges - The object contains the adjacency edges of a vertex and their weights.
       return this pgm to allow setEdgeWeights to be stacked.
     * @example
     * // Create three directed edges 0->3, 0->4, 0->5 with edge weiths 0.8, 0.1 and 0.1
     * graphicalModel.setEdgeWeights(0, [{
            id: 3,
            weight: 0.8
        }, {
            id: 4,
            weight: 0.1
        }, {
            id: 5,
            weight: 0.1
        }]);
     * @return {object} This grpahicalModel object.
     */
    setEdgeWeights(id, edges) {
        /* Set adjacent vertex for vertex with id 
            return this pgm to allow setEdgeWeights to be stacked
        */

        if (id === undefined || edges === undefined) {
            throw new Error("graphicalModel.setEdgeWeights(id, adjVtx) params are not defined.");
        }

        this.graphData.data[id].edgeWeights = edges;
        this.redraw();

        return this;
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


    /** 
     * A helper method used by createCluster() to change the speaker layer ndoe radius based on the probability distribution.
     * @private
     */
    _changeNodeRadius(baseRadius) {
        /* 
        probabilityDistribution is the array of probability given to each node in the speaker layer
        set probabilityDistribution=[] for uniform distribution
        */

        let normalizeBaseRadiusMultiplier = 0.4; // increase base radius size
        let normalizeExtraRadiusBasedOnDistributionMultiplier = 0.7; // increase extra radius size

        for (let i = 0; i < this._speakerLayerProbabilityDistribution.length; i++) {
            // Normalize the radius
            let normalizationFactor = 1.0 / this._speakerLayerProbabilityDistribution.length / normalizeExtraRadiusBasedOnDistributionMultiplier;
            this.graphData.data[i].r = (baseRadius * normalizeBaseRadiusMultiplier) + this.graphData.data[i].r * (this._speakerLayerProbabilityDistribution[i] * 1.0) / normalizationFactor;
        }
    }

    /**
     * Used to create an array of vertix data in graphData based on the label cluster matrix (cMat). The graph edge weights are set to be uniform by defaut.
     * @param {array} cMat - The label cluster matrix holds the labels. Ex of cluster mat [layer1_label_array, layer2_label_array, layer3_label_array] where each layer_label_array holds an array of labelrs in one layer.
     * @param {array} probabilityDistribution - The array of probability given to each node in the speaker layer to be triggered. For uniform distribution, set probabilityDistribution = [].
     * @param {boolean} changeNodeRadiusBasedOnDistribution - Governs whether vertex radius are affected by its distribution.
     * @return {object} This graphicalModel object.
     * @example
     * graphicalModel.createCluster(clusterMat, speakerNodeProbabilityDistribution, true);
     */
    createCluster(cMat, probabilityDistribution, changeNodeRadiusBasedOnDistribution) {

        // Error checking
        if (probabilityDistribution.length != 0) {
            if (cMat[0].length != probabilityDistribution.length) {
                throw new Error("graphicalModel.createCluster(): the number of the nodes in the first layer in cMat does not match the length of the probabilityDistribution array");
            }
            let tempDistTotal = 0;
            for (let i = 0; i < probabilityDistribution.length; i++) {
                tempDistTotal += probabilityDistribution[i];
            }
            if (tempDistTotal != 1.0) {
                throw new Error("graphicalModel.createCluster(): the probability of each node in the speaker layer does not add up to 1.0 in probabilityDistribution array");
            }
        }

        this._speakerLayerProbabilityDistribution = probabilityDistribution;

        this.cMatDim = []; //cMatDim is the dimension of the matrix, ex: [3,3,3]

        // Populate cMatDim
        for (let i = 0; i < cMat.length; i++) {
            this.cMatDim[i] = cMat[i].length;
        }

        let offsetPosX = this.config.transform.width / (this.cMatDim.length + 1); // get the x offset for first node
        let minPosY = this.config.transform.height / (Array.max(this.cMatDim) + 1); // get the y offset for the layer with the most amount of nodes

        // Data properties: id, x, y, r 
        let data = [];
        let id = 0;
        let x;
        let y;
        let r = Array.min([offsetPosX, minPosY]) * this.config.vertex.radius;

        this.config.vertex.radius = r;

        for (let i = 0; i < this.cMatDim.length; i++) {
            // Reset offset Y coordinate for each layer
            let offSetPosY = this.config.transform.height / (this.cMatDim[i] + 1);
            for (let j = 0; j < this.cMatDim[i]; j++) {
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
        for (let i = 0; i < cMat.length; i++)
            for (let j = 0; j < cMat[i].length; j++)
                data[id_temp++].label = cMat[i][j];


        // Update the this.config edge width and baseWidth
        this.config.edge.width = r * this.config.edge.width;
        this.config.edge.baseWidth = r * this.config.edge.baseWidth;


        // Create the graphData member variable in _pgm
        this.graphData = {
            clusterMat: cMat,
            data: data
        };

        // Change speaker node radius based on distribution
        if (changeNodeRadiusBasedOnDistribution && probabilityDistribution.length > 0) this._changeNodeRadius(r);

        return this;
    }

    /**
     * Get the vertex id by vertexCoordinate.
     * @param {array} vertexCoordinate - A coordiante pair, e.g [layer index, vertex index at that layer]
     * @return {number} id_temp - The id of the vertex in the data array of the graphData.
     */
    getVertexId(vertexCoordinate) {

        let layerIdx = vertexCoordinate[0];
        let vertexIdx = vertexCoordinate[1];

        if (layerIdx >= this.cMatDim.length || vertexIdx >= this.cMatDim[layerIdx])
            throw new Error("graphicalModel.getVertexId(): invalid vertex coordinate input, the vertex being accessed does not exist in the graph. Your input vertex coordinate is [" + vertexCoordinate + "], but the dimention of the cluster matrix is [" + this.cMatDim + "].");

        let id_temp = 0;
        for (let i = 0; i < layerIdx; i++) id_temp += this.cMatDim[i];
        id_temp += vertexIdx;

        return id_temp;
    }


    /**
     * Set the graph edge weights to be uniform.
     */
    setUniformEdgeWeights() {
        for (let layerIdx = 0; layerIdx < this.cMatDim.length - 1; layerIdx++) {
            for (let vertexIdx = 0; vertexIdx < this.cMatDim[layerIdx]; vertexIdx++) {
                let vertexID = this.getVertexId([layerIdx, vertexIdx]);
                let numOfNodesNextLayer = this.cMatDim[layerIdx + 1];
                let edgeWeights = [];
                for (let i = 0; i < numOfNodesNextLayer; i++) {
                    edgeWeights[i] = {
                        id: this.getVertexId([layerIdx + 1, i]),
                        weight: 1.0 / numOfNodesNextLayer
                    };
                }
                this.setEdgeWeights(vertexID, edgeWeights);
            }
        }
    }


    /*=========== Graphical Model Autoplay ===========*/

    /**
     * Reset the weighted adjacency matrix weights.
     */
    resetChart() {
        this._weightedAdjMat.resetMatrixWeight();
        this._weightedAdjMat.redrawMatrix();
    }

    /**
     * Start the autoPlay cycle. Called in on click listener function defiend in the vertex.
     * @private
     */
    _startAutoPlay() {
        /* called by the play button to start autoplay */
        this._canClick = false;
        if (this._weightedAdjMat) this.resetChart();
        this.config.autoPlay.on = true;
        this._triggerSpeakerNodeAutoPlay();
    }

    /**
     * Stop the autoPlay cycle. Called in on click listener function defiend in the vertex.
     * @private
     */
    _stopAutoPlay() {
        /* called by the stop button to stop autoplay */
        this._canClick = true;
        this.config.autoPlay.on = false;

        this._clearVisitedPath();

        if (this._weightedAdjMat) {
            this._weightedAdjMat.resetMatrixWeight();
            this._weightedAdjMat.resetMatrixColorWeight();
            // this._weightedAdjMat.redrawMatrix();
        }
    }


    /*======== Binding Adjacency Matrix To The Graphical Model =======*/

    /**
     * Used in _drawVisitedPath() to update the adjacency matrix cell weights and color.
     * @private
     */
    _updateChart() {
        let _rowIdx = this._directedPath[0];
        let _colIdx = this._directedPath[this._directedPath.length - 1];
        if (_rowIdx < 0 || _colIdx < 0) return;

        let _rowLabel = this.graphData.data[_rowIdx].label;
        let _colLabel = this.graphData.data[_colIdx].label;
        let cellToUpdate = [_rowLabel, _colLabel];
        log("Update Cell: [" + cellToUpdate + "]");
        this._weightedAdjMat.increaseCellWeight(cellToUpdate, 1);
        this._weightedAdjMat.increaseCellColor(cellToUpdate, 1);
        this._weightedAdjMat.redrawMatrix();
    }


    /**
     * Used create a weighted adjacency matrix for this graph based on the matrix config object.
     * @param {object} chartConfig - The matrix configuration object. It can be obtained via Config.getAdjacencyMatrixConfig().
     * @return {object} This graphicalModel object.
     */
    createAdjacencyMatrix(chartConfig) {
        /* Create a _weightedAdjMat and bind to the graphic model */

        this.chartConfig = chartConfig;

        if (this.graphData.clusterMat.length < 2) {
            throw new Error("graphicalModel.createAdjacencyMatrix(): Can not create adjacency matrix for graphical model with layer number less than 2");
            return;
        }

        let _rowLabel = this.graphData.clusterMat[0];
        let _colLabel = this.graphData.clusterMat[this.graphData.clusterMat.length - 1];
        this._weightedAdjMat = new WeightedAdjacencyMatrix(this._divID, chartConfig);
        this._weightedAdjMat.createMatrix(_rowLabel, _colLabel);

        return this;
    }
}