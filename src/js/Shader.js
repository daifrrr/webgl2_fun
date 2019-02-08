import ShaderUtil from './shaderUtil';

export default class Shader {

    constructor(gl, vertShaderSrc, fragShaderSrc) {
        this.program = ShaderUtil.getShaderProgram(gl, vertShaderSrc, fragShaderSrc);

        if(this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl,this.program);
            this.uniformLoc = ShaderUtil.getStandardUniformLocations(gl, this.program);
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

    setPerspective(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; }
    setModalMatrix(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.modalMatrix, false, matData); return this; }
    setCameraMatrix(matData){	this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; }

    dispose() {
        if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
            this.gl.useProgram(null);
        }
        this.gl.deleteProgram(this.program);
    }

    preRender(){}

    renderModal(modal) {
        this.setModalMatrix(modal.transform.getViewMatrix());
        this.gl.bindVertexArray(modal.mesh.vao);

        if(modal.mesh.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if(modal.mesh.doBlending) this.gl.enable(this.gl.BLEND);


        if(modal.mesh.indexCount) {
            this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);
        }
        this.gl.bindVertexArray(null);

        if(modal.mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if(modal.mesh.doBlending) this.gl.disable(this.gl.BLEND);

        return this;
    }
}