

























// (function() {
//     // "use strict"; // Handles the configuration of the graph

//     var pgmConfig2 = {
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
//             timeInterval: 800 // timeInterval is in millisecond
//         },
//         text: {
//             color: "white",
//             size: 0.5, // text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"

//         },
//         background: {
//             grid: true,
//             color: "#ecf6f2"
//         },
//         autoPlay: {
//             on: false,
//             button: {
//                 dim: 1,
//                 color: "#74cba6"
//             },
//             timeIntervalBetweenCycle: 800
//         },
//         autoPlayable: true, // If autoPlayable, creates the autoplay button
//         cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
//         zoomable: false,
//     };



//     var clusterMatPrototype2 = [
//         ["0"],
//         ["1"],
//         ["2"],
//         ["3"],
//         ["4"]
//     ];

//     // Create a new Graph based on the configuration
//     // and bind the data to the graph for rendering
//     var myGraph2 = new GraphicalModel(pgmConfig2, "#pgm1");
//     var dataTemp2 = myGraph2.createCluster(clusterMatPrototype2, [1], true);

//     // Layer 1
//     myGraph2.setEdgeWeights(0, adjacentVertex = [{
//         id: 1,
//         weight: 1
//     }]);
//     myGraph2.setEdgeWeights(1, adjacentVertex = [{
//         id: 2,
//         weight: 1
//     }]);
//     myGraph2.setEdgeWeights(2, adjacentVertex = [{
//         id: 3,
//         weight: 1
//     }]);
//     myGraph2.setEdgeWeights(3, adjacentVertex = [{
//         id: 4,
//         weight: 1
//     }]);



//     //var data = myGraph.getGraphData();
//     //myGraph.bindData(data);



//     // Adjacency matrix configuration
//     var matConfig2 = {
//         transform: {
//             x: 0,
//             y: 0,
//             width: window.innerWidth / 3,
//             height: window.innerWidth / 3
//         },
//         matrix: {
//             x: 0.5,
//             y: 0.5,
//             cellDim: 0.4,
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
//             size: 0.6, // text size = size * circle radius
//             anchor: "middle",
//             alignment: "middle"
//         },
//         background: {
//             color: "#ecf6f2"
//         }
//     };

//     // Way 1 to create a chart

//     myGraph2.createChart(matConfig2);
//     myGraph2.display();

//     // Way 2 to create a chart

//     //var _rowLabel = ["▢", "◯", "△"];
//     //var _colLabel = _rowLabel;
//     //var adjMat = new Chart(matConfig);
//     //adjMat.createMatrix(_rowLabel, _colLabel);
//     //
//     //// Bind the chart to graph
//     //myGraph.bindChart(adjMat);
// }).call(this);