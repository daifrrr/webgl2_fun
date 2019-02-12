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
import vF16Shader from '../shaders/F16/v.glsl';
import fF16Shader from '../shaders/F16/f.glsl';

/* a bit of utility */
import Utils from './Utils/Utils';

/* Objects */
import Primitives from './Primitives';
import Models from './F16Model';


let gl, gRLoop, gGridShader, gGridModal;
let gSkyboxShader, gSkyboxModal;
let gCamera,
    gCameraControl;
let gModal,
    gModal2 = [],
    gF16,
    gF16Shader,
    gShader;


window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(0.8, 1).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraControl = new CameraController(gl, gCamera);

    //gl.fLoadTexture("tex001", document.getElementById("tex02Img"));
    let tmp = [
        document.getElementById("cube_right"),
        document.getElementById("cube_left"),
        document.getElementById("cube_top"),
        document.getElementById("cube_bottom"),
        document.getElementById("cube_back"),
        document.getElementById("cube_front"),
    ];
    gl.fLoadCubeTexture("skybox", tmp);

    gl.fLoadTexture("F16", document.getElementById("f16-tex"), true);

    gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    gGridModal = Primitives.GridAxis.createModal(gl, true);

    gSkyboxShader = new SkyboxShader(gl, gCamera.projectionMatrix,
        gl.mTextureCache["skybox"]);
    gSkyboxModal = Primitives.Cube.createModal(gl, 100, 100, 100, 0, 0, 0);

    // gShader = new TestShader(gl, gCamera.projectionMatrix)
    //     .setTexture(gl.mTextureCache["tex001"]);
    // gModal = Primitives.Cube.createBasicCube(gl);

    gF16 = Models.F16.createModal(gl)
        .setPosition(2, 0, 2);
    gF16Shader = new F16Shader(gl, gCamera.projectionMatrix, gF16.transform.getNormalMatrix())
        .setTexture(gl.mTextureCache["F16"]);

    gRLoop = new RenderLoop(onRender, 60).start();
});

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();

    gSkyboxShader.activate().preRender()
        .setCameraMatrix(gCamera.getTranslatelessMatrix())
        .setTime(performance.now())
        .renderModal(gSkyboxModal.preRender());


    gGridShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gGridModal.preRender());

    // gShader.activate()
    //     .setCameraMatrix(gCamera.viewMatrix)
    //     .setTime(performance.now())
    //     .renderModal(gModal.preRender());

    gF16Shader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .setTime(performance.now())
        .renderModal(gF16
            .setPosition(2, 0, 2)
            .addRotation(0, Math.PI, 0)
            .preRender());
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

class F16Shader extends Shader {
    constructor(gl, pMatrix, mMatrix) {
        super(gl, vF16Shader, fF16Shader);

        this.uniformLoc.time = gl.getUniformLocation(this.program, "uTime");
        let uNormMatrix = gl.getUniformLocation(this.program, "uNormMatrix");
        gl.uniformMatrix4fv(uNormMatrix, false, mMatrix);

        this.setPerspective(pMatrix);

        gl.useProgram(null);
    }

    setTime(t) {
        console.log(t);
        this.gl.uniform1f(this.uniformLoc.time, t);
        return this;
    }

    setTexture(texID) {
        this.mainTexture = texID;
        return this;
    }

    preRender() {

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);
        this.gl.uniform1i(this.uniformLoc.mainTexture, 0);

        return this;
    }
}