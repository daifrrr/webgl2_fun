/* CSS Import - canvas attributes */
import '../css/style.css';

/* Program Imports */
import GLInstance from './gl';
import Shader from './Shaders/Shader';
import RenderLoop from './RenderLoop';

/* import some debug utility classes */
import DebugHelper from './Utils/Helpers/DebugHelper';

/* Camera and Controlls */
import Camera from './Camera/Camera';
import CameraController from './Camera/CameraController';

/* a bit of utility */
import Utils from './Utils/Utils';
import ResourceLoader from "./ResourceLoader";

/* Shader Imports */
import GridShader from './GridShader';
import SkyboxShader from './SkyboxShader';
import vShader from '../shaders/vTestShader.glsl';
import fShader from '../shaders/fTestShader.glsl';
import vF16Shader from '../shaders/F16/v.glsl';
import fF16Shader from '../shaders/F16/f.glsl';
import vLightShader from '../shaders/Lighting/vLightShader.glsl';
import fLightShader from '../shaders/Lighting/fLightShader.glsl';
import vTerrainShader from '../shaders/Terrain/vTerrainShader.glsl';
import fTerrainShader from '../shaders/Terrain/fTerrainShader.glsl';
import vMaskShader from '../shaders/Mask/vMaskShader.glsl';
import fMaskShader from '../shaders/Mask/fMaskShader.glsl';

/* Terrain */
import Terrain from './Terrain/Terrain';

/* Objects */
import Primitives from './Primitives';
import Entity from './Entity';
import ShaderBuilder from "./Shaders/ShaderBuilder";

/* Image Imports */
import f16texture from '../resources/f16-texture.bmp';
import mask_square from '../resources/mask_square.png';
import mask_conercircles from '../resources/mask_cornercircles.png';
import muddImg from '../resources/dreck.png';

/* ***** Imports End ***** */

let gl, gRLoop;
let gGridShader, gGridModel;
let gSkyboxShader, gSkyboxModel;
let gCamera, gCameraControl;
let gTerrain, gTerrainShader;
let gTestModel, gTestShader;
let gF16, gF16Shader;
let mDebug;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(1.0, 1.0).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
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

    ResourceLoader.setup(gl, onReady).loadTexture(
        "mudd", muddImg,
        "mask_a", mask_square,
        "mask_b", mask_conercircles).start();
});

function onReady() {

    gSkyboxShader = new SkyboxShader(gl, gCamera.projectionMatrix,
        gl.mTextureCache["Skybox"]);
    gSkyboxModel = Primitives.Cube.createModal(gl, 100, 100, 100, 0, 0, 0);

    gTerrain = Terrain.createModel(gl, true);

    gTerrainShader = new ShaderBuilder(gl, vTerrainShader, fTerrainShader)
        .prepareUniforms(
            "uPMatrix", "mat4",
            "uMVMatrix", "mat4",
            "uCameraMatrix", "mat4",
            "uNormalMatrix", "mat3",
            "uCameraPosition", "3fv")
        .prepareTextures("uTex", "mudd")
        .setUniforms(
            "uPMatrix", gCamera.projectionMatrix
        );

    gTestShader = new ShaderBuilder(gl, vLightShader, fLightShader)
        .prepareUniforms(
            "uPMatrix", "mat4",
            "uMVMatrix", "mat4",
            "uCameraMatrix", "mat4",
            "uNormalMatrix", "mat3",
            "uCameraPosition", "3fv",
            "uLightPosition", "3fv")
        .setUniforms(
            "uPMatrix", gCamera.projectionMatrix,
        );



    gTestModel = Primitives.Cube.createBasicCube(gl)
        .setPosition(0, 1, 0);

    mDebug = new DebugHelper.Dot(gl)
        .addColor("#00FF00")
        .addPoint(0,2,0,0)
        .finalize();

    gRLoop.start();
}

function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();

    gTerrainShader.preRender("uCameraMatrix", gCamera.viewMatrix)
        .renderModel(gTerrain.preRender(), false);

    gTestShader.activate().preRender("uCameraMatrix", gCamera.viewMatrix)
        .setUniforms(
            "uLightPosition", new Float32Array([2.0, 3.0, 0])
        )
        .renderModel(gTestModel.preRender());



    mDebug.render(gCamera);
}

class TestShader extends ShaderBuilder {
    constructor(gl) {
        super(gl, vShader, fShader);
    }

    renderModel(model, doShaderClose) {
        this.gl.uniformMatrix3fv(this.uniformLoc.matNormal, false, model.transform.getNormalMatrix());
        super.renderModel(model, doShaderClose);
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