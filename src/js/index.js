import '../css/style.css';
import vShader from '../shaders/vShader.glsl';
import fShader from '../shaders/fShader.glsl';
import GridShader from './GridShader';
import GLInstance from './gl';
import RenderLoop from './RenderLoop';
import Shader from './Shader';
import Modal from './Modal';
import Primitives from './Primitives';
import Camera from './Camera';
import CameraController from './CameraController';

let gl,
    gRLoop,
    gModal,
    gModal2 = [],
    gShader,
    gGridShader,
    gGridModal;
let gCamera,
    gCameraControl;


window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(0.95, 0.9).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraControl = new CameraController(gl, gCamera);

    gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    gGridModal = Primitives.GridAxis.createModal(gl, true);

    gShader = new TestShader(gl, gCamera.projectionMatrix);
    gModal = Primitives.Quad.createModal(gl);
    gModal.setPosition(0,1,0).setScale(0.2,0.2,0.2);
    gModal2 = Primitives.Quad.createModal(gl);
    gModal2.setPosition(0, 0, 0);

    gRLoop = new RenderLoop(onRender, 60).start();
});

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();

    gGridShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gGridModal.preRender());
    gShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gModal.preRender())
        .renderModal(gModal2.preRender());
}

class TestShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vShader, fShader);
        this.setPerspective(pMatrix);
        gl.useProgram(null);
    }
}