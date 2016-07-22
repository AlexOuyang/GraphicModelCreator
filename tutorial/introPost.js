/*======================= Examples =======================*/


(function() {
    "use strict";

    let dimMultiplier = 2;

    /*======================= Create a regular PGM =======================*/

    let regularWithOutAdjMat = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = (window.innerWidth - 10) / dimMultiplier; // reset pgm width
        pgmConfig.transform.height = (window.innerWidth * 2 / 3) / dimMultiplier; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "♬", "☻"],
            ["Heart", "Music", "Smiley"],
            ["♡", "♬", "☻"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#example_1")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init()
            .setEdgeWeights(0, [{
                id: 3,
                weight: 1
            }, {
                id: 4,
                weight: 0
            }, {
                id: 5,
                weight: 0
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0
            }, {
                id: 4,
                weight: 1
            }, {
                id: 5,
                weight: 0
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0
            }, {
                id: 4,
                weight: 0
            }, {
                id: 5,
                weight: 1
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 1
            }, {
                id: 7,
                weight: 0
            }, {
                id: 8,
                weight: 0
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0
            }, {
                id: 7,
                weight: 1
            }, {
                id: 8,
                weight: 0
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0
            }, {
                id: 7,
                weight: 0
            }, {
                id: 8,
                weight: 1
            }]);
    })();

    /*======================= Create a regular PGM =======================*/

    let regularWithOutAdjMat2 = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = (window.innerWidth - 10) / dimMultiplier; // reset pgm width
        pgmConfig.transform.height = (window.innerWidth * 2 / 3) / dimMultiplier; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "♬", "☻"],
            ["\"Heart\"", "\"Music\"", "\"Smiley\""],
            ["♡", "♬", "☻"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [0.6,0.1,0.3];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#example_2")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init()
            .setEdgeWeights(0, [{
                id: 3,
                weight: 1
            }, {
                id: 4,
                weight: 0
            }, {
                id: 5,
                weight: 0
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0
            }, {
                id: 4,
                weight: 1
            }, {
                id: 5,
                weight: 0
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0
            }, {
                id: 4,
                weight: 0
            }, {
                id: 5,
                weight: 1
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 1
            }, {
                id: 7,
                weight: 0
            }, {
                id: 8,
                weight: 0
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0
            }, {
                id: 7,
                weight: 1
            }, {
                id: 8,
                weight: 0
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0
            }, {
                id: 7,
                weight: 0
            }, {
                id: 8,
                weight: 1
            }]);
    })();

    /*======================= Create a regular PGM =======================*/

    let regularWithOutAdjMat3 = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = (window.innerWidth - 10) / dimMultiplier; // reset pgm width
        pgmConfig.transform.height = (window.innerWidth * 2 / 3) / dimMultiplier; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "♬", "☻"],
            ["\"Heart\"", "\"Music\"", "\"Smiley\""],
            ["♡", "♬", "☻"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [0.6,0.1,0.3];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#example_3")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init()
            .setEdgeWeights(0, [{
                id: 3,
                weight: 0.8
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.8
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.8
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 0.8
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.1
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.8
            }, {
                id: 8,
                weight: 0.1
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.8
            }]);
    })();

        /*======================= Create a regular PGM =======================*/

    let regularWithOutAdjMat4 = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = (window.innerWidth - 10) / dimMultiplier; // reset pgm width
        pgmConfig.transform.height = (window.innerWidth * 2 / 3) / dimMultiplier; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "♬", "☻"],
            ["\"Heart\"", "\"Music\"", "\"Smiley\""],
            ["♡", "♬", "☻"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [0.6,0.1,0.3];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#example_4")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init()
            .setEdgeWeights(0, [{
                id: 3,
                weight: 0.3
            }, {
                id: 4,
                weight: 0.4
            }, {
                id: 5,
                weight: 0.3
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0.3
            }, {
                id: 4,
                weight: 0.4
            }, {
                id: 5,
                weight: 0.3
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0.4
            }, {
                id: 4,
                weight: 0.3
            }, {
                id: 5,
                weight: 0.3
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 0.3
            }, {
                id: 7,
                weight: 0.3
            }, {
                id: 8,
                weight: 0.4
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0.3
            }, {
                id: 7,
                weight: 0.3
            }, {
                id: 8,
                weight: 0.4
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0.3
            }, {
                id: 7,
                weight: 0.4
            }, {
                id: 8,
                weight: 0.3
            }]);
    })();


        /*======================= Create a regular PGM =======================*/

    let regularWithOutAdjMat5 = (function() {

        // Get a copy of the default configuration file first
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.background.grid = false; // disable background grid
        pgmConfig.background.color = "white"; // change the background color
        pgmConfig.transform.width = (window.innerWidth - 10) / dimMultiplier; // reset pgm width
        pgmConfig.transform.height = (window.innerWidth * 2 / 3) / dimMultiplier; // reset pgm height
        pgmConfig.text.size = 0.7; // change text label size

        // ClusterMat is the cluster matrix that defines every node in each layer, where each row represents one layer.
        let clusterMat = [
            ["♡", "♬", "☻"],
            ["\"Heart\"", "\"Music\"", "\"Smiley\""],
            ["♡", "♬", "☻"]
        ];

        // If the speakerNodeProbabilityDistribution is an empty array such as [], uniform speaker node probability is produced.
        let speakerNodeProbabilityDistribution = [0.6,0.1,0.3];

        // If no edge weights are set, the default edge weights are of uniform distribution.
        return new GraphicalModel(pgmConfig, "#example_5")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .init()
            .setEdgeWeights(0, [{
                id: 3,
                weight: 0.8
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.8
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.8
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.8
            }, {
                id: 8,
                weight: 0.1
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.8
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0.8
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.1
            }]);
    })();



    /*======= Regular PGM with Adjacency Matrix and AutoPlay Capability =======*/

    let regularWithAdjMat1 = (function() {

        let pgmConfig = Config.getPgmConfig();
        pgmConfig.transform.width /= dimMultiplier;
        pgmConfig.transform.height /= dimMultiplier;

        let matConfig = Config.getAdjacencyMatrixConfig();
        matConfig.transform.width /= dimMultiplier;
        matConfig.transform.height /= dimMultiplier;
        matConfig.background.color = "#ecf6f2";

        let clusterMat = [
            ["▢", "◯", "△"],
            ["\"Square\"", "\"Circle\"", "\"Triangle\""],
            ["▢", "◯", "△"]
        ];

        let speakerNodeProbabilityDistribution = [0.6,0.1,0.3];

        // Let's set the edge weights this time, where we use setEdgeWeights() to set all edges weights coming from one node. In the method, id is the id of the node in which you are connecting to from the node with its id set in the first parameter of setEdgeWeights().
        return new GraphicalModel(pgmConfig, "#example_3_counter")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, true)
            .createAdjacencyMatrix(matConfig)
            .init() // if you call init() before calling createAdjacencyMatrix() then the width of the speed controlling slide bar would only be the width of the pgm graph, else the speed controller width would be the width of the pgm graph and the width of the adjacency matrix.
                 .setEdgeWeights(0, [{
                id: 3,
                weight: 0.8
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(1, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.8
            }, {
                id: 5,
                weight: 0.1
            }]).setEdgeWeights(2, [{
                id: 3,
                weight: 0.1
            }, {
                id: 4,
                weight: 0.1
            }, {
                id: 5,
                weight: 0.8
            }]).setEdgeWeights(3, [{
                id: 6,
                weight: 0.8
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.1
            }]).setEdgeWeights(4, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.8
            }, {
                id: 8,
                weight: 0.1
            }]).setEdgeWeights(5, [{
                id: 6,
                weight: 0.1
            }, {
                id: 7,
                weight: 0.1
            }, {
                id: 8,
                weight: 0.8
            }]);
    })();

