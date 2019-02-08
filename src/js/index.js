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
import Utils from './Utils/Utils';

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
    gl = GLInstance('glCanvas').fFitScreen(1, 1).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 100);
    gCamera.transform.rotation.set(0, 45, 0);
    gCameraControl = new CameraController(gl, gCamera);

    gl.fLoadTexture("tex001", document.getElementById("tex02Img"));

    gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    gGridModal = Primitives.GridAxis.createModal(gl, true);


    gShader = new TestShader(gl, gCamera.projectionMatrix)
        .setTexture(gl.mTextureCache["tex001"]);
    // gModal = Primitives.Cube.createModal(gl)
    //     .setPosition(0, 0.15, 0)
    //     .setScale(0.15, 0.15, 0.15);
    for (let i = 0; i < 1000; i++) {
        gModal2[i] = (i % 2 === 0) ?
            Primitives.Cube.createBasicCube(gl) :
            Primitives.Cube.createModal(gl, 4, 4, 4, 2, 2, 2);
        gModal2[i].setPosition(
            getRandomIntInclusive(-50, 50),
            getRandomIntInclusive(-50, 50),
            getRandomIntInclusive(-50, 50));
    }


    gRLoop = new RenderLoop(onRender, 60).start();
});

let pump = 0,
    tmp = 1000;
let min = (1 / Math.PI),
    max = (2 * Math.PI);

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();
    /*gGridShader.activate()
        .setCameraMatrix(gCamera.viewMatrix)
        .renderModal(gGridModal.preRender());*/
    pump += (1 / tmp);
    if (pump >= 1e-2 || pump <= -1e-2) tmp *= -1;
    // gShader.activate()
    //     .setCameraMatrix(gCamera.viewMatrix)
    //     .setTime(performance.now())
    //     .renderModal(gModal
    //         .addScale(
    //             pump * (Math.random() * (max - min) + min),
    //             pump * (Math.random() * (max - min) + min),
    //             pump * (Math.random() * (max - min) + min))
    //         .addRotation(0, 1.2, 0)
    //         .preRender());

    gModal2.forEach(function (modal) {
        gShader.activate()
            .setCameraMatrix(gCamera.viewMatrix)
            .renderModal(
                modal
                    .addRotation(getRandomIntInclusive(0, 12.5), getRandomIntInclusive(0, 25), getRandomIntInclusive(0, 45))
                    .preRender()
            )
    });

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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}