import Transform from "../../Transform";
import Utils from "../Utils";
import shaderUtil from "../../Shaders/ShaderUtil";

/* Shaders */
import vShader_Dot from "./DebugShader/Dot/vDebugShader_Dot.glsl";
import fShader_Dot from "./DebugShader/Dot/fDebugShader_Dot.glsl";


let Debugger = {};
export default Debugger;

Debugger.Dot = class {
    constructor(gl, pntSize = 10.0) {
        this.transform = new Transform();
        this.gl = gl;
        this.mColor = [];
        this.mVertices = [];
        this.mVertexBuffer = 0;
        this.mVertexCount = 0;
        this.mVertexComponentLength = 4;
        this.mPointSize = pntSize;
    }

    /* TODO: test it!!! */
    addColor() {
        if (arguments.length === 0) return this;
        for (let i = 0; i < arguments.length; i++) {
            this.mColor = Utils.rgbHexToFloat(arguments[i]);
        }
        return this;
    }

    addPoint(x1, y1, z1, cIndex) {
        this.mVertices.push(x1, y1, z1, cIndex || 0);
        this.mVertexCount = this.mVertices.length / this.mVertexComponentLength;
        return this;
    }

    addMeshPoints(cIndex, mesh) {
        if (mesh.aVertices === undefined) {
            console.error("Mesh.aVertices is undefined");
            return this;
        }

        let length = mesh.aVertices.length;
        for (let i = 0; i < length; i += 3) {
            this.mVertices.push(
                mesh.aVertices[i],
                mesh.aVertices[i + 1],
                mesh.aVertices[i + 2],
                cIndex
            );
        }
        this.mVertexCount = this.mVertices.length / this.mVertexComponentLength;
        return this;
    }

    createShader() {
        this.mShader = shaderUtil.getShaderProgram(this.gl, vShader_Dot, fShader_Dot, true);
        this.mUniformColor = this.gl.getUniformLocation(this.mShader, "uColorArray");
        this.mUniformProjection = this.gl.getUniformLocation(this.mShader, "uProjectionMatrix");
        this.mUniformCamera = this.gl.getUniformLocation(this.mShader, "uCameraMatrix");
        this.mUniformModelView = this.gl.getUniformLocation(this.mShader, "uModelViewMatrix");
        this.mUniformPointSize = this.gl.getUniformLocation(this.mShader, "uPointSize");
        this.mUniformCameraPosition = this.gl.getUniformLocation(this.mShader, "uCameraPosition");

        this.gl.useProgram(this.mShader);
        this.gl.uniform3fv(this.mUniformColor, this.mColor);
        this.gl.uniform1f(this.mUniformPointSize, this.mPointSize);
        this.gl.useProgram(null);
    }

    finalize() {
        this.mVertexBuffer = this.gl.fCreateArrayBuffer(new Float32Array(this.mVertices), true);
        this.createShader();
        return this;
    }

    render(camera) {
        this.transform.updateMatrix();

        this.gl.useProgram(this.mShader);

        this.gl.uniformMatrix4fv(this.mUniformProjection, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformCamera, false, camera.viewMatrix);
        this.gl.uniformMatrix4fv(this.mUniformModelView, false, this.transform.getViewMatrix());
        this.gl.uniform3fv(this.mUniformCameraPosition, new Float32Array( camera.transform.position.getArray() ));

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mVertexBuffer);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, this.mVertexComponentLength, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.gl.POINTS,0,this.mVertexCount);

        this.gl.disableVertexAttribArray(0);
        this.gl.useProgram(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
};

Debugger.Line = class {

};