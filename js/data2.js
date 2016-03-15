// Middle graph

// (function() {
// "use strict";

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
        timeInterval: 800 // timeInterval is in millisecond
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
        timeIntervalBetweenCycle: 800
    },
    autoPlayable: false, // If autoPlayable, creates the autoplay button
    cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
    zoomable: false,
};


var clusterMat = [
    ["▢", "◯", "△"],
    ["Square", "Circle", "Triangle"],
    ["▢", "◯", "△"]
];

var speakerNodeProbabilityDistribution = [0.1, 0.2, 0.7];
//var clusterMatPrototype = [["0"],["1"],["2"],["3"],["4"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var myGraph = new GraphicalModel(pgmConfig, "#pgm2");
myGraph.createCluster(clusterMat, speakerNodeProbabilityDistribution, false);

// Auto play
//myGraph.config.playable = true;





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

// Way 1 to create a chart

myGraph.createAdjacencyMatrix(matConfig);
myGraph.init();

myGraph.setEdgeWeights(0, [{
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




// myGraph.getWeightedAdjacencyMatrix().getMatrix1D();

// Way 2 to create a chart

//var _rowLabel = ["▢", "◯", "△"];
//var _colLabel = _rowLabel;
//var adjMat = new Chart("pgm1", matConfig);
//adjMat.createMatrix(_rowLabel, _colLabel);
//
////// Bind the chart to graph
//myGraph.bindChart(adjMat);

// }).call(this);