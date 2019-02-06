import cfg from '../config/config';
import Modal from './Modal';

let Primitives = {};
export default Primitives;

Primitives.Cube = class {
    static createModal(gl) {
        return new Modal(Primitives.Cube.createMesh(gl))
    }

    static createMesh(gl) {
        let aVertices = [
            -1, -1, 1,
            1, -1, 1,
            1, 1, 1,
            -1, 1, 1,

            -1, -1, -1,
            1, -1, -1,
            1, 1, -1,
            -1, 1, -1
        ];
        let aUV = [
            0, 0.66,
            0.25, 0.66,
            0, 0.33,
            0.25, 0.33,

            0.5, 0.66,
            0.5, 0.33,
            0.75, 0.66,
            0.75, 0.33,

            1, 0.66,
            1, 0.33,

            0.25, 1,
            0.5, 1,

            0.25, 0,
            0.5, 0,
        ];
        let aInd = [
            0, 1, 2,
            2, 3, 0,

            1, 5, 6,
            6, 2, 1,

            7, 6, 5,
            5, 4, 7,

            4, 0, 3,
            3, 7, 4,

            4, 5, 1,
            1, 0, 4,

            3, 2, 6,
            6, 7, 3,
        ];
        let mesh = gl.fCreateMeshVAO("Cube", aInd, aVertices, null, aUV);
        mesh.noCulling = false;
        mesh.doBlending = false;
        return mesh;
    }
};

Primitives.Quad = class {
    static createModal(gl) {
        return new Modal(Primitives.Quad.createMesh(gl))
    }

    static createMesh(gl) {
        let aVertices = [
            -0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0
        ];
        let aUV = [
            0.5, 0,
            0.5, 0.5,
            1, 0.5,
            1, 0
        ];
        let aIndex = [
            0, 1, 2,
            2, 3, 0
        ];
        let mesh = gl.fCreateMeshVAO("Quad", aIndex, aVertices, null, aUV);
        mesh.noCulling = false;
        mesh.doBlending = false;
        return mesh;
    }
};


Primitives.GridAxis = class {
    static createModal(gl, incAxis) {
        return new Modal(Primitives.GridAxis.createMesh(gl, incAxis));
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