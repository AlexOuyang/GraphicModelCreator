/*======================= Examples =======================*/


(function() {
    "use strict";

    /*======================= Example 1 =======================*/

    let regularWithOutAdjMat = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = window.innerWidth - 10; // reset pgm width
        pgmConfig.transform.height = window.innerWidth * 2 / 3; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "㊤", "☏", "♬", "☻", "♀"],
            ["Heart", "Up", "Phone", "Music"],
            ["♡", "㊤", "☏", "♬"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#regular_pgm")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init();
    })();



    /*======================= Example 2 =======================*/

    let regularWithAdjMatWithoutAutoPlayWithZoom = (function() {

        // Still create the pgm configuration first.
        let pgmConfig = Config.getPgmConfig();
        // AutoPlay capability is enabled by default. Disable autoPlay ability so the speaker layer nodes become clicable.
        pgmConfig.autoPlayable = false;
        // Allow zoom, this gives zoom ability
        pgmConfig.zoomable = true;

        // Now let's get the matrix configuration file 
        let matConfig = Config.getAdjacencyMatrixConfig();
        matConfig.background.color = "#ecf6f2"; // reset background color

        let clusterMat = [
            ["▢", "◯", "△"],
            ["Square", "Circle", "Triangle"],
            ["▢", "◯", "△"]
        ];

        let speakerNodeProbabilityDistribution = [0.1, 0.2, 0.7];

        // If not weight is set, the default edge weights are uniform
        return new GraphicalModel(pgmConfig, "#regular_with_adjMat_without_autoplay")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, false) // Do not allow speaker node radius to change based on speaker node probability distribution.
            .createAdjacencyMatrix(matConfig)
            .init();
    })();



    /*======================= Example 3 =======================*/

    let regularWithAdjMat = (function() {

        let pgmConfig = Config.getPgmConfig();

        let matConfig = Config.getAdjacencyMatrixConfig();
        matConfig.background.color = "#ecf6f2";

        let clusterMat = [
            ["▢", "◯", "△"],
            ["Square", "Circle", "Triangle"],
            ["▢", "◯", "△"]
        ];

        let speakerNodeProbabilityDistribution = [0.1, 0.2, 0.7];

        // Let's set the edge weights this time, where we use setEdgeWeights() to set all edges weights coming from one node. In the method, id is the id of the node in which you are connecting to from the node with its id set in the first parameter of setEdgeWeights().
        return new GraphicalModel(pgmConfig, "#regular_with_adjMat_with_autoplay")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .createAdjacencyMatrix(matConfig)
            .init() // if you call init() before calling createAdjacencyMatrix() then the width of the speed controlling slide bar would only be the width of the pgm graph, else the speed controller width would be the width of the pgm graph and the width of the adjacency matrix.
            .setEdgeWeights(0, [{
                id: 3,
                weight: 0
            }, {
                id: 4,
                weight: 0
            }, {
                id: 5,
                weight: 0
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0.4
            }, {
                id: 4,
                weight: 0.2
            }, {
                id: 5,
                weight: 0.4
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0.4
            }, {
                id: 4,
                weight: 0.2
            }, {
                id: 5,
                weight: 0.4
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 0.4
            }, {
                id: 7,
                weight: 0.2
            }, {
                id: 8,
                weight: 0.4
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0.4
            }, {
                id: 7,
                weight: 0.2
            }, {
                id: 8,
                weight: 0.4
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0.4
            }, {
                id: 7,
                weight: 0.2
            }, {
                id: 8,
                weight: 0.4
            }]);
    })();


    /*======================= Example 4 =======================*/

    let listenerObserver1 = (function() {
        "use strict";

        let listenerBeliefConfig = Config.getListenerBeliefConfig();

        let listenerConfig = Config.getListenerConfig();

        let adjacencyMatrixConfig = Config.getAdjacencyMatrixConfig();
        adjacencyMatrixConfig.label.size = 0.35; // Reset the matrix label text size

        let clusterMat = [
            ["▢", "◯", "△"],
            ["Square", "Circle", "Triangle"]
        ];

        let speakerLayerProbabilityDistribution = [0.2, 0.3, 0.5];


        // By default, ListenerObserverPGM have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ListenerObserverPGM(
            "#listenerObserverModel_1", // Html div tag id
            listenerBeliefConfig, // Listener's belief pgm configuration
            listenerConfig, // Listener pgm configuration
            adjacencyMatrixConfig, // Weighted adjacency matrix configuration
            clusterMat, // Cluster matrix specifies 
            speakerLayerProbabilityDistribution, // The probability distribution of the speaker layer nodes. They add up to 1
            true // Change speaker layer nodes radius based on the probability distribution
        ).setEdgeWeights(0, [{
            id: 3,
            weight: 0.2
        }, {
            id: 4,
            weight: 0.5
        }, {
            id: 5,
            weight: 0.3
        }]).setEdgeWeights(2, [{
            id: 3,
            weight: 0.8
        }, {
            id: 4,
            weight: 0.1
        }, {
            id: 5,
            weight: 0.1
        }]);

    })();



    /*======================= Example 5 =======================*/

    let listenerObserver2 = (function() {
        "use strict";

        let listenerBeliefConfig = Config.getListenerBeliefConfig();

        let listenerConfig = Config.getListenerConfig();

        let adjacencyMatrixConfig = Config.getAdjacencyMatrixConfig();

        let clusterMat = [
            ["▢", "◯", "△"],
            ["Sqr", "Cir"]
        ];

        let speakerLayerProbabilityDistribution = []; // This produces uniform speaker node probability


        // By default, ListenerObserverPGM have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ListenerObserverPGM(
            "#listenerObserverModel_2", // Html div tag id
            listenerBeliefConfig, // Listener's belief pgm configuration
            listenerConfig, // Listener pgm configuration
            adjacencyMatrixConfig, // Weighted adjacency matrix configuration
            clusterMat, // Cluster matrix specifies 
            speakerLayerProbabilityDistribution, // The probability distribution of the speaker layer nodes. They add up to 1
            false // Change speaker layer nodes radius based on the probability distribution
        );

    })();


})();