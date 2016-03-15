/*=============== Listener Observer Probability Graphic Model ====================*/
"use strict";


// A wrapper that combines both listenerBeliefPGM and ListenerPGM


class ThoughtBubble {

    constructor(divID, listenerBeliefConfig, listenerConfig, adjMatConfig, cMat, speakerLayerProbabilityDistribution, changeNodeRadiusBasedOnDistribution) {

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
        this.listenerBelif = new ListenerBeliefPGM(listenerBeliefConfig, listenerBeliefID)
            .createCluster(cMat, speakerLayerProbabilityDistribution, true)
            .createAdjacencyMatrix(adjMatConfig)
            .init();

        // Then create ListenerPGM first based on the configuration
        // and bind the data to the graph for rendering
        let listenerClusterMatrix = [cMat[1], cMat[0]]; // mirror image of the belisef graph
        this.listener = new ListenerPGM(listenerConfig, listenerID)
            .createCluster(listenerClusterMatrix, [], true)
            .init();

        this.listener.bindToListenerBeliefPGM(this.listenerBelif)
    }


    setEdgeWeights(vertexId, adjacentEdgeWeights) {
        this.listenerBelif.setEdgeWeights(vertexId, adjacentEdgeWeights);
        this.listener.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
        return this;
    }

}


/* 
ListenerBeliefPGM is composed of ListenerPGM
*/
class ListenerBeliefPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }

    /*@Override*/
    // _dataScreening(data) {
    //     super._dataScreening(data);
    // }

    _calculateWeights() {
        /*
            returns the normalized weights in a 1D array in the form of Wij, ex, [W_sub(1,1), W_sub(1,2), W_sub(2,1), W_sub(2,2)]
        */
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
            if (weightIdx % firstLayerLength == 0) {
                // push vertex sum "firstLayerLength" many times so its easier to normalize weight
                for (let j = 0; j < firstLayerLength; j++) {
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

        return normalizedWeight;
    }

    /*@Override*/
    _updateChart() {
        // After updating the chart updating the weight in ListenerPGM as well
        super._updateChart();

        let updatedWeights = this._calculateWeights()
        this.listenerPGM.updateWeight(updatedWeights);
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
        super._stopAutoPlay();
        // When stop button is clicked, reset the listenerPGM edgeweights as well
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

        this.listenerClusterMatrix = [cMat[1], cMat[0]]; // mirror image of the belisef graph
        this.listenerBeliefClusterMatrix = cMat;

        if (cMat.length != 2)
            throw new Error("ListenerBeliefPGM.createCluster(): invalid cMat length. This graph only supports two layer graphs.");
        super.createCluster(this.listenerBeliefClusterMatrix, probabilityDistribution, changeNodeRadiusBasedOnDistribution);
        return this;
    }


    bindToListenerPGM(listener) {
        // Used to bind listenerPGM to listenerBeliefPGM
        this.listenerPGM = listener;
        return this;
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


    resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights() {
        // Set listenerPGM to be listenerBeliefPGM's mirror
        let weights = [];
        for (let i = 0; i < this.cMatDim[0]; i++) {
            for (let vertexIdx = 0; vertexIdx < this.listenerBeliefPGM.cMatDim[0]; vertexIdx++) {
                let listenerEdgeWeights = this.listenerBeliefPGM.getGraphData().data[vertexIdx].edgeWeights;
                weights.push(listenerEdgeWeights[i].weight);
            }
        }
        this.updateWeight(weights);
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

        return this;
    }


    updateWeight(weight) {
        // Used by listenerBelief to update the pgm weigth
        // takes in the weights as an 1D array and set the weights
        let weightIdx = 0;
        for (let vertexIdx = 0; vertexIdx < this.cMatDim[0]; vertexIdx++) {
            let edgeWeights = [];
            for (let i = 0; i < this.cMatDim[1]; i++) {
                edgeWeights[i] = {
                    id: this.getVertexId([1, i]),
                    weight: weight[weightIdx]
                };
                weightIdx++;
            }
            this.setEdgeWeights(vertexIdx, edgeWeights);
        }
    }


}