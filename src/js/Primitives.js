import cfg from '../config/config';

let Primitives = {};
export default Primitives;
Primitives.GridAxis = class {
    static createModal(gl, incAxis) {
        return new Modal(Primitives.GridAxis.createMesh(gl, incAxis));
    }

    static createMesh(gl, incAxis) {
        let verts = [],
            size = 2,
            div = 10.0,
            step = size / div,
            half = size / 2;

        let p;
        for (let i = 0; i <= div; i++) {
            p = -half + (i * step);
            verts.push(p);
            verts.push(0);
            verts.push(half);
            verts.push(0);

            verts.push(p);
            verts.push(0);
            verts.push(-half);
            verts.push(0);

            p = half - (i * step);
            verts.push(-half);
            verts.push(0);
            verts.push(p );
            verts.push(0);

            verts.push(half);
            verts.push(0);
            verts.push(p);
            verts.push(0);
        }
        if (incAxis) {
            //x axis
            verts.push(-1.1);	//x1
            verts.push(0);		//y1
            verts.push(0);		//z1
            verts.push(1);		//c2

            verts.push(1.1);	//x2
            verts.push(0);		//y2
            verts.push(0);		//z2
            verts.push(1);		//c2

            //y axis
            verts.push(0);//x1
            verts.push(-1.1);	//y1
            verts.push(0);		//z1
            verts.push(2);		//c2

            verts.push(0);		//x2
            verts.push(1.1);	//y2
            verts.push(0);		//z2
            verts.push(2);		//c2

            //z axis
            verts.push(0);		//x1
            verts.push(0);		//y1
            verts.push(-1.1);	//z1
            verts.push(3);		//c2

            verts.push(0);		//x2
            verts.push(0);		//y2
            verts.push(1.1);	//z2
            verts.push(3);		//c2
        }

        let attrColorLocation = 4,
            strideLen,
            mesh = {drawMode: gl.LINES, vao: gl.createVertexArray()};

        mesh.vertexComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertexComponentLen;
        strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
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