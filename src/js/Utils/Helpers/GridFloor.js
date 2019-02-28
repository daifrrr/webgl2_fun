import cfg from '../../../config/config';
import ShaderUtil from "../../Shaders/ShaderUtil";
import Transform from "../../Transform"
import vShader from "./Grid/vGridShader.glsl";
import fShader from "./Grid/fGridShader.glsl";

export default class GridFloor {
    constructor(gl, incAxis = true) {
        this.transform = new Transform();
        this.gl = gl;
        this.createMesh(gl, incAxis);
        this.createShader();
    }

    createShader() {
        this.mShader = ShaderUtil.getShaderProgram(this.gl, vShader, fShader, true);
        this.mUniformColor = this.gl.getUniformLocation(this.mShader, "uColor");
        this.mUniformProjectionMatrix = this.gl.getUniformLocation(this.mShader, "uPMatrix");
        this.mUniformCameraMatrix = this.gl.getUniformLocation(this.mShader, "uCameraMatrix");
        this.mUniformModelViewMatrix = this.gl.getUniformLocation(this.mShader, "uMVMatrix");

        this.gl.useProgram(this.mShader);
        this.gl.uniform3fv(this.mUniformColor, new Float32Array([0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]));
        this.gl.useProgram(null);
    }

    render(camera) {
        this.transform.updateMatrix();

        this.gl.useProgram(this.mShader);
        this.gl.bindVertexArray(this.mesh.vao);

        this.gl.uniformMatrix4fv(this.mUniformProjectionMatrix, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(this.mUniformCameraMatrix, false, camera.viewMatrix);
        this.gl.uniformMatrix4fv(this.mUniformModelViewMatrix, false, this.transform.getViewMatrix());

        this.gl.drawArrays(this.mesh.drawMode, 0, this.mesh.vertexCount);
    }

    createMesh(gl, incAxis) {
        let vertices = [],
            size = 2,
            div = 10.0,
            step = size / div,
            half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + (i * step);
            vertices.push(p);
            vertices.push(0);
            vertices.push(half);
            vertices.push(0);

            vertices.push(p);
            vertices.push(0);
            vertices.push(-half);
            vertices.push(0);

            p = half - (i * step);
            vertices.push(-half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);

            vertices.push(half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);
        }
        if (incAxis) {
            //x axis
            vertices.push(-1.1);	//x1
            vertices.push(0);		//y1
            vertices.push(0);		//z1
            vertices.push(1);		//c2

            vertices.push(1.1);	//x2
            vertices.push(0);		//y2
            vertices.push(0);		//z2
            vertices.push(1);		//c2

            //y axis
            vertices.push(0);//x1
            vertices.push(-1.1);	//y1
            vertices.push(0);		//z1
            vertices.push(2);		//c2

            vertices.push(0);		//x2
            vertices.push(1.1);	//y2
            vertices.push(0);		//z2
            vertices.push(2);		//c2

            //z axis
            vertices.push(0);		//x1
            vertices.push(0);		//y1
            vertices.push(-1.1);	//z1
            vertices.push(3);		//c2

            vertices.push(0);		//x2
            vertices.push(0);		//y2
            vertices.push(1.1);	//z2
            vertices.push(3);		//c2
        }

        let attrColorLocation = 4,
            strideLen,
            mesh = {drawMode: gl.LINES, vao: gl.createVertexArray()};

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = vertices.length / mesh.vertexComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(cfg.ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLocation);

        gl.vertexAttribPointer(
            cfg.ATTR_POSITION_LOC,
            3,
            gl.FLOAT,
            false,
            strideLen,
            0
        );

        gl.vertexAttribPointer(
            attrColorLocation,
            1,
            gl.FLOAT,
            false,
            strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3
        );

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache["grid"] = mesh;
        this.mesh = mesh;
    }
}

/*
    Primitives.GridAxis = class {
    static createModal(gl, incAxis) {
        return new Model(Primitives.GridAxis.createMesh(gl, incAxis));
    }

    static createMesh(gl, incAxis) {
        let vertices = [],
            size = 2,
            div = 10.0,
            step = size / div,
            half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + (i * step);
            vertices.push(p);
            vertices.push(0);
            vertices.push(half);
            vertices.push(0);

            vertices.push(p);
            vertices.push(0);
            vertices.push(-half);
            vertices.push(0);

            p = half - (i * step);
            vertices.push(-half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);

            vertices.push(half);
            vertices.push(0);
            vertices.push(p);
            vertices.push(0);
        }
        if (incAxis) {
            //x axis
            vertices.push(-1.1);	//x1
            vertices.push(0);		//y1
            vertices.push(0);		//z1
            vertices.push(1);		//c2

            vertices.push(1.1);	//x2
            vertices.push(0);		//y2
            vertices.push(0);		//z2
            vertices.push(1);		//c2

            //y axis
            vertices.push(0);//x1
            vertices.push(-1.1);	//y1
            vertices.push(0);		//z1
            vertices.push(2);		//c2

            vertices.push(0);		//x2
            vertices.push(1.1);	//y2
            vertices.push(0);		//z2
            vertices.push(2);		//c2

            //z axis
            vertices.push(0);		//x1
            vertices.push(0);		//y1
            vertices.push(-1.1);	//z1
            vertices.push(3);		//c2

            vertices.push(0);		//x2
            vertices.push(0);		//y2
            vertices.push(1.1);	//z2
            vertices.push(3);		//c2
        }

        let attrColorLocation = 4,
            strideLen,
            mesh = {drawMode: gl.LINES, vao: gl.createVertexArray()};

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = vertices.length / mesh.vertexComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(cfg.ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLocation);

        gl.vertexAttribPointer(
            cfg.ATTR_POSITION_LOC,
            3,
            gl.FLOAT,
            false,
            strideLen,
            0
        );

        gl.vertexAttribPointer(
            attrColorLocation,
            1,
            gl.FLOAT,
            false,
            strideLen,
            Float32Array.BYTES_PER_ELEMENT * 3
        );

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache["grid"] = mesh;
        return mesh;
    }
};


 */