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

    gShader = new TestShader(gl, [0.8, 0.8, 0.8,
        1, 0, 0,
        0, 1, 0,
        0, 0, 1]);


    gModal = new Modal(Primitives.GridAxis.createMesh(gl))
        .setScale(0.4, 0.4, 0.4)
        .setRotation(0, 0, 45)
        .setPosition(0.8, 0.8, 0);
    console.log(gModal);
    gRLoop = new RenderLoop(onRender).start();
});

function onRender(dt) {
    gl.fClear();
    console.log(dt);
    let p = gModal.transform.position,
        angle = Math.atan2(p.y, p.x) + (1 * dt),
        radius = Math.sqrt(p.x * p.x + p.y * p.y),
        scale = Math.max(0.2, Math.abs(Math.sin(angle)) * 1.2);
    gShader.activate().renderModal(
        gModal.setScale(scale, scale / 4, 1)
            .setPosition(radius * Math.cos(angle), radius * Math.sin(angle), 0)
            .addRotation(30 * dt, 60 * dt, 15 * dt)
            .preRender()
    );
}

class TestShader extends Shader {
    constructor(gl, aryColor) {
        super(gl, vSHADER, fSHADER);

        let uColor = gl.getUniformLocation(this.program, "uColor");

        gl.uniform3fv(uColor, aryColor);
        gl.useProgram(null);
    }
}