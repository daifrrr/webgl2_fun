import cfg from '../config/config';
import Model from './Model';

let Primitives = {};
export default Primitives;

Primitives.Cube = class {
    static createModal(gl, w, h, d, x, y, z, keepRawData) {
        return new Model(Primitives.Cube.createMesh(gl, w, h, d, x, y, z, keepRawData));
    }

    static createBasicCube(gl, keepRawData) {
        return new Model(Primitives.Cube.createMesh(gl, 1, 1, 1, 0, 0, 0, keepRawData));
    }

    static createMesh(gl, width, height, depth, x, y, z, keepRawData = false) {
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
            -1, 0, 0, 	-1, 0, 0,	-1, 0,0 ,	-1, 0, 0,		//Left
            0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
            1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Right
            0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
        ];
        let aUVs = [];
        for (let i = 0; i < 6; i++) {
            aUVs.push(0, 0,     0, 1,    1, 1,   1, 0);
        }
        let mesh = gl.fCreateMeshVAO("Cube", aIndices, aVertices, aNormals, aUVs, 4);
        mesh.noCulling = true;
        mesh.doBlending = false;
        if(keepRawData){
            mesh.aVert = aVertices;
            mesh.aNorm = aNormals;
            mesh.aIndex = aIndices;
        }
        return mesh;
    }
};

Primitives.Quad = class {
    static createModal(gl) {
        return new Model(Primitives.Quad.createMesh(gl))
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