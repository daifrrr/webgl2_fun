import Util from '../utility/util';

export const ASGARD_CONSTS = {
    ATTR_POSITION_LOC   :   0,
    ATTR_NORM_LOC       :   1,
    ATTR_UV_LOC         :   2,
    UBO_TRANSFORM       :   "UBOTransform",
    UNI_MODEL_MAT_NAME  :   "uModelMatrix",
};

export function GLInstance(canvasID) {
    let canvas = document.getElementById(canvasID);
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error('could not get gl context');
    }

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this; };
    gl.fClearColor = function(hex){
        let a = Util.rgbHexToFloat(hex);
        gl.clearColor(a[0],a[1],a[2],1.0);
        return this;
    };

    gl.fCreateArrayBuffer = function (arrayVertices, isStatic = true, isUnbind = false) {
        let buffer = gl.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buffer);
        this.bufferData(this.ARRAY_BUFFER, arrayVertices, (isStatic) ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        if(isUnbind) {
            this.bindBuffer(this.ARRAY_BUFFER, null);
        }
        return buffer;
    };

    gl.fLoadTexture = function(name, img, doYFlip, noMips) {
        let tex = Resources.Textures[name] = this.createTexture();
        return this.fUpdateTexture(name, img, doYFlip, noMips);
    };

    gl.fUpdateTexture = function (name, img, doYFlip = false, noMips) {
        let tex = this.mTextureCache[name];
        if (!doYFlip) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, 1);
        this.bindTexture(this.TEXTURE_2D, tex);
        this.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        if(noMips === undefined || noMips === false) {
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
            this.generateMipmap(this.TEXTURE_2D);
        } else {
            this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        this.bindTexture(this.TEXTURE_2D, null);

        if (!doYFlip) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, 0);

        return tex;
    };

    gl.fLoadCubeTexture = function(name, imageArray) {
        if(imageArray.length !== 6) {
            console.error('Cube map must have an image array of 6: ' + imageArray.length + ' given');
            return null;
        }

        let tex = this.createTexture();
        this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

        for(let i = 0; i < 6; i++) {
            this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imageArray[i]);
        }

        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE);

        this.bindTexture(this.TEXTURE_CUBE_MAP, null);
        Resources.Textures[name];
        return tex;
    };

    gl.fCreateMeshVAO = function (name, aryInd, aryVert, aryNorm, aryUV, vertLength) {
        let rtn = {drawMode: this.TRIANGLES};

        rtn.vao = this.createVertexArray();
        this.bindVertexArray(rtn.vao);

        if (aryVert !== undefined && aryVert != null) {
            rtn.bufVertices = this.createBuffer();
            rtn.vertexComponentLength = vertLength || 3;
            rtn.vertexCount = aryVert.length / rtn.vertexComponentLength;

            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryVert), this.STATIC_DRAW);
            this.enableVertexAttribArray(ASGARD_CONSTS.ATTR_POSITION_LOC);
            this.vertexAttribPointer(ASGARD_CONSTS.ATTR_POSITION_LOC, rtn.vertexComponentLength, this.FLOAT, false, 0, 0);
        }
        if (aryNorm !== undefined && aryNorm != null) {
            rtn.bufNormals = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryNorm), this.STATIC_DRAW);
            this.enableVertexAttribArray(ASGARD_CONSTS.ATTR_NORMAL_LOC);
            this.vertexAttribPointer(ASGARD_CONSTS.ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
        }
        if (aryUV !== undefined && aryUV != null) {
            rtn.bufUV = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryUV), this.STATIC_DRAW);
            this.enableVertexAttribArray(ASGARD_CONSTS.ATTR_UV_LOC);
            this.vertexAttribPointer(ASGARD_CONSTS.ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);	//UV only has two floats per component
        }
        if (aryInd !== undefined && aryInd != null) {
            rtn.bufIndex = this.createBuffer();
            rtn.indexCount = aryInd.length;
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.STATIC_DRAW);
            // this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        }

        this.bindVertexArray(null);
        this.bindBuffer(this.ARRAY_BUFFER, null);
        this.mMeshCache[name] = rtn;
        return rtn;
    };

    gl.fSetSize = function (w, h) {
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;
        this.viewport(0, 0, w, h);
        return this;
    };

    gl.fFitScreen = function (wp, hp) {
        return this.fSetSize(window.innerWidth * (wp || 1),
            window.innerHeight * (hp || 1));
    };

    return gl;
}

export let Resources = {
    Textures: []
};