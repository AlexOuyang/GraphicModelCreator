// Handles the configuration of the graph

var pgmConfig = {
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
    },
    edge: {
        baseWidth: 0.1, // base width offset = baseWidth * circle radius
        width: 0.5, // edge width = width * circle radius
        defaultColor: "#b6ddcc",
        visitedColor: "#1d4433",
        timeInterval: 600 // timeInterval is in millisecond
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
        button:{
            dim: 1,
            color: "#74cba6"
        },
        timeIntervalToUpdateChart: 400,
        timeInterval: 800
    },
    autoPlayable: false,  // If autoPlayable, creates the autoplay button
    zoom: false,
};


var clusterMat = [["▢", "◯", "△"],
                  ["Square", "Circle", "Triangle"],
                  ["▢", "◯", "△"]];

//var clusterMatPrototype = [["0"],["1"],["2"],["3"],["4"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new GraphicalModel(pgmConfig);

var dataTemp = myGraph.createCluster(clusterMat);

// Auto play
//myGraph.config.playable = true;

// Layer 1
myGraph.setAdjacentVertex(0, adjacentVertex = [{
    id: 3,
    weight: 0.1
}, {
    id: 4,
    weight: 0.4
}, {
    id: 5,
    weight: 0.5
}]);
myGraph.setAdjacentVertex(1, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(2, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);

// Layer 2
myGraph.setAdjacentVertex(3, adjacentVertex = [{
    id: 6,
    weight: 0.4
}, {
    id: 7,
    weight: 0.2
}, {
    id: 8,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(4, adjacentVertex = [{
    id: 6,
    weight: 0.4
}, {
    id: 7,
    weight: 0.2
}, {
    id: 8,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(5, adjacentVertex = [{
    id: 6,
    weight: 0.4
}, {
    id: 7,
    weight: 0.2
}, {
    id: 8,
    weight: 0.4
}]);


// Layer 3
//myGraph.setAdjacentVertex(6, adjacentVertex = [{
//    id: 9,
//    weight: 0.4
//}, {
//    id: 10,
//    weight: 0.2
//}, {
//    id: 11,
//    weight: 0.4
//}]);
//myGraph.setAdjacentVertex(7, adjacentVertex = [{
//    id: 9,
//    weight: 0.4
//}, {
//    id: 10,
//    weight: 0.2
//}, {
//    id: 11,
//    weight: 0.4
//}]);
//myGraph.setAdjacentVertex(8, adjacentVertex = [{
//    id: 9,
//    weight: 0.4
//}, {
//    id: 10,
//    weight: 0.2
//}, {
//    id: 11,
//    weight: 0.4
//}]);


myGraph.display();

//var data = myGraph.getGraphData();
//myGraph.bindData(data);




// Adjacency matrix configuration
var matConfig = {
    transform: {
        x: 0,
        y: 0,
        width: window.innerWidth / 3,
        height: window.innerWidth / 3
    },
    matrix: {
        x: 0.25,
        y: 0.3,
        dim: 0.5,
        spacing: 1,
        color: "#63c59b"
    },
    label: {
        color: "#52bf90",
        size: 0.5, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"
    },
    text: {
        color: "white",
        size: 0.6, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"
    },
    background: {
        color: "#ecf6f2"
    }
};

// Way 1 to create a chart

myGraph.createChart(matConfig);

// Way 2 to create a chart

//var _rowLabel = ["▢", "◯", "△"];
//var _colLabel = _rowLabel;
//var adjMat = new Chart(matConfig);
//adjMat.createMatrix(_rowLabel, _colLabel);
//
//// Bind the chart to graph
//myGraph.bindChart(adjMat);