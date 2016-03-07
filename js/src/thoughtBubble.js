/*=============== Listener Observer Probability Graphic Model ====================*/
"use strict";

class ListenerBeliefPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }

}



class ListenerPGM extends GraphicalModel {

    constructor(graphConfiguration, divID) {
        super(graphConfiguration, divID);
    }


    bindChart(weightedAdjMat) {
        /* Used to bind to an existing adjacency matrix _weightedAdjMatf to the graphical model */
        if (!this._weightedAdjMat) {
            this._weightedAdjMat = weightedAdjMat;
        } else {
            throw new Error("pgm.bindChart(): Graph already has a _weightedAdjMat object.")
        }
    }

    bindToListenerBeliefPGM(belief) {
        
        this.listenerBeliefPGM = belief;

        for (let i = 0; i < this.listenerBeliefPGM.getGraphData().data.length; i++) {
            let adjVtx = this.listenerBeliefPGM.getGraphData().data[i].adjacentVertex;
            this.graphData.data[i].adjacentVertex = adjVtx;

        }
    }

}