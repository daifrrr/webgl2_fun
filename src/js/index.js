/* CSS Import - canvas attributes */
import '../css/style.css';

/* Image Import */
import uv_grid_lrg from '../resources/uv_grid_lrg.jpg';

/* important program imports */
import GLInstance from './gl';
import Shader from './Shaders/Shader';
import RenderLoop from './RenderLoop';

/* import some debug utility classes */
import DebugHelper from './Utils/Helpers/DebugHelper';

/* Camera and Controlls */
import Camera from './Camera/Camera';
import CameraController from './Camera/CameraController';

/* all around the shaders */
import GridShader from './GridShader';
import SkyboxShader from './SkyboxShader';
import vShader from '../shaders/vTestShader.glsl';
import fShader from '../shaders/fTestShader.glsl';
import vF16Shader from '../shaders/F16/v.glsl';
import fF16Shader from '../shaders/F16/f.glsl';

/* a bit of utility */
import Utils from './Utils/Utils';

/* Objects */
import Primitives from './Primitives';
import Entity from './Entity';
import ShaderBuilder from "./Shaders/ShaderBuilder";

import ResourceLoader from "./ResourceLoader";


let gl, gRLoop;
let gGridShader, gGridModel;
let gSkyboxShader, gSkyboxModel;
let gCamera, gCameraControl;
let gTestModel, gTestShader;
let gF16, gF16Shader;
let mDebug;


window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(1.0, 1.0).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 0, 3);
    gCameraControl = new CameraController(gl, gCamera);

    gRLoop = new RenderLoop(onRender, 60);

    let skyboxImages = [
        document.getElementById("cube_right"),
        document.getElementById("cube_left"),
        document.getElementById("cube_top"),
        document.getElementById("cube_bottom"),
        document.getElementById("cube_back"),
        document.getElementById("cube_front"),
    ];
    gl.fLoadCubeTexture("Skybox", skyboxImages);
    // gl.fLoadTexture("F16", document.getElementById("f16-tex"), true);


    // gGridShader = new GridShader(gl, gCamera.projectionMatrix);
    // gGridModal = Primitives.GridAxis.createModal(gl, true);

    gSkyboxShader = new SkyboxShader(gl, gCamera.projectionMatrix,
        gl.mTextureCache["Skybox"]);
    gSkyboxModel = Primitives.Cube.createModal(gl, 100, 100, 100, 0, 0, 0);

    mDebug = new DebugHelper.Dot(gl, 10)
        .addColor('#F000F0')
        .addPoint(0,0,0,0)
        .finalize();
    ResourceLoader.setup(gl, onReady).loadTexture("tex001", uv_grid_lrg).start();
});

function onReady() {

    // gTestShader = new TestShader(gl, gCamera.projectionMatrix)
    //     .setTexture(gl.mTextureCache["F16"]);

    gTestShader = new ShaderBuilder(gl,vShader, fShader)
        .prepareUniforms("uPMatrix","mat4","uMVMatrix","mat4","uCameraMatrix","mat4")
        .prepareTextures("uTexture","tex001")
        .setUniforms("uPMatrix",gCamera.projectionMatrix);
    gTestModel = Primitives.Cube.createBasicCube(gl)
        .setPosition(0.25, 0, 0);

    gRLoop.start();
}

let radius = 2.2,
    angle = 0,
    angleInc = 1,
    yPos = 0,
    yPosInc = 0.2;

function onRender(dt) {
    gCamera.updateViewMatrix();
    gl.fClear();

    gSkyboxShader.activate().preRender()
        .setCameraMatrix(gCamera.getTranslatelessMatrix())
        .setTime(performance.now())
        .renderModel(gSkyboxModel.preRender());

    /* Grid
    gGridShader.activate()
          .setCameraMatrix(gCamera.viewMatrix)
          .renderModel(gGridModal.preRender());
    */

    angle += angleInc * dt;
    yPos += yPosInc * dt;

    let Dx = radius * Math.cos(angle),
        Dz = radius * Math.sin(angle);
        mDebug.transform.position.set(Dx, 0 ,Dz);

    // gTestModel.transform.position.set(-x, 0, -z);

    gTestShader.preRender("uCameraMatrix",gCamera.viewMatrix)
        .renderModel(gTestModel.preRender());


    mDebug.render(gCamera);
}

class TestShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vShader, fShader);

        this.uniformLoc.lightPosition = gl.getUniformLocation(this.program, "uLightPosition");
        this.uniformLoc.cameraPosition = gl.getUniformLocation(this.program, "uCameraPosition");
        this.uniformLoc.matNormal = gl.getUniformLocation(this.program, "uNormalMatrix");

        this.setPerspective(pMatrix);
        this.mainTexture = -1;
        gl.useProgram(null);
    }

    setTime(t) {
        this.gl.uniform1f(this.uniformLoc.time, t);
        return this;
    }

    setLightPosition(obj) {
        this.gl.uniform3fv(this.uniformLoc.lightPosition, new Float32Array(obj.transform.position.getArray()));
        return this;
    }

    setCameraPosition(obj) {
        this.gl.uniform3fv(this.uniformLoc.cameraPosition, new Float32Array(obj.transform.position.getArray()));
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

    renderModel(model) {
        this.gl.uniformMatrix3fv(this.uniformLoc.matNormal, false, model.transform.getNormalMatrix());
        super.renderModel(model);
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