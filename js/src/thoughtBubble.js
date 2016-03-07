/*=============== Listener Observer Probability Graphic Model ====================*/
"use strict";

class ListenerBeliefPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }

    _updateChart() {
        // After updating the chart updating the weight in ListenerPGM as well
        super._updateChart();

        let weight = [];

        for (let i = 0; i < this.graphData.clusterMat[0].length; i++) {
            for (let j = 0; j < this.graphData.clusterMat[this.graphData.clusterMat.length - 1].length; j++) {
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

        // log("Weight = " + weight);

        this.listenerPGM.updateWeight(weight);
        this.listenerPGM.display();
    }

    bindToListenerPGM(listener) {
        // Used to bind listenerPGM to listenerBeliefPGM
        this.listenerPGM = listener;
    }

    _stopAutoPlay() {
        // When stop button is clicked, reset the listenerPGM edgeweights as well
        super._stopAutoPlay();
        this.listenerPGM._clearVisitedPath();
        this.listenerPGM.resetEdgeWeightsToBeListenerBeliefPGMEdgeWeights();
        this.listenerPGM.display();
    }
}



class ListenerPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }

    _dataScreening(data) {}

    _updateChart() {}

    bindChart(weightedAdjMat) {
        /* Used to bind to an existing adjacency matrix _weightedAdjMatf to the graphical model */
        if (!this._weightedAdjMat) {
            this._weightedAdjMat = weightedAdjMat;
        } else {
            throw new Error("pgm.bindChart(): Graph already has a _weightedAdjMat object.")
        }
    }

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