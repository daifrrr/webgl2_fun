import '../css/style.css';
import vSHADER from '../shaders/vertex.glsl';
import fSHADER from '../shaders/fragment.glsl';
import GLInstance from './gl';
import RenderLoop from './renderLoop';
import Shader from './Shader';
import Modal from './Modal';

let gl,
    gRLoop,
    gModal,
    gShader;

let gPointSize = 0,
    gPSizeStep = 3,
    gAngle = 0,
    gAngleStep = (Math.PI / 180) * 90;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fSetSize(500, 500).fClear();

    gShader = new TestShader(gl, [0.8, 0.8, 0.8]);

    let mesh = gl.fCreateMeshVAO("dots", null, [0, 0, 0, 0.1, 0.1, 0, 0.1, -0.1, 0, -0.1, -0.1, 0, -0.1, 0.1, 0]);
    mesh.drawMode = gl.POINTS;

    gModal = new Modal(mesh);

    gRLoop = new RenderLoop(onRender, 60).start();
});

function onRender(dt) {
    gl.fClear();
    gShader.activate().set(
        (Math.sin(gPointSize += gPSizeStep * dt) * 10.0) + 30.0,
        (gAngle += gAngleStep * dt)
    ).renderModal(gModal);
}

class TestShader extends Shader {
    constructor(gl, aryColor) {
        super(gl, vSHADER, fSHADER);

        this.uniformLoc.uPointSize = gl.getUniformLocation(this.program, "uPointSize");
        this.uniformLoc.uAngle = gl.getUniformLocation(this.program, "uAngle");

        let uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, aryColor);
        gl.useProgram(null);
    }

    set(size, angle) {
        this.gl.uniform1f(this.uniformLoc.uPointSize, size);
        this.gl.uniform1f(this.uniformLoc.uAngle, angle);
        return this;
    }
}