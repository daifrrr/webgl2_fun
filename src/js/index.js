/* CSS Import - canvas attributes */
import '../css/style.css';

/* important program imports */
import GLInstance from './gl';
import Shader from './Shader';
import RenderLoop from './RenderLoop';

/* Camera and Controlls */
import Camera from './Camera';
import CameraController from './CameraController';

/* all around the shaders */
import GridShader from './GridShader';
import SkyboxShader from './SkyboxShader';
import vShader from '../shaders/vShader.glsl';
import fShader from '../shaders/fShader.glsl';

/* a bit of utility */
import Utils from './Utils/Utils';

/* Objects */
import Primitives from './Primitives';

let gl, gRLoop, gGridShader, gGridModal;
let gSkyboxShader, gSkyboxModal;
let gCamera,
    gCameraControl;
let gModal,
    gModal2 = [],
    gShader;


window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(1, 1).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraControl = new CameraController(gl, gCamera);

    gl.fLoadTexture("tex001", document.getElementById("tex02Img"));
    let tmp = [
        document.getElementById("cube_right"),
        document.getElementById("cube_left"),
        document.getElementById("cube_top"),
        document.getElementById("cube_bottom"),
        document.getElementById("cube_back"),
        document.getElementById("cube_front"),
    ];
    gl.fLoadCubeTexture("skybox", tmp);

    // gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    // gGridModal = Primitives.GridAxis.createModal(gl);

    gSkyboxShader = new SkyboxShader(gl, gCamera.projectionMatrix,
        gl.mTextureCache["skybox"]);
    gSkyboxModal = Primitives.Cube.createModal(gl, 25, 25, 25, 0, 0, 0);

    gShader = new TestShader(gl, gCamera.projectionMatrix)
        .setTexture(gl.mTextureCache["tex001"]);
    gModal = Primitives.Cube.createBasicCube(gl);


    gRLoop = new RenderLoop(onRender, 60).start();
});

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();

    gSkyboxShader.activate().preRender()
        .setCameraMatrix(gCamera.getTranslatelessMatrix())
        .setTime(performance.now())
        .renderModal(gSkyboxModal);


    // gGridShader.activate()
    //     .setCameraMatrix(gCamera.viewMatrix)
    //     .renderModal(gGridModal.preRender());

    gShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .setTime(performance.now())
        .renderModal(gModal.preRender());
}

class TestShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vShader, fShader);

        this.uniformLoc.time = gl.getUniformLocation(this.program, "uTime");

        let uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, new Float32Array(Utils.rgbHexToFloat(
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#00FFFF",
            "#FF00FF")));

        this.setPerspective(pMatrix);
        this.mainTexture = -1;
        gl.useProgram(null);
    }

    setTime(t) {
        this.gl.uniform1f(this.uniformLoc.time, t);
        return this;
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