/*======= Regular PGM with Adjacency Matrix and Zoom Capability =========*/

    let regularWithAdjMatWithoutAutoPlayWithZoom = (function() {

        // Still create the pgm configuration first.
        let pgmConfig = Config.getPgmConfig();
        pgmConfig.transform.width /= dimMultiplier;
        pgmConfig.transform.height /= dimMultiplier;

        // AutoPlay capability is enabled by default. Disable autoPlay ability so the speaker layer nodes become clicable.
        pgmConfig.autoPlayable = false;
        // Allow zoom, this gives zoom ability
        pgmConfig.zoomable = true;

        // Now let's get the matrix configuration file 
        let matConfig = Config.getAdjacencyMatrixConfig();
        matConfig.transform.width /= dimMultiplier;
        matConfig.transform.height /= dimMultiplier;
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



    /*======= Regular PGM with Adjacency Matrix and AutoPlay Capability =======*/

    let regularWithAdjMat = (function() {

        let pgmConfig = Config.getPgmConfig();
        pgmConfig.transform.width /= dimMultiplier;
        pgmConfig.transform.height /= dimMultiplier;

        let matConfig = Config.getAdjacencyMatrixConfig();
        matConfig.transform.width /= dimMultiplier;
        matConfig.transform.height /= dimMultiplier;
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


    /*======================= Listener Observer PGM Example 1 =======================*/

    let listenerObserver1 = (function() {
        "use strict";

        let listenerBeliefConfig = Config.getListenerBeliefConfig();
        listenerBeliefConfig.transform.width /= dimMultiplier;
        listenerBeliefConfig.transform.height /= dimMultiplier;

        let listenerConfig = Config.getListenerConfig();
        listenerConfig.transform.width /= dimMultiplier;
        listenerConfig.transform.height /= dimMultiplier;

        let adjacencyMatrixConfig = Config.getAdjacencyMatrixConfig();
        adjacencyMatrixConfig.transform.width /= dimMultiplier;
        adjacencyMatrixConfig.transform.height /= dimMultiplier;
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
            clusterMat, // Cluster matrix specifies the vertex labels
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



    /*======================= Listener Observer PGM Example 2 =======================*/

    let listenerObserver2 = (function() {
        "use strict";

        let listenerBeliefConfig = Config.getListenerBeliefConfig();
        listenerBeliefConfig.transform.width /= dimMultiplier;
        listenerBeliefConfig.transform.height /= dimMultiplier;

        let listenerConfig = Config.getListenerConfig();
        listenerConfig.transform.width /= dimMultiplier;
        listenerConfig.transform.height /= dimMultiplier;

        let adjacencyMatrixConfig = Config.getAdjacencyMatrixConfig();
        adjacencyMatrixConfig.transform.width /= dimMultiplier;
        adjacencyMatrixConfig.transform.height /= dimMultiplier;

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