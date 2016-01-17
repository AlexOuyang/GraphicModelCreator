var chart = function (matrixConfiguration) {
    "use strict";

    let data = [], // The matrix that contains n by n cells
        labels = [], // The vector that contains the labels. e.g["square", "circle"]
        config = matrixConfiguration || {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
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
        },

        svg = d3.select('#pgm')
        .append('svg')
        //    .attr("class", "cell")
        .attr('width', config.transform.width)
        .attr('height', config.transform.height),

        // Create the background wrapper
        rect = svg.append("rect")
        .attr("width", config.transform.width)
        .attr("height", config.transform.height)
        .style("fill", config.background.color);



    function drawMatrix() {
        /* Draw the adjancy matrix */
        d3.selectAll(".cell").remove();

        // Each cell group holds 
        let cell = svg.selectAll('g')
            .data(data).enter()
            .append("g")
            .attr("class", "cell")
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

        cell.append("rect")
            .attr("transform", d => "translate(" + -config.cell.dim / 2 + "," + -config.cell.dim / 2 + ")")
            .attr('width', config.cell.dim)
            .attr('height', config.cell.dim)
            .attr('fill', d => {
                return config.cell.color;
            });

        // Add a text element to the previously added g element. 
        cell.append("text")
            .attr("font-size", config.cell.dim * config.text.size)
            .attr("text-anchor", config.text.anchor)
            .attr("alignment-baseline", config.text.alignment)
            .attr("fill", config.text.color)
            .text(d => {
                return d.weight;
            });
    }

    this.createMatrix = function (inputData) {
        /* Used to create the adj matrix based on the input Data */

        labels = inputData; // Update the labels

        let matDim = inputData.length;
        // Calculate the dimension of each block
        config.cell.dim = config.cell.dim * Array.min([config.transform.width, config.transform.height]) / matDim;
        config.cell.spacing *= config.cell.dim / 10;

        let id = 0;
        let x;
        let y;
        for (let i = 0; i < matDim; i++) {
            for (let j = 0; j < matDim; j++) {
                x = (config.cell.dim + config.cell.spacing) * (j + 1);
                y = (config.cell.dim + config.cell.spacing) * (i + 1);
                data.push({
                    id: id,
                    x: x,
                    y: y,
                    weight: 0
                });
                id++;
            }
        }
        drawMatrix();
    };

    this.updateMatrix = function (element) {
        /* Update the adj matrix based on the element pair
        element = (row, col), it is used to locate an element in the adj matrix
        */

        let row = labels.indexOf(element[0]);
        let col = labels.indexOf(element[1]);

        // Test for validity of the input
        if (row < 0 || col < 0) {
            throw new Error("updateMatrix(element): the element updated does not exist in the adjacency matrix.");
        }

        // Update weight of the element
        let elementIndex = row * labels.length + col;
        data[elementIndex].weight += 1;

        drawMatrix();
    };

};