var data = [{
        id: 0,
        x: 300,
        y: 100,
        r: 25,
        adjacentVertex: [{
            id: 2,
            probability: Math.random()
        }, {
            id: 3,
            probability: Math.random()
        }]
    },
    {
        id: 1,
        x: 300,
        y: 200,
        r: 25,
        adjacentVertex: [{
            id: 2,
            probability: Math.random()
        }, {
            id: 3,
            probability: Math.random()
        }]
    },
    {
        id: 2,
        x: 500,
        y: 100,
        r: 25,
        adjacentVertex: [{
            id: 4,
            probability: Math.random()
        }, {
            id: 5,
            probability: Math.random()
        }]
    },
    {
        id: 3,
        x: 500,
        y: 200,
        r: 25,
        adjacentVertex: [{
            id: 4,
            probability: Math.random()
        }, {
            id: 5,
            probability: Math.random()
        }]
    },
    {
        id: 4,
        x: 700,
        y: 100,
        r: 25
    },
    {
        id: 5,
        x: 700,
        y: 200,
        r: 25
    },

           ];

var myGraph = new graph();
myGraph.bind(data);