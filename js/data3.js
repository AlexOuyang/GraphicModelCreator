// Handles the configuration of the graph

var listenerConfig = {
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
        baseWidth: 0.1, // base width offset = baseWidth * circle radius
        width: 0.5, // edge width = width * circle radius
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
    cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
    zoomable: false,
};


var clusterMat = [["▢", "◯", "△"],
                  ["Sqr", "Cir", "Tri"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var listenerPGM = new ThoughtBubble(listenerConfig, "#pgm3");
//listenerPGM.appendToDOM("#pgm3");
listenerPGM.createCluster(clusterMat, [], true);



// Layer 1
listenerPGM.setAdjacentVertex(0, adjacentVertex = [{
    id: 3,
    weight: 0.1
}, {
    id: 4,
    weight: 0.4
}, {
    id: 5,
    weight: 0.5
}]);
listenerPGM.setAdjacentVertex(1, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);
listenerPGM.setAdjacentVertex(2, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);





// Adjacency matrix configuration
var listenerAdjMatConfig = {
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

listenerPGM.createChart(listenerAdjMatConfig);
//listenerPGM.getWeightedAdjacencyMatrix().resetColLabel(["Sqr", "Cir", "Tri"]);
listenerPGM.display();



var observedConfig = {
    transform: {
        x: 0,
        y: 0,
        width: window.innerWidth  - 20,
        height: window.innerWidth / 3
    },
    vertex: {
        radius: 0.35,
        defaultColor: "#52bf90",
        visitedColor: "#1d4433",
        outlineColor: "#317256"
    },
    edge: {
        baseWidth: 0.1, // base width offset = baseWidth * circle radius
        width: 0.5, // edge width = width * circle radius
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
    cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
    zoomable: false,
};



var clusterMat2 = [["Sqr", "Cir", "Tri"], ["▢", "◯", "△"]];

// Create a new Graph based on the configuration
// and bind the data to the graph for rendering
var observed = new ObservedPGM(observedConfig, "#pgm4");
//observed.appendToDOM("#pgm4");
observed.createCluster(clusterMat2, [], true);
observed.bindChart(listenerPGM.getWeightedAdjacencyMatrix());
observed.bindToListenerPGM(listenerPGM);


// Layer 1
observed.setAdjacentVertex(0, adjacentVertex = [{
    id: 3,
    weight: 0.1
}, {
    id: 4,
    weight: 0.4
}, {
    id: 5,
    weight: 0.5
}]);
observed.setAdjacentVertex(1, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);
observed.setAdjacentVertex(2, adjacentVertex = [{
    id: 3,
    weight: 0.4
}, {
    id: 4,
    weight: 0.2
}, {
    id: 5,
    weight: 0.4
}]);

//observed.createChart(matConfig);
observed.display();
