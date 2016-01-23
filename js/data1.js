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
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue",
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
        size: 0.8, // text size = size * circle radius
        anchor: "middle",
        alignment: "middle"

    },
    background: {
        grid: true,
        color: "#ecf6f2"
    },
    zoom: true,
};


var clusterMatPrototype = [["0"],["1"],["2"],["3"],["4"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new GraphicalModel(pgmConfig);

var dataTemp = myGraph.createCluster(clusterMatPrototype);

// Layer 1
myGraph.setAdjacentVertex(0, adjacentVertex = [{
    id: 1,
    weight: 1
}]);
myGraph.setAdjacentVertex(1, adjacentVertex = [{
    id: 2,
    weight: 1
}]);
myGraph.setAdjacentVertex(2, adjacentVertex = [{
    id: 3,
    weight: 1
}]);
myGraph.setAdjacentVertex(3, adjacentVertex = [{
    id: 4,
    weight: 1
}]);


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

//var rowLabel = ["▢", "◯", "△"];
//var colLabel = rowLabel;
//var adjMat = new Chart(matConfig);
//adjMat.createMatrix(rowLabel, colLabel);
//
//// Bind the chart to graph
//myGraph.bindChart(adjMat);