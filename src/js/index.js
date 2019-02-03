import '../css/style.css';
import tex001 from '../resources/uv_grid_lrg.jpg';
import vShader from '../shaders/vShader.glsl';
import fShader from '../shaders/fShader.glsl';
import GridShader from './GridShader';
import GLInstance from './gl';
import RenderLoop from './RenderLoop';
import Shader from './Shader';
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

    gl.fLoadTexture('tex001', document.getElementById('texImg'));
    console.log(gl.mTextureCache);

    gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    gGridModal = Primitives.GridAxis.createModal(gl, false);

    gShader = new TestShader(gl, gCamera.projectionMatrix)
        .setTexture(gl.mTextureCache["tex001"]);
    gModal = Primitives.Quad.createModal(gl);
    gModal.setPosition(0, 0.6, 0);

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
        .renderModal(gModal.preRender());
}

class TestShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vShader, fShader);
        this.setPerspective(pMatrix);

        gl.mainTexture = -1;
        gl.useProgram(null);
    }

    setTexture(texID) {
        this.mainTexture = texID;
        return this;
    }

    preRender() {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);
        this.gl.uniform1i(this.uniformLoc.mainTexture,0);

        return this;
    }
}