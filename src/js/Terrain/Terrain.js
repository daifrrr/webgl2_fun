import Model from "../Model";

export default class Terrain {
    static createModel(gl, keepRawData) {
        return new Model(Terrain.createMesh(gl, 10, 10, 5, 5, keepRawData));
    }

    static createMesh(gl, w, h, rLen, cLen, keepRawData = false) {
        let rStart = w / -2,
            cStart = h / -2,
            vLen = rLen * cLen,
            cInc = w / (cLen - 1),
            rInc = h / (rLen - 1),
            cRow = 0,
            cCol = 0,
            aVert = [];

        for(let i = 0; i < vLen; i++) {
            cRow = Math.floor(i / cLen);
            cCol = i % cLen;

            aVert.push(cStart+cCol*cInc, 0.2, rStart+cRow*rInc);
        }

        let mesh = gl.fCreateMeshVAO("Terrain",null,aVert,null,null);
        mesh.drawMode = gl.LINE_STRIP;

        return mesh;
    }
}