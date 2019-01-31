import vGShader from '../shaders/vGShader.glsl';
import fGShader from '../shaders/fGShader.glsl';
import Shader from './Shader';

export default class GridAxisShader extends Shader {
    constructor(gl, pMatrix) {
        super(gl, vGShader, fGShader);
        this.setPerspective(pMatrix);
        let uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, new Float32Array([0.8, 0.8, 0.8,  1, 0, 0,    0, 1, 0,    0, 0, 1]));
        gl.useProgram(null);
    }
}