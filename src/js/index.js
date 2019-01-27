import '../css/style.css';
import vSHADER from '../shaders/vertex.glsl';
import fSHADER from '../shaders/fragment.glsl';
import GLInstance from './gl';
import RenderLoop from './RenderLoop';
import Shader from './Shader';
import Modal from './Modal';
import Primitives from './Primitives';
import * as glm from 'gl-matrix';

let gl,
    gRLoop,
    gModal,
    gShader;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fSetSize(500, 500).fClear();

    let my_vec3 = glm.vec3.fromValues(1, 2, 3);
    glm.vec3.add(my_vec3, glm.vec3.fromValues(1, 2, 3), glm.vec3.fromValues(1, 2, 3));

    console.log(my_vec3);

    gShader = new TestShader(gl, [0,0,1, 0,0,0, 0,1,0, 1,1,1]);

    // let mesh = gl.fCreateMeshVAO("lines", null, [-1,0,0,1,0,0,  0,-1,0,0,1,0]);
    // mesh.drawMode = gl.LINES;
    gModal = new Modal(Primitives.GridAxis.createMesh(gl));

    gRLoop = new RenderLoop(onRender).start();
});

function onRender(dt) {
    gl.fClear();
    gShader.activate()
        .renderModal(gModal);
}

class TestShader extends Shader {
    constructor(gl, aryColor) {
        super(gl, vSHADER, fSHADER);

        let uColor = gl.getUniformLocation(this.program, "uColor");

        gl.uniform3fv(uColor, aryColor);
        gl.useProgram(null);
    }
}