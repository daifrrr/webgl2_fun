import cfg from '../config/config';
import Modal from './Modal';

let Primitives = {};
export default Primitives;

Primitives.Cube = class {
    static createModal(gl) {
        return new Modal(Primitives.Cube.createMesh(gl, 1, 1, 1, 0, 0, 0))
    }

    static createBasicCube(gl) {
        this.createMesh(gl, 1, 1, 1, 1, 1, 1);
    }

    static createMesh(gl, width, height, depth, x, y, z) {
        let w = width * 0.5, h = height * 0.5, d = depth * 0.5;
        let x0 = x - w, x1 = x + w, y0 = y - h, y1 = y + h, z0 = z - d, z1 = z + d;

        let aVertices = [
            x0, y1, z1, 0,	//0 Front
            x0, y0, z1, 0,	//1
            x1, y0, z1, 0,	//2
            x1, y1, z1, 0,	//3

            x1, y1, z0, 1,	//4 Back
            x1, y0, z0, 1,	//5
            x0, y0, z0, 1,	//6
            x0, y1, z0, 1,	//7

            x0, y1, z0, 2,	//7 Left
            x0, y0, z0, 2,	//6
            x0, y0, z1, 2,	//1
            x0, y1, z1, 2,	//0

            x0, y0, z1, 3,	//1 Bottom
            x0, y0, z0, 3,	//6
            x1, y0, z0, 3,	//5
            x1, y0, z1, 3,	//2

            x1, y1, z1, 4,	//3 Right
            x1, y0, z1, 4,	//2
            x1, y0, z0, 4,	//5
            x1, y1, z0, 4,	//4

            x0, y1, z0, 5,	//7 Top
            x0, y1, z1, 5,	//0
            x1, y1, z1, 5,	//3
            x1, y1, z0, 5	//4
        ];
        let aIndices = [];
        for (let i = 0; i < aVertices.length / 4; i += 2) {
            aIndices.push(i, i + 1, (Math.floor(i / 4) * 4) + ((i + 2) % 4));
        }
        let aNormals = [
            0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
            0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
            -1, 0, 0,	-1, 0, 0,	-1, 0,0 ,	-1, 0, 0,		//Left
            0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
            1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
            0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
        ];
        let aUVs = [];
        for (let i = 0; i < 6; i++) {
            aUVs.push(0, 0,     0, 1,    1, 1,   1, 0);
        }
        let mesh = gl.fCreateMeshVAO("Cube", aIndices, aVertices, aNormals, aUVs, 4);
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