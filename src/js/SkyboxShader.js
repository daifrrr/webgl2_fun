import vShader from '../shaders/Skybox/vSkybox.glsl';
import fShader from '../shaders/Skybox/fSkybox.glsl';
import Shader from "./Shader";


export default class SkyboxShader extends Shader {
    constructor(gl, pMatrix, skybox) {
        super(gl, vShader, fShader);

        this.uniformLoc.time = gl.getUniformLocation(this.program, "uTime");
        this.uniformLoc.skyTex = gl.getUniformLocation(this.program, "uSkyTex");

        this.setPerspective(pMatrix);
        this.texSky = skybox;
        gl.useProgram(null);
    }

    setTime(t) {
        this.gl.uniform1f(this.uniformLoc.time, t); return this;
    }

    preRender() {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texSky);
        this.gl.uniform1i(this.uniformLoc.skyTex, 0);

        return this;
    }

}