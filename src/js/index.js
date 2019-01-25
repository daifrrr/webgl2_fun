import '../css/style.css';
import vSHADER from '../shaders/vertex.glsl';
import fSHADER from '../shaders/fragment.glsl';
import GLInstance from './gl';
import sh from './shaderUtil';
import RenderLoop from './renderLoop';
import cfg from '../config/config';

var gl,
    gVerticesCount = 0,
    uPointSizeLoc = -1,
    uAngle = 0,
    gRLoop;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fSetSize(500, 500).fClear();

    let program = sh.getShaderProgram(gl, vSHADER, fSHADER);
    gl.useProgram(program);
    let aPositionLoc = gl.getAttribLocation(program, "a_position");
    uAngle = gl.getUniformLocation(program, "uAngle");
    uPointSizeLoc = gl.getUniformLocation(program, "uPointSize");
    gl.useProgram(null);

    let arrayVertices = new Float32Array([0, 0, 0]),
        verticesBuffer = gl.fCreateArrayBuffer(arrayVertices);
    gVerticesCount = arrayVertices.length / 3;


    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gRLoop = new RenderLoop(onRender).start();
});

var gPointSize = 0,
    gPSizeStep = 3,
    gAngle = 0,
    gAngleStep = (Math.PI / 180) * 90;

function onRender(dt) {
    gPointSize += gPSizeStep * dt;
    let size = (Math.sin(gPointSize) * 10.0) + 25.0;

    gl.uniform1f(uPointSizeLoc, size);

    gAngle += gAngleStep * dt;
    gl.uniform1f(uAngle, gAngle * 0.01);

    gl.fClear();
    gl.drawArrays(gl.POINTS, 0, gVerticesCount);
}