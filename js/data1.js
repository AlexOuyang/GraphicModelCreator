// Handles the configuration of the grah

var config;


var clusterMat = [2, 3, 2];
// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new pgm();
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

myGraph.display();

var data = myGraph.getGraphData();
//myGraph.bind(JSON.parse(data));
myGraph.bind([data]);

