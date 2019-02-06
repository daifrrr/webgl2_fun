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
    gCamera.transform.position.set(0, 0.2, 0.5);
    gCameraControl = new CameraController(gl, gCamera);

    gl.fLoadTexture("tex001", document.getElementById("tex01Img"));


    gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    gGridModal = Primitives.GridAxis.createModal(gl, true);


    gShader = new TestShader(gl, gCamera.projectionMatrix)
        .setTexture(gl.mTextureCache["tex001"]);
    gModal = Primitives.Cube.createModal(gl)
        .setPosition(0, 0.2, 0)
        .setScale(0.2,0.2,0.2);
    /*
    for (let i = 0; i < 6; i++) {
        gModal2[i] = Primitives.Quad.createModal(gl);
    }

    gModal2[0].setPosition(0, 0.5,  0.5);
    gModal2[1].setPosition(0, 0.5, -0.5).setRotation(0, 180, 0);
    gModal2[2].setPosition(0.5, 0.5, 0).setRotation(0, 90, 0);
    gModal2[3].setPosition(-0.5, 0.5, 0).setRotation(0, 270, 0);
    gModal2[4].setPosition(0, 1, 0).setRotation(90, 180, 180);
    gModal2[5].setPosition(0, 0, 0).setRotation(270, 180, 0);
    */
    gRLoop = new RenderLoop(onRender, 60).start();
});

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();

    gGridShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gGridModal.preRender());

    gShader.activate().setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gModal
            .addRotation(0, 0.75,0)
            .preRender());
    /*gModal2.forEach(function(modal) {
       gShader.renderModal(modal.preRender());
    });*/

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
        this.gl.uniform1i(this.uniformLoc.mainTexture, 0);

        return this;
    }
}