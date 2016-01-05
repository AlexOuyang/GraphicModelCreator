// Handles the configuration of the grah

var config = {
    transform: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 80
    },
    vertex: {
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
        outlineColor: "steelblue",
        outlineWidth: 1.5
    },
    edge: {
        baseWidth: 2,
        weightWidth: 18,
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
        timeInterval: 800
    },
    text: {
        color: "white",
        size: 0.6,
        anchor: "middle"
    },
    background: {
        grid: false,
        color: "none"
    },
    zoom: true,
};
var clusterMat = [2, 3, 2, 2];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new pgm(config);

var dataTemp = myGraph.createCluster(clusterMat);

myGraph.setAdjacentVertex(0, adjacentVertex = [{
    id: 2,
    weight: 0.1
}, {
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.5
}]);
myGraph.setAdjacentVertex(1, adjacentVertex = [{
    id: 2,
    weight: 0.4
}, {
    id: 3,
    weight: 0.2
}, {
    id: 4,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(2, adjacentVertex = [{
    id: 5,
    weight: 0.3
}, {
    id: 6,
    weight: 0.7
}]);
myGraph.setAdjacentVertex(3, adjacentVertex = [{
    id: 5,
    weight: 0.6
}, {
    id: 6,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(4, adjacentVertex = [{
    id: 5,
    weight: 0.6
}, {
    id: 6,
    weight: 0.4
}]);
myGraph.setAdjacentVertex(5, adjacentVertex = [{
    id: 7,
    weight: 0.5
}, {
    id: 8,
    weight: 0.5
}]);
myGraph.setAdjacentVertex(6, adjacentVertex = [{
    id: 7,
    weight: 0.2
}, {
    id: 8,
    weight: 0.8
}]);

myGraph.display();

//var data = myGraph.getGraphData();
//myGraph.bind(data);