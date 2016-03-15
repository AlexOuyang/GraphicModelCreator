/*=============== Listener Observer Probability Graphic Model ====================*/
"use strict";


// A wrapper that combines both listenerBeliefPGM and ListenerPGM


class ThoughtBubble {

    constructor(divID, listenerBeliefConfig, listenerConfig, adjacencyMatrixConfig, clusterMat, speakerLayerProbabilityDistribution, changeNodeRadiusBasedOnDistribution) {

        this.divID = divID;
        // parepare two id html elemnts for both listener and listener's belief pgms
        let listenerBeliefID = divID + "ListenerBeliefPGM";
        let listenerID = divID + "ListenerPGM";

        let $listenerBelief = $("<div>", {
            id: listenerBeliefID.substring(1)
        });
        let $listener = $("<div>", {
            id: listenerID.substring(1)
        });

        $(this.divID).append($listenerBelief);
        $(this.divID).append($listener);

        // Creating ListenerBeliefPGM first
        this.listenerBelif = new ListenerBeliefPGM(listenerBeliefConfig, listenerBeliefID);
        this.listenerBelif.createCluster(clusterMat, speakerLayerProbabilityDistribution, true);

        // Create adjacencyMatrix
        this.listenerBelif.createChart(adjacencyMatrixConfig);
        this.listenerBelif.init();

        // Then create ListenerPGM first based on the configuration
        // and bind the data to the graph for rendering
        this.listener = new ListenerPGM(listenerConfig, listenerID);
        this.listener.createCluster(clusterMat, speakerLayerProbabilityDistribution, true);
        this.listener.bindToListenerBeliefPGM(this.listenerBelif);
        this.listener.init();
    }


    setEdgeWeights(vertexId, adjacentEdgeWeights) {
        this.listenerBelif.setEdgeWeights(vertexId, adjacentEdgeWeights);
        this.listenerBelif.redraw();
        this.listener.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
        this.listener.redraw();
        return this;
    }

}









class ListenerBeliefPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }

    /*@Override*/
    // _dataScreening(data) {
    //     super._dataScreening(data);
    // }

    /*@Override*/
    _updateChart() {
        // After updating the chart updating the weight in ListenerPGM as well
        super._updateChart();

        let weight = [];

        let firstLayerLength = this.graphData.clusterMat[0].length;
        let lastLayerLength = this.graphData.clusterMat[this.graphData.clusterMat.length - 1].length;
        // Calculate the new edge weights based on adj matrix
        for (let i = 0; i < firstLayerLength; i++) {
            for (let j = 0; j < lastLayerLength; j++) {
                let M_ij = this.getWeightedAdjacencyMatrix().getCellWeight([i, j]);
                let Mij_summation_over_j = 0;
                for (let sigma_sub_j = 0; sigma_sub_j <= j; sigma_sub_j++) {
                    Mij_summation_over_j += this.getWeightedAdjacencyMatrix().getCellWeight([i, sigma_sub_j]);
                }
                // log([M_ij, Mij_summation_over_j])
                let W_ij = (M_ij === 0) ? 0 : M_ij / Mij_summation_over_j;
                weight.push(W_ij);
            }
        }

        log("Weight = " + weight);

        // Noralize the weights so that all node's edge weights sum up to 1

        let vertexWeightSumTemp = []; // each element is the weight sum for a vertex
        let weightIdx = 1;
        let tempWeightSumForVertex = 0;
        for (let i = 0; i < weight.length; i++) {
            tempWeightSumForVertex += weight[i];
            if (weightIdx % lastLayerLength == 0) {
                // push vertex sum "lastLayerLength" many times so its easier to normalize weight
                for (let j = 0; j < lastLayerLength; j++) {
                    vertexWeightSumTemp.push(tempWeightSumForVertex);
                }
                tempWeightSumForVertex = 0;
            }
            weightIdx++;
        }

        log("vertexWeightSumTemp = " + vertexWeightSumTemp);

        // Normalize
        let normalizedWeight = [];
        for (let i = 0; i < weight.length; i++) {
            normalizedWeight[i] = (vertexWeightSumTemp[i] === 0) ? 0 : weight[i] / vertexWeightSumTemp[i];
        }

        log("normalized weight = " + normalizedWeight);

        this.listenerPGM.updateWeight(normalizedWeight);
        this.listenerPGM.redraw();
    }

    /*@Override*/
    // _backgroundOnClickToResetAdjMatrix() {
    //     // overrie original function so when background is clicked the matrix won't reset
    //     return false;
    // }
    // _backgroundOnClick() {}

    /*@Override*/
    _stopAutoPlay() {
        // When stop button is clicked, reset the listenerPGM edgeweights as well
        super._stopAutoPlay();
        // this.listenerPGM.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
        // this.listenerPGM.redraw();
    }

    /*@Override*/
    _startAutoPlay() {
        /* When stop button is clicked, reset the listenerPGM edgeweights as well */


        // Stop listenerPGM autoplay before calling super._startPlay() so that _clearVisitedPath() method won't destroy both listenerPGM's autoPlay and this graph's autoPlay
        if (this.listenerPGM.config.autoPlay.on) {
            this.listenerPGM._stopAutoPlay();
        }

        super._startAutoPlay();

        // reset the listenerPGM edge weights
        this.listenerPGM.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
        this.listenerPGM.redraw();
    }

    /* @Override */
    createCluster(cMat, probabilityDistribution, changeNodeRadiusBasedOnDistribution) {

        this.listenerClusterMatrix = cMat; // mirror image of the belisef graph
        this.listenerBeliefClusterMatrix = [cMat[1], cMat[0]];

        if (cMat.length != 2)
            throw new Error("ListenerBeliefPGM.createCluster(): invalid cMat length. This graph only supports two layer graphs.");
        super.createCluster(this.listenerBeliefClusterMatrix, probabilityDistribution, changeNodeRadiusBasedOnDistribution);
    }


    bindToListenerPGM(listener) {
        // Used to bind listenerPGM to listenerBeliefPGM
        this.listenerPGM = listener;
    }
}



class ListenerPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }


    /*@Override*/
    _updateChart() {}

    /*@Override*/
    _backgroundOnClick() {
        // Prevent adjMatrix gets reset when click on background
        if (this.canClick && !this.listenerBeliefPGM.config.autoPlay.on) {
            super._backgroundOnClick();
        }
    }

    /*@Override*/
    // _triggerSpeakerNode(id) {
    // /* triggers a speaker node by id, traverse down and draw the visited path. */

    // let speakerLayerLength = this.graphData.clusterMat[0].length;

    // // Only allow the node to be clicked if it is in the speaker layer
    // if (id < speakerLayerLength) {
    //     let clickedVertexId = parseInt(id, 10);
    //     this._traverseGraph(clickedVertexId, this.graphData.data);
    //     log("visited path = [" + this.directedPath + "]");
    //     this._drawGraph(this.graphData.data);
    //     this._drawVisitedPath(this.graphData.data);

    //     // testing 
    //     $(this.divID + ' .path strong').text(this.directedPath);
    // } else {
    //     // Else clear the path
    //     this._clearVisitedPath();
    // }

    // // Do not allow user to click
    // this.canClick = false;
    // setTimeout(() => this.canClick = true, this.config.edge.timeInterval * (this.directedPath.length - 1));

    // super._triggerSpeakerNode(id);

    // let speakerLayerLength = this.graphData.clusterMat[0].length;
    // // Only allow the node to be clicked and starting autoplay only if it is in the speaker layer
    // if (id < speakerLayerLength) {
    //     this._startAutoPlay();
    // }

    // }

    // bindChart(weightedAdjMat) {
    //     /* Used to bind to an existing adjacency matrix _weightedAdjMatf to the graphical model */
    //     if (!this._weightedAdjMat) {
    //         this._weightedAdjMat = weightedAdjMat;
    //     } else {
    //         throw new Error("pgm.bindChart(): Graph already has a _weightedAdjMat object.")
    //     }
    // }

    resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights() {
        // Set listenerPGM's weights to be listenerBeliefPGM's edge weights
        for (let i = 0; i < this.graphData.clusterMat[0].length; i++) {
            let listenerBeliefAdjVtx = this.listenerBeliefPGM.getGraphData().data[i].adjacentVertex;
            let adjVtx = Utils.cloneDR(listenerBeliefAdjVtx);
            this.graphData.data[i].adjacentVertex = adjVtx;
        }
    }

    bindToListenerBeliefPGM(belief) {
        // This binds the listener and the listener's belief to each other and set listener's weight.
        belief.bindToListenerPGM(this);
        this.listenerBeliefPGM = belief;

        let listenerPGM = this;
        // Redefine onClick when bind to listenerBeliefPGM to prevent adjMatrix gets reset when click on background
        this.onClick = d3.behavior.drag()
            .origin(d => d)
            .on("dragstart", function(d) {
                // Check if the clicked node is in the first layer
                // which are the num of nodes in first layer of clusterMat
                // Only allow user to click the node if autoplay is off
                if (!listenerPGM.listenerBeliefPGM.config.autoPlay.on) {
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("dragging", true);

                    // Option 1: Only draw visited path once
                    // listenerPGM._triggerSpeakerNode(this.id);

                    // Option 2: AutoPlay when speaker node is clicked
                    let speakerLayerLength = listenerPGM.graphData.clusterMat[0].length;
                    if (listenerPGM.config.autoPlay.on) {
                        listenerPGM._stopAutoPlay();
                    } else {
                        listenerPGM._startAutoPlay();
                    }
                }
            });

        this.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
    }


    updateWeight(weight) {
        // Udate the pgm weigth
        let weightIdx = 0;
        for (let i = 0; i < this.graphData.clusterMat[0].length; i++) {
            for (let j = 0; j < this.graphData.data[i].adjacentVertex.length; j++) {
                this.graphData.data[i].adjacentVertex[j].weight = weight[weightIdx];
                // log(this.graphData.data[i].adjacentVertex[j].weight);
                weightIdx++;
            }
        }
    }

}