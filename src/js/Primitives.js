import cfg from '../config/config';
import Modal from './Modal';

let Primitives = {};
export default Primitives;

Primitives.Quad = class {
    static createModal(gl) { return new Modal(Primitives.Quad.createMesh(gl))}
    static createMesh(gl) {
        let aVertices = [
            -0.5,  0.5, 0,
            -0.5, -0.5, 0,
             0.5, -0.5, 0,
             0.5,  0.5, 0
        ];
        let aUV = [
            0, 0,
            0, 1,
            1, 1,
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
            vertices.push(p );
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