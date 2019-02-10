import vShader from '../shaders/Skybox/vSkybox.glsl';
import fShader from '../shaders/Skybox/fSkybox.glsl';
import Shader from "./Shader";


export default class SkyboxShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vShader, fShader);

    }
}