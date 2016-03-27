/*=============== Utilities ==================*/

/** 
 * The replacement of console.log().
 * @function log
 */
const log = mesg => console.log(mesg);

/** 
 * An extension of the Array object, it finds the max element in an array.
 * @function Array.max
 */
Array.max = array => Math.max.apply(Math, array);

/** 
 * An extension of the Array object, it finds the min element in an array.
 * @function Array.min
 */
Array.min = array => Math.min.apply(Math, array);


var Utils = {};

(function() {
    "use strict";

    Utils.cloneDR = function cloneDR(o) {
        /* Clone an object deeply and recursively */

        const gdcc = "__getDeepCircularCopy__";
        if (o !== Object(o)) {
            return o; // primitive value
        }

        let set = gdcc in o,
        cache = o[gdcc],
        result;
        if (set && typeof cache == "function") {
            return cache();
        }
        // else
        o[gdcc] = () => result;
        // overwrite
        if (o instanceof Array) {
            result = [];
            for (let i = 0; i < o.length; i++) {
                result[i] = cloneDR(o[i]);
            }
        } else {
            result = {};
            for (let prop in o) {
                if (prop != gdcc) {
                    result[prop] = cloneDR(o[prop]);
                } else if (set) {
                    result[prop] = cloneDR(cache);
                }
            }
        }
        if (set) {
            o[gdcc] = cache; // reset
        } else {
            delete o[gdcc]; // unset again
        }
        return result;
    };



    Utils.isObjLiteral = function isObjLiteral(_obj) {
        /* verify if an object is an object literal */

        let _test = _obj;
        return (typeof _obj !== 'object' || _obj === null ?
            false :
            (
                (function() {
                    while (!false) {
                        if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                            break;
                        }
                    }
                    return Object.getPrototypeOf(_obj) === _test;
                })()
            )
        );
    };

    /**
     * Darkens or lightens hex color value
     * percentage ranges form -100(dark) to +100(light)
     */
    Utils.shadeColor = function Utils(colorHex, percent) {

        var R = parseInt(colorHex.substring(1, 3), 16);
        var G = parseInt(colorHex.substring(3, 5), 16);
        var B = parseInt(colorHex.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    };

}());