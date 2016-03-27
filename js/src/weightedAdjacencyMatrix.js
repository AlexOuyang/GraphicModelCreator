/*=============== Weighted Adjacency Matrix Graph ====================*/


"use strict";

class WeightedAdjacencyMatrix {

    /**
     * Creates a color coded adjacency matrix contained in a WeightedAdjMat object
     * @class
     * @constructor
     * @param {String} divID - the id of the div that contains the graph, e.g "#id"
     * @param {Object} matrixConfiguration - The configurations of the adjacency matrix
     */
    constructor(divID, matrixConfiguration) {

        this.config = matrixConfiguration;

        this._divID = divID;

        this._adjMatData = []; // Contains the matrix cell data and cell label data

        this._rowLabel = []; // Contains the row labels in string. e.g["square", "circle"]

        this._colLabel = []; // Contains the column labels in string. e.g["square", "circle"]

        this._svg = d3.select(this._divID)
            .append('svg')
            .attr("class", "weightedAdjMat")
            .attr('width', this.config.transform.width)
            .attr('height', this.config.transform.height)
            .append('g')
            .attr("transform", "translate(" + this.config.transform.x + "," + this.config.transform.y + ")");

        // Create the background wrapper for color theme
        this._svg.append("rect")
            .attr("class", "background")
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
     * @function redrawMatrix
     */
    redrawMatrix() {
        /* Draw the adjancy matrix */

        d3.selectAll(this._divID + " g .cell").remove();
        d3.selectAll(this._divID + " g .label").remove();

        // Each cell group holds 
        let cell = this._svg.selectAll('g')
            .data(this._adjMatData).enter()
            .append("g")
            .attr("class", "cell")
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

        // Each rect is a matrix cell
        cell.append("rect")
            .attr("transform", "translate(" + -this.config.matrix.cellDim / 2 + "," + -this.config.matrix.cellDim / 2 + ")")
            .attr('width', this.config.matrix.cellDim)
            .attr('height', this.config.matrix.cellDim)
            .attr('fill', d => {
                // Add color to the cell matrix
                if (d.type === "cellData") {
                    return this._shadeColor(this.config.matrix.color, -d.colorWeight * 5);
                }
                if (d.type === "cellLabel") {
                    return this.config.background.color;
                }
            });


        // Add cell weight text
        cell.append("text")
            .attr("font-size", this.config.matrix.cellDim * this.config.weight.size)
            .attr("text-anchor", this.config.weight.anchor)
            .attr("alignment-baseline", this.config.weight.alignment)
            .attr("fill", this.config.weight.color)
            .text(d => {
                if (d.type === "cellData") {
                    return d.weight;
                }
            });

        // Add cell label text
        cell.append("text")
            .attr("font-size", this.config.matrix.cellDim * this.config.label.size)
            .attr("text-anchor", this.config.label.anchor)
            .attr("alignment-baseline", this.config.label.alignment)
            .attr("fill", this.config.label.color)
            .text(d => {
                if (d.type === "cellLabel") {
                    return d.label;
                }
            });
    }

    /** 
     * Creates an adjacency matrix based on the row and column labels
     * @function WeightedAdjMat.createMatrix
     * @param {Array} rowLab - labels that represent the row of the matrix
     * @param {Array} colLab - labels that represent the column of the matrix
     */
    createMatrix(rowLab, colLab) {

        this._rowLabel = rowLab; // Update the labels
        this._colLabel = colLab; // Update the labels

        // Calculate the dimension of each block and other matrix config properties
        this.config.matrix.cellDim = this.config.matrix.cellDim * Array.min([this.config.transform.width, this.config.transform.height]) / Array.max([this._rowLabel.length, this._colLabel.length]);
        this.config.matrix.cellSpacing *= this.config.matrix.cellDim / 10;
        this.config.matrix.x *= this.config.transform.width;
        this.config.matrix.y *= this.config.transform.height;

        // Populate adjacency matrix data
        let id = 0;
        let x;
        let y;
        for (let i = 0; i < this._rowLabel.length; i++) {
            for (let j = 0; j < this._colLabel.length; j++) {
                x = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (j + 1 / 2) + this.config.matrix.x;
                y = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (i + 1 / 2) + this.config.matrix.y;
                this._adjMatData.push({
                    type: "cellData",
                    id: id,
                    x: x,
                    y: y,
                    weight: 0,
                    colorWeight: 0
                });
                id++;
            }
        }

        // Add column labels to the adjacent matrix.
        for (let i = 0; i < this._colLabel.length; i++) {
            // Add column labels
            x = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (i + 1 / 2) + this.config.matrix.x;
            y = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (-1 / 2) + this.config.matrix.y;
            this._adjMatData.push({
                type: "cellLabel",
                label: this._colLabel[i],
                x: x,
                y: y,
            });
        }

        // Add row labels to the adjacent matrix.
        for (let i = 0; i < this._rowLabel.length; i++) {
            // Add row labels
            x = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (-1 / 2) + this.config.matrix.x;
            y = (this.config.matrix.cellDim + this.config.matrix.cellSpacing) * (i + 1 / 2) + this.config.matrix.y;
            this._adjMatData.push({
                type: "cellLabel",
                label: this._rowLabel[i],
                x: x,
                y: y,
            });
        }

        this.redrawMatrix();
    }


    /** 
     * Increases the matix cell weight by label pair.
     * @function WeightedAdjMat.increaseCellWeight
     * @param {Array} cell - the cell to increase weight is represented by a coordinate pair using labels, ie. cell = (rowLabel, colLabel)
     * @param {Integer} weight - used to increase the weight of the cell
     */
    increaseCellWeight(cell, weight) {
        let row = this._rowLabel.indexOf(cell[0]);
        let col = this._colLabel.indexOf(cell[1]);

        if (row < 0 || col < 0) throw new Error("updateMatrix(cell): the element updated does not exist in the adjacency matrix.");

        let elementIndex = row * this._colLabel.length + col;
        this._adjMatData[elementIndex].weight += weight;
    }


    /** 
     * Increases the matix cell color weight and darkens the color by label pair.
     * @function WeightedAdjMat.increaseCellColor
     * @param {Array} cell - the cell to increase weight is represented by a coordinate pair using labels, ie. cell = (rowLabel, colLabel)
     * @param {Integer} weight - used to increase the color weight of the cell
     */
    increaseCellColor(cell, colorWeight) {
        let row = this._rowLabel.indexOf(cell[0]);
        let col = this._colLabel.indexOf(cell[1]);

        if (row < 0 || col < 0) throw new Error("updateMatrix(cell): the element updated does not exist in the adjacency matrix.");

        let elementIndex = row * this._colLabel.length + col;
        this._adjMatData[elementIndex].colorWeight += colorWeight;
    }


    /** 
     * Increases the matix column color weight and darkens the color
     * @function WeightedAdjMat.increaseColumnColor
     * @param {Array} colLabel - the label of the column to increase weight is represented by a label in string
     * @param {Integer} weight - used to increase the color weight of the cell
     */
    increaseColumnColor(colLabel, colorWeight) {
        let col = this._colLabel.indexOf(colLabel);

        if (col < 0) throw new Error("increaseColumnColor: the column updated does not exist in the adjacency matrix.");

        for (let row = 0; row < this._rowLabel.length; row++) {
            let elementIndex = row * this._colLabel.length + col;
            this._adjMatData[elementIndex].colorWeight += colorWeight;
        }
    }


    /** 
     * Reset the matix cell weight
     * @function WeightedAdjMat.resetMatrixWeight
     */
    resetMatrixWeight() {
        /* Reset each matrix cell weight to 0 */
        for (let i = 0; i < this._adjMatData.length; i++) {
            if (this._adjMatData[i].type === "cellData") {
                this._adjMatData[i].weight = 0;
            }
        }
    }

    /** 
     * Reset the matix cell color weight and updates color based on the weight
     * @function WeightedAdjMat.resetMatrixColorWeight
     */
    resetMatrixColorWeight() {
        /* Reset each matrix cell weight to 0 */
        for (let i = 0; i < this._adjMatData.length; i++) {
            if (this._adjMatData[i].type === "cellData") {
                this._adjMatData[i].colorWeight = 0;
            }
        }
    }

    /** 
     * Get the matix cell weight by cell pair = (i, j)
     * @function WeightedAdjMat.getCellWeight
     * @param {Array} cell - the cell to increase weight is represented by a coordinate pair, ie. cell = (i, j)
     * @return {Integer} cell weight
     */
    getCellWeight(cell) {
        let i = cell[0];
        let j = cell[1];

        if (i > this._colLabel.length || j > this._rowLabel.length || i < 0 || j < 0) throw new Error("getCellWeight(cell): the element to get does not exist in the adjacency matrix.");

        let elementIndex = i + j * this._colLabel.length;
        return this._adjMatData[elementIndex].weight;
    }


    getMatrix1D() {
        // Returns the adjacency matrix as a 1D array
        let matrix1D = [];
        for (let i = 0; i < this._adjMatData.length; i++) {
            if (this._adjMatData[i].type == "cellData") {
                matrix1D.push(this._adjMatData[i].weight);
            }
        }
        return matrix1D;
    }

    getMatrix2D() {
        // Returns the adjacency matrix as a 2D array,
        // matrix = [col1, col2, col3];
        let matrix1D = this.getMatrix1D();
    }


    //    resetRowLabel(row) {
    //        this._rowLabel = row;
    //    }
    //
    //    resetColLabel(col) {
    //        this._colLabel = col;
    //    }
}