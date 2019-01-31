import '../css/style.css';
import vSHADER from '../shaders/vertex.glsl';
import fSHADER from '../shaders/fragment.glsl';
import GLInstance from './gl';
import RenderLoop from './RenderLoop';
import Shader from './Shader';
import Modal from './Modal';
import Primitives from './Primitives';
import {Camera, CameraController} from "./Camera";

let gl,
    gRLoop,
    gModal,
    gShader,
    gCamera,
    gCameraControl;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fSetSize(500, 500).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0,1,3);
    gCameraControl = new CameraController(gl, gCamera);


    gShader = new TestShader(gl, [0.8, 0.8, 0.8,  1, 0, 0,  0, 1, 0,  0, 0, 1]);
    gShader.activate().setPerspective(gCamera.projectionMatrix).deactivate();

    gModal = new Modal(Primitives.GridAxis.createMesh(gl))
        .setScale(2, 2, 0)
        .setPosition(0,0,-1);
    gRLoop = new RenderLoop(onRender).start();
});

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();
    gShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gModal.preRender());
}

class TestShader extends Shader {
    constructor(gl, aryColor) {
        super(gl, vSHADER, fSHADER);

        let uColor = gl.getUniformLocation(this.program, "uColor");

        gl.uniform3fv(uColor, aryColor);
        gl.useProgram(null);
    }
}