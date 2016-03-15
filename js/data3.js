//Top graph

(function() {
    "use strict";


    let thoughtBubble1 = (function() {
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
                timeInterval: 300 // timeInterval is in millisecond
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
                timeIntervalBetweenCycle: 300
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
                timeInterval: 500 // timeInterval is in millisecond
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
                timeIntervalBetweenCycle: 300
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


        // By default, ThoughtBubble have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ThoughtBubble(
            "#thoughtBubble1",                      // Html div tag id
            listenerBeliefConfig,                   // Listener's belief pgm configuration
            listenerConfig,                         // Listener pgm configuration
            adjacencyMatrixConfig,                  // Weighted adjacency matrix configuration
            clusterMat,                             // Cluster matrix specifies 
            speakerLayerProbabilityDistribution,    // The probability distribution of the speaker layer nodes. They add up to 1
            true                                    // Change speaker layer nodes radius based on the probability distribution
        ).setEdgeWeights(0, [{
            id: 3,
            weight: 1.0 / 3.0
        }, {
            id: 4,
            weight: 1.0 / 3.0
        }, {
            id: 5,
            weight: 1.0 / 3.0
        }]).setEdgeWeights(1, [{
            id: 3,
            weight: 1.0 / 3.0
        }, {
            id: 4,
            weight: 1.0 / 3.0
        }, {
            id: 5,
            weight: 1.0 / 3.0
        }]).setEdgeWeights(2, [{
            id: 3,
            weight: 1.0 / 3.0
        }, {
            id: 4,
            weight: 1.0 / 3.0
        }, {
            id: 5,
            weight: 1.0 / 3.0
        }]);

    })();



    /*======================= Another example =======================*/


    let thoughtBubble2 = (function() {
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
                timeInterval: 300 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "#ecf6f2"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 300
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
                color: "#ecf6f2"
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
                timeInterval: 500 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "#ecf6f2"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 300
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


        // By default, ThoughtBubble have uniform weight distribution,
        // you can stack up setEdgeWeights method to redefine the edge weights
        return new ThoughtBubble(
            "#thoughtBubble2",                      // Html div tag id
            listenerBeliefConfig,                   // Listener's belief pgm configuration
            listenerConfig,                         // Listener pgm configuration
            adjacencyMatrixConfig,                  // Weighted adjacency matrix configuration
            clusterMat,                             // Cluster matrix specifies 
            speakerLayerProbabilityDistribution,    // The probability distribution of the speaker layer nodes. They add up to 1
            true                                    // Change speaker layer nodes radius based on the probability distribution
        );

    })();


})();



/*======================= Another example =======================*/



// //Top graph

// (function() {
//     // "use strict";

//     // Handles the configuration of the graph

//     var listenerBeliefConfig = {
//         transform: {
//             x: 0,
//             y: 0,
//             width: window.innerWidth * 2 / 3 - 20,
//             height: window.innerWidth / 3
//         },
//         vertex: {
//             radius: 0.35,
//             defaultStyle: {
//                 backgroundColor: "#52bf90",
//                 outlineColor: "#317256"
//             },
//             visited: {
//                 visitedColor: "#1d4433",
//                 outlineColor: "#1d4433"
//             }
//         },
//         edge: {
//             baseWidth: 0, // base width offset = baseWidth * circle radius
//             width: 1, // edge width = width * circle radius
//             defaultColor: "#b6ddcc",
//             visitedColor: "#1d4433",
//             timeInterval: 300 // timeInterval is in millisecond
//         },
//         text: {
//             color: "white",
//             size: 0.5, // text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"

//         },
//         background: {
//             grid: false,
//             color: "white"
//         },
//         autoPlay: {
//             on: false,
//             button: {
//                 dim: 1,
//                 color: "#74cba6"
//             },
//             timeIntervalBetweenCycle: 300
//         },
//         autoPlayable: true, // If autoPlayable, creates the autoplay button
//         cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
//         zoomable: false,
//     };


