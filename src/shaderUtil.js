export default class shaderUtil {
    static domShaderSrc(elemID) {
        let elm = document.getElementById(elemID);
        if(!elm || elm.text === "") {
            console.log(elemID + " shader not found or no text.");
            return null;
        }
        return elm.text;
    }
    static createShader(gl, source, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    static createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);

        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    }
    static getShaderProgram(gl, vertID,fragID) {
        let vShader = this.createShader(gl, vertID, gl.VERTEX_SHADER);
        let fShader = this.createShader(gl, fragID, gl.FRAGMENT_SHADER);
        return this.createProgram(gl, vShader, fShader);
    }
}