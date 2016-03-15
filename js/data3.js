/*======================= Examples =======================*/


(function() {
    "use strict";


    /*======================= Example 1 =======================*/

    let listenerObserver1 = (function() {
        "use strict";

        // Handles the configuration of listener's belief
        let listenerBeliefConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 3
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
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "white"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };


        // Adjacency matrix configuration
        let adjacencyMatrixConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth / 3,
                height: window.innerWidth / 3
            },
            matrix: {
                x: 0.3,
                y: 0.3,
                cellDim: 0.5,
                cellSpacing: 1,
                color: "#63c59b"
            },
            label: {
                color: "#52bf90",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            weight: {
                color: "white",
                size: 0.6, // weight text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            background: {
                color: "white"
            }
        };


        // Handles the configuration of listener
        let listenerConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 3
            },
            vertex: {
                radius: 0.35,
                defaultColor: "#52bf90",
                visitedColor: "#1d4433",
                outlineColor: "#317256"
            },
            edge: {
                baseWidth: 0, // base width offset = baseWidth * circle radius
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "white"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: false, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };



        let clusterMat = [
            ["▢", "◯", "△"],
            ["Sqr", "Cir", "Tri"]
        ];

        let speakerLayerProbabilityDistribution = [0.1, 0.3, 0.6];


        // By default, ListenerObserverPGM have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ListenerObserverPGM(
            "#ListenerObserverPGM1", // Html div tag id
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



    /*======================= Example 2 =======================*/


    let listenerObserver2 = (function() {
        "use strict";

        // Handles the configuration of listener's belief
        let listenerBeliefConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 3
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
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "white"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };


        // Adjacency matrix configuration
        let adjacencyMatrixConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth / 3,
                height: window.innerWidth / 3
            },
            matrix: {
                x: 0.3,
                y: 0.3,
                cellDim: 0.5,
                cellSpacing: 1,
                color: "#63c59b"
            },
            label: {
                color: "#52bf90",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            weight: {
                color: "white",
                size: 0.6, // weight text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            background: {
                color: "white"
            }
        };


        // Handles the configuration of listener
        let listenerConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 3
            },
            vertex: {
                radius: 0.35,
                defaultColor: "#52bf90",
                visitedColor: "#1d4433",
                outlineColor: "#317256"
            },
            edge: {
                baseWidth: 0, // base width offset = baseWidth * circle radius
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "white"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: false, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };



        let clusterMat = [
            ["▢", "◯", "△"],
            ["Sqr", "Cir"]
        ];

        let speakerLayerProbabilityDistribution = [0.1, 0.3, 0.6];


        // By default, ListenerObserverPGM have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ListenerObserverPGM(
            "#ListenerObserverPGM2", // Html div tag id
            listenerBeliefConfig, // Listener's belief pgm configuration
            listenerConfig, // Listener pgm configuration
            adjacencyMatrixConfig, // Weighted adjacency matrix configuration
            clusterMat, // Cluster matrix specifies 
            speakerLayerProbabilityDistribution, // The probability distribution of the speaker layer nodes. They add up to 1
            true // Change speaker layer nodes radius based on the probability distribution
        );

    })();


    /*======================= Example 3 =======================*/


    let regularWithAdjMat = (function() {
        let pgmConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 3
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
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
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
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: false, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };


        let matConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth / 3,
                height: window.innerWidth / 3
            },
            matrix: {
                x: 0.3,
                y: 0.3,
                cellDim: 0.5,
                cellSpacing: 1,
                color: "#63c59b"
            },
            label: {
                color: "#52bf90",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            weight: {
                color: "white",
                size: 0.6, // weight text size = size * circle radius
                anchor: "middle",
                alignment: "middle"
            },
            background: {
                color: "#ecf6f2"
            }
        };

        let clusterMat = [
            ["▢", "◯", "△"],
            ["Square", "Circle", "Triangle"],
            ["▢", "◯", "△"]
        ];

        let speakerNodeProbabilityDistribution = [0.1, 0.2, 0.7];


        return new GraphicalModel(pgmConfig, "#pgm2")
            .createCluster(clusterMat, speakerNodeProbabilityDistribution, false)
            .init() // if you init before creating adjacency matrix then the width of the speed bar would be different
            .createAdjacencyMatrix(matConfig)
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


})();