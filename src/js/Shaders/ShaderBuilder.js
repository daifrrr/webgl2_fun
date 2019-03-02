import ShaderUtil from "./ShaderUtil";
import UBO from './UBO';

export default class ShaderBuilder {
    constructor(gl, vertexShader, fragmentShader) {
        this.program = ShaderUtil.getShaderProgram(gl, vertexShader, fragmentShader, true);

        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.mUniformList = [];     // Key=UNIFORM_NAME {loc, type}
            this.mTextureList = [];     // texture uniforms, Indexed {loc, tex}

            this.noCulling = false;
            this.doBlending = false;
        }
    }

    prepareUniforms() {
        if (arguments.length % 2 !== 0) {
            console.error("prepareUniforms need arguments to be in pairs");
            return this;
        }

        let loc = 0;
        for (let i = 0; i < arguments.length; i += 2) {
            loc = this.gl.getUniformLocation(this.program, arguments[i]);
            if (loc !== null) this.mUniformList[arguments[i]] = {loc: loc, type: arguments[i + 1]};
        }
        return this;
    }

    prepareUniformBlocks(ubo, blockIndex) {
        let index = 0;
        for(let i = 0; i < arguments.length; i+=2) {
            //index = this.gl.getUniformBlockIndex(this.program, arguments[i].blockName);
            //console.log("Unform Block Index ", index, ubo.blockName,ubo.blockPoint);
            this.gl.uniformBlockBinding(this.program, arguments[i+1], arguments[i].blockPoint)

            // console.log(this.gl.getActiveUniformBlockParameter(this.program, 0, this.gl.UNIFORM_BLOCK_DATA_SIZE));
            // console.log(this.gl.getActiveUniformBlockParameter(this.program, 0, this.gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES));
            // console.log(this.gl.getActiveUniformBlockParameter(this.program, 0, this.gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS));
            // console.log(this.gl.getActiveUniformBlockParameter(this.program, 0, this.gl.UNIFORM_BLOCK_BINDING));
        }
        return this;
    }

    prepareTextures() {
        if (arguments.length % 2 !== 0) {
            console.error("preTextures need arguments to be in pairs");
            return this;
        }

        let loc = 0, tex = "";
        for (let i = 0; i < arguments.length; i += 2) {
            tex = this.gl.mTextureCache[arguments[i + 1]];
            if (tex === undefined) {
                console.error("Texture not found in cache " + arguments[i + 1]);
                continue;
            }

            loc = this.gl.getUniformLocation(this.program, arguments[i]);
            if (loc !== null) this.mTextureList.push({loc: loc, tex: tex});
        }
        return this;
    }

    setUniforms() {
        if (arguments.length % 2 !== 0) {
            console.error("setUniforms need arguments to be in pairs");
            return this;
        }
        let name;
        for (let i = 0; i < arguments.length; i += 2) {
            name = arguments[i];

            if (this.mUniformList[name] === undefined) {
                console.error("uniform not found " + name);
                return this;
            }

            switch (this.mUniformList[name].type) {
                case "2fv":
                    this.gl.uniform2fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "3fv":
                    this.gl.uniform3fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "4fv":
                    this.gl.uniform4fv(this.mUniformList[name].loc, new Float32Array(arguments[i + 1]));
                    break;
                case "mat3":
                    this.gl.uniformMatrix3fv(this.mUniformList[name].loc, false, new Float32Array(arguments[i+1]));
                    break;
                case "mat4":
                    this.gl.uniformMatrix4fv(this.mUniformList[name].loc, false, new Float32Array(arguments[i + 1]));
                    break;
                case "f":
                    this.gl.uniform1f(this.mUniformList[name].loc, arguments[i + 1]);
                    break;
                default:
                    console.error("unknown uniform type for " + name);
                    break;
            }
        }

        return this;
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    deactive() {
        this.gl.useProgram(null);
        return this;
    }

    dispose() {
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    preRender() {
        this.gl.useProgram(this.program);

        if (arguments.length > 0) this.setUniforms.apply(this, arguments);

        if (this.mTextureList.length > 0) {
            let texSlot;
            for (let i = 0; i < this.mTextureList.length; i++) {
                texSlot = this.gl["TEXTURE" + i];
                this.gl.activeTexture(texSlot);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.mTextureList[i].tex);
                this.gl.uniform1i(this.mTextureList[i].loc, i);
            }
        }

        return this;
    }

    renderModel(model, doShaderClose) {
        this.setUniforms("uMVMatrix", model.transform.getViewMatrix());
        this.gl.bindVertexArray(model.mesh.vao);

        if (model.mesh.noCulling || this.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.enable(this.gl.BLEND);

        if (model.mesh.indexCount) this.gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        this.gl.bindVertexArray(null);
        if (model.mesh.noCulling || this.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (model.mesh.doBlending || this.doBlending) this.gl.disable(this.gl.BLEND);
        if(doShaderClose) this.gl.useProgram(null);

        return this;
    }
}