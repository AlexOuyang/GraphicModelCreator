// Example Usage:
// example_data = [vertex_0, vertex_1, vertex_2......]    // a list of all the vertices in the graph
// vertex_i = {id: i-th_index_in_example_data, x: x_position, y: y_position, r: vertex_radius, adjacentVertex: {adjVertex_1, adjVertex2.....}} 
// adjVertex_j = {id: i-th_index_in_example_data, weight: edge_weight} // adjacent vertices are the vertices vertex_i connected to
var data = [{
        id: 0,
        x: 300,
        y: 100,
        r: 25,
        adjacentVertex: [{
            id: 2,
            weight: 0.1
        }, {
            id: 3,
            weight: 0.4
        }, {
            id: 4,
            weight: 0.5
        }]
    },
    {
        id: 1,
        x: 300,
        y: 200,
        r: 25,
        adjacentVertex: [{
            id: 2,
            weight: 0.4
        }, {
            id: 3,
            weight: 0.2
        }, {
            id: 4,
            weight: 0.4
        }]
    },
    {
        id: 2,
        x: 500,
        y: 50,
        r: 25,
        adjacentVertex: [{
            id: 5,
            weight: 0.3
        }, {
            id: 6,
            weight: 0.7
        }]
    },
    {
        id: 3,
        x: 500,
        y: 150,
        r: 25,
        adjacentVertex: [{
            id: 5,
            weight: 0.6
        }, {
            id: 6,
            weight: 0.4
        }]
    },
    {
        id: 4,
        x: 500,
        y: 250,
        r: 25,
        adjacentVertex: [{
            id: 5,
            weight: 0.6
        }, {
            id: 6,
            weight: 0.4
        }]
    },
    {
        id: 5,
        x: 700,
        y: 100,
        r: 25
    },
    {
        id: 6,
        x: 700,
        y: 200,
        r: 25
    },

           ];



// Handles the configuration of the grah
var config = config || {
    dim: {
        width: window.innerWidth,
        height: window.innerHeight - 150
    },
    edge: {
        baseWidth: 2,
        weightWidth: 14,
        defaultColor: "lightsteelblue",
        visitedColor: "steelblue"
    },
    zoom: false,
    nodeDraggable: true
};

// Create a new Graph based on the configuration
var myGraph = new graph(config);
// Bind the data to the graph for rendering
myGraph.bind(data);