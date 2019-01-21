import './style.css';
import vSHADER from './vertex.glsl';
import fSHADER from './fragment.glsl';
import * as glm from 'gl-matrix';

let postions = [
    0, 0,
    25, 0,
    0, 25,
    0, 25,
    25, 0,
    25, 25,
];


function getContext(canvas, width, height) {

    let gl = canvas.getContext('webgl2');
    canvas.width = width;
    canvas.height = height;
    if(!gl) {
        console.log('could not get gl context');
        return;
    }
    return gl;
}

function main() {
    let canvas = document.getElementById('glCanvas');
    let gl = getContext(canvas, 640, 480);

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vSHADER);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fSHADER);
    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttribLocation = gl.getAttribLocation(program, "a_position");
    let colorUniformLocation = gl.getUniformLocation(program, "u_color");
    let matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postions), gl.STATIC_DRAW);
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.vertexAttribPointer(
      positionAttribLocation, 2, gl.FLOAT, false, 0, 0
    );

    drawScene();

    function drawScene() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform4f(colorUniformLocation, 1.0, 0.0, 0.0, 1.0);

        let movOrigin = glm.mat3.create();
        movOrigin = glm.mat3.translate(movOrigin, movOrigin, [-12.5, -12.5]);
        let matrix = glm.mat3.create();
        glm.mat3.projection(matrix, 400, 300);
        glm.mat3.translate(matrix, matrix, [200, 150]);

        glm.mat3.multiply(matrix, matrix, movOrigin);

        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function createShader(gl, type, source) {
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

    function createProgram(gl, vertexShader, fragmentShader) {
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
    }
}

main();