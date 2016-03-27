'use strict';


/**
 * Created by Alex Chenxing Ouyang
 * This is used to obtain the default configurations for PGMs
 */

class Configuration {

    constructor() {
        /**
         * @memberof WeightedAdjMat
         * @type {Object}
         * @property {Object} transform - The transform property can be used to position and scale the WeightedAdjMat object
         * @property {Object} matrix - The matix property can be used to position, scale and color the matrix
         * @property {Object} label - The label property can be used to color and scale the matrix labels
         * @property {Object} text - The text property can be used to color and scale the matrix cell weight
         * @property {Object} background - The background property can be used to change the color of the background
         */

        // Handles the configuration of listener's belief
        this._listenerBeliefConfig = {
            transform: {
                x: 0,
                y: 0,
                width: window.innerWidth * 2 / 3 - 20,
                height: window.innerWidth / 2.5
            },
            vertex: {
                radius: .35,
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
                defaultColor: "#74cba6",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "#ccecde"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#52bf90"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };


        // Handles the configuration of listener
        this._listenerConfig = {
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
                baseWidth: 0, // base width offset = baseWidth * circle radius
                width: 1, // edge width = width * circle radius
                defaultColor: "#b6ddcc",
                visitedColor: "#1d4433",
                timeInterval: 400 // timeInterval is in millisecond
            },
            text: {
                color: "white",
                size: 0.5, // text size = size * circle radius
                anchor: "middle",
                alignment: "middle"

            },
            background: {
                grid: false,
                color: "rgba(255, 255, 255, 0)"
            },
            autoPlay: {
                on: false,
                button: {
                    dim: 1,
                    color: "#74cba6"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: false, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: false, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };


        // Adjacency matrix configuration
        this._adjacencyMatrixConfig = {
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
                color: "rgba(255, 255, 255, 0)"
            }
        };


        // This is the config for regular pgm
        this._pgmConfig = {
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
                timeInterval: 400 // timeInterval is in millisecond
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
                    color: "#52bf90"
                },
                timeIntervalBetweenCycle: 400
            },
            autoPlayable: true, // If autoPlayable, creates the autoplay button
            cyclingSpeedControllable: true, // if cyclingSpeedControllable, create speed button
            zoomable: false,
        };
    }

    getListenerBeliefConfig() {
        return Utils.cloneDR(this._listenerBeliefConfig);
    }

    getListenerConfig() {
        return Utils.cloneDR(this._listenerConfig);
    }

    getAdjacencyMatrixConfig() {
        return Utils.cloneDR(this._adjacencyMatrixConfig);
    }

    getPgmConfig() {
        return Utils.cloneDR(this._pgmConfig);
    }
}

let Config = new Configuration();