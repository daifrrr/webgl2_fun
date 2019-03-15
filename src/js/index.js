/* CSS Import - canvas attributes */
import '../css/style.css';

/* Program Imports */
import GLInstance from './gl';
import RenderLoop from './RenderLoop';

/* import some debug utility classes */
import DebugHelper from './Utils/Helpers/DebugHelper';
import GridFloor from "./Utils/Helpers/GridFloor";

/* Camera and Controlls */
import Camera from './Camera/Camera';
import CameraController from './Camera/CameraController';

/* a bit of utility */
import Utils from './Utils/Utils';
import ResourceLoader from "./ResourceLoader";

/* Shader Imports */
import SkyboxShader from './SkyboxShader';
import vShader from '../shaders/vTestShader.glsl';
import fShader from '../shaders/fTestShader.glsl';
import vTerrainShader from '../shaders/Terrain/vTerrainShader.glsl';
import fTerrainShader from '../shaders/Terrain/fTerrainShader.glsl';

/* Terrain */
import Terrain from './Terrain/Terrain';

/* Objects */
import Primitives from './Primitives';
import ShaderBuilder from "./Shaders/ShaderBuilder";

/* Image Imports */
import * as skybox from '../shaders/Skybox/SkyboxImages';
import mask_square from '../resources/mask_square.png';
import mask_conercircles from '../resources/mask_cornercircles.png';
import muddImg from '../resources/dreck.png';
import cubeTex from '../resources/uv_grid_lrg.jpg'
import UBO from "./Shaders/UBO";
/* ***** Imports End ***** */

let gl, gRLoop;
let gGrid;
let gSkyboxShader, gSkyboxModel;
let gCamera, gCameraControl;
let gTerrain, gTerrainShader;
let gTestModel, gTestShader;
let mDebug;

window.addEventListener('load', function () {
    gl = GLInstance('glCanvas').fFitScreen(1.0, 1.0).fClear();

    gCamera = new Camera(gl);
    gCamera.transform.position.set(0, 1, 3);
    gCameraControl = new CameraController(gl, gCamera);

    gRLoop = new RenderLoop(onRender, 60);

    UBO.create(gl, "MatTransform",1, [
        {name:"matProjection", type:"mat4"},
        {name:"matCameraView", type:"mat4"}


        // {name:"float01",type:"f"},
        // {name:"float02",type:"f"},
        // {name:"float03",type:"f"},
        // {name:"projectionMat",type:"mat4"},
        // {name:"float04",type:"f"},
        // {name:"float05",type:"f"},
        // {name:"vec3",type:"vec3"},
        // {name:"float06",type:"f"},
    ]);
    UBO.Cache["MatTransform"].update("matProjection", gCamera.projectionMatrix);

    gl.fLoadCubeTexture(skybox.sk_images.name, skybox.sk_images.files);

    ResourceLoader.setup(gl, onReady).loadTexture(
        "tex", cubeTex,
        "mudd", muddImg,
        "mask_a", mask_square,
        "mask_b", mask_conercircles).start();
});

function onReady() {

    gSkyboxShader = new SkyboxShader(gl, gCamera.projectionMatrix,
        gl.mTextureCache["Skybox"]);
    gSkyboxModel = Primitives.Cube.createModal(gl, 100, 100, 100, 0, 0, 0);
    gGrid = new GridFloor(gl);

    // gTerrain = Terrain.createModel(gl, true);
    //
    // gTerrainShader = new ShaderBuilder(gl, vTerrainShader, fTerrainShader)
    //     .prepareUniforms(
    //         "uPMatrix", "mat4",
    //         "uMVMatrix", "mat4",
    //         "uCameraMatrix", "mat4",
    //         "uNormalMatrix", "mat3",
    //         "uCameraPosition", "3fv")
    //     .prepareTextures("uTex", "mudd")
    //     .setUniforms(
    //         "uPMatrix", gCamera.projectionMatrix
    //     );

    gTestModel = Primitives.Cube.createBasicCube(gl, true)
        .setPosition(0, 0, 0);

    gTestShader = new ShaderBuilder(gl, vShader, fShader)
        .prepareUniforms(
            "uMVMatrix", "mat4",
            "uColorArray", "3fv",
            "uTime", "f")
        .prepareUniformBlocks(UBO.Cache["MatTransform"],0)
        .prepareTextures("mainTexture", "tex")
        .setUniforms(
            "uColorArray", Utils.rgbHexToFloat(
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF"
            )
        );


    mDebug = new DebugHelper.Dot(gl)
        .addColor("#00FF00")
        .addPoint(0,0,0,0)
        .finalize();
    gRLoop.start();
}

function onRender(dt) {
    gl.fClear();
    gCamera.updateViewMatrix();
    UBO.Cache["MatTransform"].update("matCameraView", gCamera.viewMatrix);
    // gTerrainShader.preRender("uCameraMatrix", gCamera.viewMatrix)
    //     .renderModel(gTerrain.preRender(), false);

    gTestShader.preRender(
        //"uCameraMatrix", gCamera.viewMatrix,
    )
        .setUniforms("uTime", dt)
        .renderModel(gTestModel.preRender());
    gGrid.render(gCamera);
    //mDebug.render(gCamera);
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