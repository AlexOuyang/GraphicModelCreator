'use strict';


/**
 * This is used to obtain the default configurations for PGMs
 */
class Configuration {

    /**
     * Create a new object for obtaining configuration objects.
     */
    constructor() {

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
                latentStyle: {
                    backgroundColor: "#52bf90",
                    outlineColor: "#317256"
                },
                jointlyObservableStyle:{
                    backgroundColor: "#5952BF",
                    outlineColor: "#363172"
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
                outlineColor: "#317256",
                latentStyle: {
                    backgroundColor: "#52bf90",
                    outlineColor: "#317256"
                },
                jointlyObservableStyle:{
                    backgroundColor: "#5952BF",
                    outlineColor: "#363172"
                },
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
                latentStyle: {
                    backgroundColor: "#52bf90",
                    outlineColor: "#317256"
                },
                jointlyObservableStyle:{
                    backgroundColor: "#5952BF",
                    outlineColor: "#363172"
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

    /**
     * Used to obtain the listenerBeliefConfig.
     * @return {object} listenerBeliefConfig - The configuration for the listener's belief graphical model.
     */
    getListenerBeliefConfig() {
        return Utils.cloneDR(this._listenerBeliefConfig);
    }

    /**
     * Used to obtain the listenerBeliefConfig.
     * @return {object} listenerBeliefConfig - The configuration for the listener graphical model.
     */
    getListenerConfig() {
        return Utils.cloneDR(this._listenerConfig);
    }

    /**
     * Used to obtain the adjacencyMatrixConfig.
     * @return {object} adjacencyMatrixConfig - The configuration for the adjacency matrix attached to the specified graphical model.
     */
    getAdjacencyMatrixConfig() {
        return Utils.cloneDR(this._adjacencyMatrixConfig);
    }

    /**
     * Used to obtain the pgmConfig.
     * @return {object} pgmConfig - The regular graphical model config.
     */
    getPgmConfig() {
        return Utils.cloneDR(this._pgmConfig);
    }
}

/**
 * Create a singleton for obtaining configuration objects.
 * See {@link Configuration} to obtain configuration objects for graphical models.
 */
let Config = new Configuration();