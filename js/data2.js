// Handles the configuration of the graph

var config = {
    transform: {
        x: 0,
        y: 0,
        width: window.innerWidth * 2 / 3 - 10,
        height: window.innerHeight - 100
    },
    vertex: {
        radius: 0.35,
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
    },
    edge: {
        baseWidth: 0.1, // base width offset = baseWidth * circle radius
        width: 0.5, // edge width = width * circle radius
        defaultColor: "#b6ddcc",
        visitedColor: "#317256",
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
    zoom: true,
};


var clusterMat = [["Square", "Circle", "Triangle"],
                  ["▢", "◯", "△"],
                  ["Square", "Circle", "Triangle"]];

//var clusterMatPrototype = [["0"],["1"],["2"],["3"],["4"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new pgm(config);

var dataTemp = myGraph.createCluster(clusterMat);

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
        width: window.innerWidth / 3 - 15,
        height: window.innerHeight - 100
    },
    cell: {
        dim: 0.7,
        spacing: 1,
        color: "#52bf90"
    },
    label: {
        color: "white",
        size: 0.6, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"
    },
    text: {
        color: "white",
        size: 0.8, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"
    },
    background: {
        color: "#ecf6f2"
    }
};
var inputData = ["Square", "Circle", "Triangle"];
var adjMat = new chart(matConfig);
adjMat.createMatrix(inputData);
//adjMat.updateMatrix(["Square", "Triangle"]);



// Bind the chart to graph
myGraph.bindAdj(adjMat);