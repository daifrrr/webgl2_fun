

export default class Utils {

    /* HTML colors to float for OpenGL interpretation */
    static rgbHexToFloat() {
        if(arguments.length === 0) return null;

        let rtn = [];

        for(let i = 0,c,p; i < arguments.length; i++) {
            if(arguments[i].length < 7) {
                console.error('argument[' + i + '] ' +  arguments[i] + ' is not valid #RGB.');
                return null;
            }
            c = arguments[i];
            p = 1;
            for(let t = p; t < 6; t++) {
                if(isNaN(parseInt(c[t], 16))) {
                    console.error('char ' + t + ' of arg ' + i + ' "' + c[t] + '" is not a valid hex value');
                    return null;
                }
            }
            rtn.push(
                parseInt(c[p] + c[p+1], 16) / 255.0,
                parseInt(c[p+2] + c[p+3], 16) / 255.0,
                parseInt(c[p+4] + c[p+5], 16) / 255.0,
            );
        }
        return rtn;
    }

    /* normalize x value to x range, then normalize to lerp the z range */
    static map(x, xMin, xMax, zMin, zMax) {
        return (x - xMin) / (xMax - xMin) * (zMax - zMin) + zMin;
    }

    static clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    /* https://en.wikipedia.org/wiki/Smoothstep */
    static smoothStep(edge1, edge2, val) {
        let x = Math.max(0, Math.min(val - edge1) / edge2 - edge1);
        return x * x * (3 - 2 * x);
    }

    /* just get an integer between <min> and <max */
    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}