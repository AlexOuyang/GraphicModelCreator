"use strict";

class Chart {

    /**
     * Creates a color coded adjacency matrix contained in a chart object
     * @class
     * @constructor
     * @param {Object} matrixConfiguration - The configurations of the adjacency matrix
     */
    constructor(divID, matrixConfiguration) {
        /**
         * @memberof chart
         * @type {Object}
         * @property {Object} transform - The transform property can be used to position and scale the chart object
         * @property {Object} matrix - The matix property can be used to position, scale and color the matrix
         * @property {Object} label - The label property can be used to color and scale the matrix labels
         * @property {Object} text - The text property can be used to color and scale the matrix cell weight
         * @property {Object} background - The background property can be used to change the color of the background
         */
        let defaultConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            },
            matrix: {
                x: 0.2,
                y: 0.2,
                dim: 0.6, // dimenion relative to the chart that contains the matrix
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

        this.config = matrixConfiguration || defaultConfig;

        this._adjMatData = []; // The attributes of the n by n adjacency matrix

        this._rowLabel = []; // A vector that contains the labels. e.g["square", "circle"]

        this._colLabel = []; // A vector that contains the labels. e.g["square", "circle"]

        this._svg = d3.select(divID)
            .append('svg')
            .attr('width', this.config.transform.width)
            .attr('height', this.config.transform.height)
            .append('g')
            .attr("transform", "translate(" + this.config.transform.x + "," + this.config.transform.y + ")");

        // Create the background wrapper for color theme
        this._svg.append("rect")
            .attr("width", this.config.transform.width)
            .attr("height", this.config.transform.height)
            .style("fill", this.config.background.color);
    }


    /**
     * Darkens or lightens hex color value
     * @function _shadeColor 
     * @param {String} colorHex - a hex color string. ie. "#63c59b"
     * @param {Number} percentage - shading ranges form -100(dark) to +100(light)
     */
    _shadeColor(colorHex, percent) {

        let R = parseInt(colorHex.substring(1, 3), 16);
        let G = parseInt(colorHex.substring(3, 5), 16);
        let B = parseInt(colorHex.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        let RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        let GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        let BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }


    /** 
     * Draws the adjancy matrix based on the property of each cell
     * @function _drawMatrix 
     */
    _drawMatrix() {
        /* Draw the adjancy matrix */

        d3.selectAll(".cell").remove();
        d3.selectAll(".label").remove();

        // Each cell group holds 
        let cell = this._svg.selectAll('g')
            .data(this._adjMatData).enter()
            .append("g")
            .attr("class", "cell")
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

        // Each rect is a matrix cell
        cell.append("rect")
            .attr("transform", "translate(" + -this.config.matrix.dim / 2 + "," + -this.config.matrix.dim / 2 + ")")
            .attr('width', this.config.matrix.dim)
            .attr('height', this.config.matrix.dim)
            .attr('fill', d => {
                if (d.type === "cellData") {
                    return this._shadeColor(this.config.matrix.color, -d.weight * 5);
                }
                if (d.type === "cellLabel") {
                    return this.config.background.color;
                }
            });


        // Add cell weight text
        cell.append("text")
            .attr("font-size", this.config.matrix.dim * this.config.text.size)
            .attr("text-anchor", this.config.text.anchor)
            .attr("alignment-baseline", this.config.text.alignment)
            .attr("fill", this.config.text.color)
            .text(d => {
                if (d.type === "cellData") {
                    return d.weight;
                }
            });

        // Add cell label text
        cell.append("text")
            .attr("font-size", this.config.matrix.dim * this.config.label.size)
            .attr("text-anchor", this.config.label.anchor)
            .attr("alignment-baseline", this.config.label.alignment)
            .attr("fill", this.config.label.color)
            .text(d => {
                if (d.type === "cellLabel") {
                    return d.label;
                }
            });
    }

    appendToDOM(divID) {
        
    }

    /** 
     * Creates an adjacency matrix based on the row and column labels
     * @function chart.createMatrix 
     * @param {Array} rowLab - labels that represent the row of the matrix
     * @param {Array} colLab - labels that represent the column of the matrix
     */
    createMatrix(rowLab, colLab) {

        this._rowLabel = rowLab; // Update the labels
        this._colLabel = colLab; // Update the labels

        // Calculate the dimension of each block and other matrix config properties
        this.config.matrix.dim = this.config.matrix.dim * Array.min([this.config.transform.width, this.config.transform.height]) / Array.max([this._rowLabel.length, this._colLabel.length]);
        this.config.matrix.spacing *= this.config.matrix.dim / 10;
        this.config.matrix.x *= this.config.transform.width;
        this.config.matrix.y *= this.config.transform.height;

        // Populate adjacency matrix data
        let id = 0;
        let x;
        let y;
        for (let i = 0; i < this._rowLabel.length; i++) {
            for (let j = 0; j < this._colLabel.length; j++) {
                x = (this.config.matrix.dim + this.config.matrix.spacing) * (j + 1 / 2) + this.config.matrix.x;
                y = (this.config.matrix.dim + this.config.matrix.spacing) * (i + 1 / 2) + this.config.matrix.y;
                this._adjMatData.push({
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
        for (let i = 0; i < this._colLabel.length; i++) {
            // Add column labels
            x = (this.config.matrix.dim + this.config.matrix.spacing) * (i + 1 / 2) + this.config.matrix.x;
            y = (this.config.matrix.dim + this.config.matrix.spacing) * (-1 / 2) + this.config.matrix.y;
            this._adjMatData.push({
                type: "cellLabel",
                label: this._colLabel[i],
                x: x,
                y: y,
            });
        }

        // Add labels to the adjMat as well
        for (let i = 0; i < this._rowLabel.length; i++) {
            // Add row labels
            x = (this.config.matrix.dim + this.config.matrix.spacing) * (-1 / 2) + this.config.matrix.x;
            y = (this.config.matrix.dim + this.config.matrix.spacing) * (i + 1 / 2) + this.config.matrix.y;
            this._adjMatData.push({
                type: "cellLabel",
                label: this._rowLabel[i],
                x: x,
                y: y,
            });
        }

        this._drawMatrix();
    }


    /** 
     * Increases the matix cell weight and updates color based on the weight
     * @function chart.increaseCellWeight 
     * @param {Array} cell - the cell to increase weight is represented by a coordinate pair, ie. cell = (row, col)
     */
    increaseCellWeight(cell) {
        let row = this._rowLabel.indexOf(cell[0]);
        let col = this._colLabel.indexOf(cell[1]);

        // Test for validity of the input
        if (row < 0 || col < 0) {
            throw new Error("updateMatrix(cell): the element updated does not exist in the adjacency matrix.");
        }

        // Update weight of the element
        let elementIndex = row * this._colLabel.length + col;
        this._adjMatData[elementIndex].weight += 1;
        
        this._drawMatrix();
    }

    /** 
     * Reset the matix cell weight and updates color based on the weight
     * @function chart.resetMatrixWeight 
     */
    resetMatrixWeight() {
        /* Reset each matrix cell weight to 0 */
        for (let i = 0; i < this._adjMatData.length; i++) {
            if (this._adjMatData[i].type === "cellData") {
                this._adjMatData[i].weight = 0;
            }
        }

        this._drawMatrix();
    }
}


