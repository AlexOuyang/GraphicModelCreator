// Handles the configuration of the grah

var config = {
    transform: {
        x: 0,
        y: 0,
        width: 500,
        height: 400
    },
    vertex: {
        radius: 0.35,
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
    },
    edge: {
        baseWidth: 0.1, // base width offset = baseWidth * circle radius
        width: 0.5, // edge width = width * circle radius
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
        timeInterval: 600 // timeInterval is in millisecond
    },
    text: {
        color: "white",
        size: 0.6, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"

    },
    background: {
        grid: false,
        color: "none"
    },
    zoom: false,
};


var clusterMat = [["square", "circle", "triangle"],
                  ["▢", "◯", "△"],
                  ["square", "circle", "triangle"]];


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

myGraph.display();

//var data = myGraph.getGraphData();
//myGraph.bind(data);