//     var clusterMat = [
//         ["▢", "◯", "△"],
//         ["Sqr", "Cir"]
//     ];


//     var speakerLayerProbabilityDistribution = [0.1, 0.4, 0.5];
//     // Create a new Graph based on the configuration
//     // and bind the data to the graph for rendering
//     var listenerObserver = new ListenerBeliefPGM(listenerBeliefConfig, "#listenerBeliefPGMdiv2");
//     //listenerPGM.appendToDOM("#pgm3");
//     listenerObserver.createCluster(clusterMat, speakerLayerProbabilityDistribution, true);



//     // Layer 1
//     listenerObserver.setEdgeWeights(0, adjacentVertex = [{
//         id: 3,
//         weight: 1.0 / 2.0
//     }, {
//         id: 4,
//         weight: 1.0 / 2.0
//     }]);
//     listenerObserver.setEdgeWeights(1, adjacentVertex = [{
//         id: 3,
//         weight: 1.0 / 2.0
//     }, {
//         id: 4,
//         weight: 1.0 / 2.0
//     }]);
//     listenerObserver.setEdgeWeights(2, adjacentVertex = [{
//         id: 3,
//         weight: 1.0 / 2.0
//     }, {
//         id: 4,
//         weight: 1.0 / 2.0
//     }]);



//     // Adjacency matrix configuration
//     var adjacencyMatrixConfig = {
//         transform: {
//             x: 0,
//             y: 0,
//             width: window.innerWidth / 3,
//             height: window.innerWidth / 3
//         },
//         matrix: {
//             x: 0.3,
//             y: 0.3,
//             cellDim: 0.5,
//             cellSpacing: 1,
//             color: "#63c59b"
//         },
//         label: {
//             color: "#52bf90",
//             size: 0.5, // text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"
//         },
//         weight: {
//             color: "white",
//             size: 0.6, // weight text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"
//         },
//         background: {
//             color: "white"
//         }
//     };

//     // Way 1 to create a chart

//     listenerObserver.createChart(adjacencyMatrixConfig);
//     listenerObserver.display();



//     var listenerConfig = {
//         transform: {
//             x: 0,
//             y: 0,
//             width: window.innerWidth * 2 / 3 - 20,
//             height: window.innerWidth / 3
//         },
//         vertex: {
//             radius: 0.35,
//             defaultColor: "#52bf90",
//             visitedColor: "#1d4433",
//             outlineColor: "#317256"
//         },
//         edge: {
//             baseWidth: 0.1, // base width offset = baseWidth * circle radius
//             width: 0.5, // edge width = width * circle radius
//             defaultColor: "#b6ddcc",
//             visitedColor: "#1d4433",
//             timeInterval: 500 // timeInterval is in millisecond
//         },
//         text: {
//             color: "white",
//             size: 0.5, // text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"

//         },
//         background: {
//             grid: false,
//             color: "white"
//         },
//         autoPlay: {
//             on: false,
//             button: {
//                 dim: 1,
//                 color: "#74cba6"
//             },
//             timeIntervalBetweenCycle: 300
//         },
//         autoPlayable: false, // If autoPlayable, creates the autoplay button
//         cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
//         zoomable: false,
//     };



//     var clusterMat2 = [
//         ["Sqr", "Cir", "Tri"],
//         ["▢", "◯", "△"]
//     ];

//     // Create a new Graph based on the configuration
//     // and bind the data to the graph for rendering
//     var listener = new ListenerPGM(listenerConfig, "#listenerPGMdiv2");
//     //observed.appendToDOM("#pgm4");
//     listener.createCluster(clusterMat2, speakerLayerProbabilityDistribution, true);
//     listener.bindToListenerBeliefPGM(listenerObserver);


//     //observed.createChart(matConfig);
//     listener.display();

// }).call(this);