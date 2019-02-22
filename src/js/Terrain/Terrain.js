import Model from "../Model";

export default class Terrain {
    static createModel(gl, keepRawData) {
        return new Model(Terrain.createMesh(gl, 10, 10, 20, 20, keepRawData));
    }

    static createMesh(gl, w, h, rLen, cLen, keepRawData = false) {
        let rStart = w / -2,
            cStart = h / -2,
            vLen = rLen * cLen,
            iLen = (rLen - 1) * cLen,
            rInc = h / (rLen - 1),
            cInc = w / (cLen - 1),
            cRow = 0,
            cCol = 0,
            aVert = [],
            aIndex = [],
            aUV = [],
            uvxInc = 1 / (cLen - 1),
            uvyInc = 1 / (rLen - 1);


        for (let i = 0; i < vLen; i++) {
            cRow = Math.floor(i / cLen);
            cCol = i % cLen;

            aVert.push(cStart + cCol * cInc, 0.2, rStart + cRow * rInc);

            aUV.push((cCol === cLen - 1) ? 1 : cCol * uvxInc,
                (cRow === cLen - 1) ? 1 : cRow * uvyInc);

            if (i < iLen) {
                aIndex.push(cRow * cLen + cCol, (cRow + 1) * cLen + cCol);

                if (cCol === cLen - 1 && i < iLen - 1) {
                    aIndex.push((cRow + 1) * cLen + cCol, (cRow + 1) * cLen);
                }
            }
        }
        console.log(aUV);
        let mesh = gl.fCreateMeshVAO("Terrain", aIndex, aVert, null, aUV);
        mesh.drawMode = gl.TRIANGLE_STRIP;

        return mesh;
    }
}