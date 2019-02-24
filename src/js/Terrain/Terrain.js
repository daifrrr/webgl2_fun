import Model from "../Model";
import tumult from "tumult";

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

        let noise = new tumult.Perlin2();
        noise.seed(1);
        let high = 0, freq = 13, maxHeight = -3;

        for (let i = 0; i < vLen; i++) {
            cRow = Math.floor(i / cLen);
            cCol = i % cLen;
            high = noise.gen((cRow + 1) / freq, (cCol + 1) / freq) * maxHeight;
            aVert.push(cStart + cCol * cInc, 0.2 + high, rStart + cRow * rInc);
            aUV.push((cCol === cLen - 1) ? 1 : cCol * uvxInc,
                (cRow === cLen - 1) ? 1 : cRow * uvyInc);

            if (i < iLen) {
                aIndex.push(cRow * cLen + cCol, (cRow + 1) * cLen + cCol);

                if (cCol === cLen - 1 && i < iLen - 1) {
                    aIndex.push((cRow + 1) * cLen + cCol, (cRow + 1) * cLen);
                }
            }
        }

        let x, y, p, pos, xMax = cLen - 1, yMax = rLen - 1, nX = 0, nY = 0, nZ = 0, nLength = 0,
            hLeft, hRight, hDown, hUp,
            aNorm = [];

        for (let i = 0; i < vLen; i++) {
            y = Math.floor(i / cLen);
            x = i % cLen;
            pos = y * 3 * cLen + x * 3;

            if(x > 0){ //LEFT
                p = y*3*cLen + (x-1)*3;	//Calc Neighbor Vector
                hLeft = aVert[p+1];		//Grab only the Y position which is the height.
            }else hLeft = aVert[pos+1];	//Out of bounds, use current

            if(x < xMax){ //RIGHT
                p = y*3*cLen + (x+1)*3;
                hRight = aVert[p+1];
            }else hRight = aVert[pos+1];

            if(y > 0){ //UP
                p = (y-1)*3*cLen + x*3;
                hUp = aVert[p+1];
            }else hUp = aVert[pos+1];

            if(y < yMax){ //DOWN
                p = (y+1)*3*cLen + x*3;
                hDown = aVert[p+1];
            }else hDown = aVert[pos+1];

            nX = hLeft - hRight;
            nY = 2.0;
            nZ = hDown - hUp;
            nLength = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
            aNorm.push(nX / nLength, nY / nLength, nZ / nLength);
        }
        let mesh = gl.fCreateMeshVAO("Terrain", aIndex, aVert, aNorm, aUV);
        mesh.drawMode = gl.TRIANGLE_STRIP;

        if(keepRawData){
            mesh.aVert = aVert;
            mesh.aNorm = aNorm;
            mesh.aIndex = aIndex;
        }
        return mesh;
    }
}