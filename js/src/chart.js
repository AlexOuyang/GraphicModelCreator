var chart = function (matrixConfiguration) {
    "use strict";

    this.config = matrixConfiguration || {
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
            color: "#63c59b"
        },
        label: {
            color: "#52bf90",
            size: 0.3, // text size = size * circle radius
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

    let self = this,
        adjMatData = [], // The attributes of the n by n adjacency matrix
        rowLabel = [], // A vector that contains the labels. e.g["square", "circle"]
        colLabel = [], // A vector that contains the labels. e.g["square", "circle"]


        svg = d3.select('#pgm')
        .append('svg')
        //    .attr("class", "cell")
        .attr('width', self.config.transform.width)
        .attr('height', self.config.transform.height)
        .append('g')
        .attr("transform", "translate(" + self.config.transform.x + "," + self.config.transform.y + ")"),

        // Create the background wrapper for color theme
        rect = svg.append("rect")
        .attr("width", self.config.transform.width)
        .attr("height", self.config.transform.height)
        .style("fill", self.config.background.color);



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
            .attr("transform", "translate(" + -self.config.matrix.dim / 2 + "," + -self.config.matrix.dim / 2 + ")")
            .attr('width', self.config.matrix.dim)
            .attr('height', self.config.matrix.dim)
            .attr('fill', d => {
                if (d.type === "cellData") {
                    // return self.config.matrix.color;
                    return Utils.shadeColor(self.config.matrix.color, -d.weight * 5);
                }
                if (d.type === "cellLabel") {
                    return self.config.background.color;
                }
            });


        // Add cell weight
        cell.append("text")
            .attr("font-size", self.config.matrix.dim * self.config.text.size)
            .attr("text-anchor", self.config.text.anchor)
            .attr("alignment-baseline", self.config.text.alignment)
            .attr("fill", self.config.text.color)
            .text(d => {
                if (d.type === "cellData") {
                    return d.weight;
                }
            });

        // Add cell label
        cell.append("text")
            .attr("font-size", self.config.matrix.dim * self.config.label.size)
            .attr("text-anchor", self.config.label.anchor)
            .attr("alignment-baseline", self.config.label.alignment)
            .attr("fill", self.config.label.color)
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

        // Calculate the dimension of each block and other matrix self.config properties
        self.config.matrix.dim = self.config.matrix.dim * Array.min([self.config.transform.width, self.config.transform.height]) / Array.max([rowLabel.length, colLabel.length]);
        self.config.matrix.spacing *= self.config.matrix.dim / 10;
        self.config.matrix.x *= self.config.transform.width;
        self.config.matrix.y *= self.config.transform.height;

        // Populate adjacency matrix data
        let id = 0;
        let x;
        let y;
        for (let i = 0; i < rowLabel.length; i++) {
            for (let j = 0; j < colLabel.length; j++) {
                x = (self.config.matrix.dim + self.config.matrix.spacing) * (j + 1 / 2) + self.config.matrix.x;
                y = (self.config.matrix.dim + self.config.matrix.spacing) * (i + 1 / 2) + self.config.matrix.y;
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
            x = (self.config.matrix.dim + self.config.matrix.spacing) * (i + 1 / 2) + self.config.matrix.x;
            y = (self.config.matrix.dim + self.config.matrix.spacing) * (-1 / 2) + self.config.matrix.y;
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
            x = (self.config.matrix.dim + self.config.matrix.spacing) * (-1 / 2) + self.config.matrix.x;
            y = (self.config.matrix.dim + self.config.matrix.spacing) * (i + 1 / 2) + self.config.matrix.y;
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