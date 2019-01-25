import ShaderUtil from './shaderUtil';
import modal from './Modal';

class Shader {

    constructor(gl, vertShaderSrc, fragShaderSrc) {
        this.program = ShaderUtil.getShaderProgram(gl, vertShaderSrc, fragShaderSrc);

        if(this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl,this.program);
            this.uniformLoc = {};
        }
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    deactivate() {
        this.gl.useProgram(null);
        return this;
    }

    dispose() {
        if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
            this.gl.useProgram(null);
        }
        this.gl.deleteProgram(this.program);
    }

    preRender(){}

    renderModal(modal) {
        this.gl.bindVertexArray(modal.mesh.vao);
        if(model.mesh.indexCount) {
            this.gl.drawElements(model.mesh.drawMode, modal.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, model.mesh.vertexCount);
        }
        this.gl.bindVertexArray(null);

        return this;
    }
}