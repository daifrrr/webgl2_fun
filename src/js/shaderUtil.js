import cfg from '../config/config';

export default class shaderUtil {
    static domShaderSrc(elemID) {
        let elm = document.getElementById(elemID);
        if (!elm || elm.text === "") {
            console.log(elemID + " shader not found or no text.");
            return null;
        }
        return elm.text;
    }

    static createShader(gl, source, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
        return shader;
    }

    static createProgram(gl, vertexShader, fragmentShader, doValidate) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Error creating shader program', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        if (doValidate) {
            gl.validateProgram(program);
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                console.error(program, gl.getProgramInfoLog(program));
                gl.deleteShader(program);
                return null;
            }
        }

        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    }

    static getShaderProgram(gl, vertID, fragID) {
        let vShader = this.createShader(gl, vertID, gl.VERTEX_SHADER);
        let fShader = this.createShader(gl, fragID, gl.FRAGMENT_SHADER);
        return this.createProgram(gl, vShader, fShader);
    }

    static getStandardAttribLocations(gl,program){
        return {
            position:	gl.getAttribLocation(program,cfg.ATTR_POSITION_NAME),
            norm:		gl.getAttribLocation(program,cfg.ATTR_NORMAL_NAME),
            uv:			gl.getAttribLocation(program,cfg.ATTR_UV_NAME)
        };
    }
}