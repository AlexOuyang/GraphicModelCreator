// Handles the configuration of the grah

var config;


var clusterMat = [1, 1];
// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new pgm();
var dataTemp = myGraph.createCluster(clusterMat);
myGraph.setAdjacentVertex(0, adjacentVertex = [{
    id: 1,
    weight: 1.0
}]);

myGraph.display();

var data = myGraph.getGraphData();
myGraph.bind(data);