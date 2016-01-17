var chart = function (matrixConfiguration) {
    "use strict";

    let self = this,
        adjMatData = [], // The attributes of the n by n adjacency matrix
        rowLabel = [], // A vector that contains the labels. e.g["square", "circle"]
        colLabel = [], // A vector that contains the labels. e.g["square", "circle"]
        labelsData = [], // The attributes of the labels
        config = matrixConfiguration || {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            },
            matrix: {
                x: 0.2,
                y: 0.2,
                dim: 0.6,
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
        .attr('height', config.transform.height)
        .append('g')
        .attr("transform", "translate(" + config.transform.x + "," + config.transform.y + ")"),

        // Create the background wrapper
        rect = svg.append("rect")
        .attr("width", config.transform.width)
        .attr("height", config.transform.height)
        .style("fill", config.background.color);



    function drawMatrix() {
        /* Draw the adjancy matrix */
        d3.selectAll(".cell").remove();
        d3.selectAll(".label").remove();

        // Each cell group holds 
        let cell = svg.selectAll('g')
            .data(adjMatData).enter()
            .append("g")
            .attr("class", "cell")
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

        // Each rect is a matrix cell
        cell.append("rect")
            .attr("transform", d => "translate(" + -config.matrix.dim / 2 + "," + -config.matrix.dim / 2 + ")")
            .attr('width', config.matrix.dim)
            .attr('height', config.matrix.dim)
            .attr('fill', d => {
                if (d.type === "cellData") {
                    return config.matrix.color;
                }
                if (d.type === "cellLabel") {
                    return config.background.color;
                }
            });


        // Add cell weight
        cell.append("text")
            .attr("font-size", config.matrix.dim * config.text.size)
            .attr("text-anchor", config.text.anchor)
            .attr("alignment-baseline", config.text.alignment)
            .attr("fill", config.text.color)
            .text(d => {
                if (d.type === "cellData") {
                    return d.weight;
                }
            });

        // Add cell label
        cell.append("text")
            .attr("font-size", config.matrix.dim * config.label.size)
            .attr("text-anchor", config.label.anchor)
            .attr("alignment-baseline", config.label.alignment)
            .attr("fill", config.label.color)
            .text(d => {
                if (d.type === "cellLabel") {
                    return d.label;
                }
            });
    }

    this.createMatrix = function (rowLab, colLab) {
        /* Used to create a square adj matrix based on the input Data */

        rowLabel = rowLab; // Update the labels
        colLabel = colLab; // Update the labels
        
        // Calculate the dimension of each block and other matrix config properties
        config.matrix.dim = config.matrix.dim * Array.min([config.transform.width, config.transform.height]) / Array.max([rowLabel.length, colLabel.length]);
        config.matrix.spacing *= config.matrix.dim / 10;
        config.matrix.x *= config.transform.width;
        config.matrix.y *= config.transform.height;

        // Populate adjacency matrix data
        let id = 0;
        let x;
        let y;
        for (let i = 0; i < rowLabel.length; i++) {
            for (let j = 0; j < colLabel.length; j++) {
                x = (config.matrix.dim + config.matrix.spacing) * (j + 1 / 2) + config.matrix.x;
                y = (config.matrix.dim + config.matrix.spacing) * (i + 1 / 2) + config.matrix.y;
                adjMatData.push({
                    type: "cellData",
                    id: id,
                    x: x,
                    y: y,
                    weight: 0
                });
                id++;
            }
        }

        // Add labels to the adjMat as well
        for (let i = 0; i < colLabel.length; i++) {
            // Add column labels
            x = (config.matrix.dim + config.matrix.spacing) * (i + 1 / 2) + config.matrix.x;
            y = (config.matrix.dim + config.matrix.spacing) * (-1 / 2) + config.matrix.y;
            adjMatData.push({
                type: "cellLabel",
                label: colLabel[i],
                x: x,
                y: y,
            });
        }

        // Add labels to the adjMat as well
        for (let i = 0; i < rowLabel.length; i++) {
            // Add row labels
            x = (config.matrix.dim + config.matrix.spacing) * (-1 / 2) + config.matrix.x;
            y = (config.matrix.dim + config.matrix.spacing) * (i + 1 / 2) + config.matrix.y;
            adjMatData.push({
                type: "cellLabel",
                label: rowLabel[i],
                x: x,
                y: y,
            });
        }

        drawMatrix();
    };

    this.updateMatrix = function (element) {
        /* Update the adj matrix based on the element pair
        element = (row, col), it is used to locate an element in the adj matrix
        */

        let row = rowLabel.indexOf(element[0]);
        let col = colLabel.indexOf(element[1]);

        // Test for validity of the input
        if (row < 0 || col < 0) {
            throw new Error("updateMatrix(element): the element updated does not exist in the adjacency matrix.");
        }

        // Update weight of the element
        let elementIndex = row * colLabel.length + col;
        adjMatData[elementIndex].weight += 1;

        drawMatrix();
    };

};