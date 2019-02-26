import cfg from '../config/config';

export default function GLInstance(canvasID) {
    let canvas = document.getElementById(canvasID);
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error('could not get gl context');
    }

    gl.mMeshCache = [];
    gl.mTextureCache = [];

    gl.cullFace(gl.BACK);                               //Default
    gl.frontFace(gl.CCW);                               //Default
    gl.enable(gl.DEPTH_TEST);                           //Fragment px near override far
    gl.enable(gl.CULL_FACE);                            //Clockwise triangles ???
    gl.depthFunc(gl.LEQUAL);                            //Near obscure Far
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //Setup Default Alpha Blending


    gl.clearColor(0.75, 0.75, 0.75,1.0);

    gl.fClear = function () {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    };

    gl.fCreateArrayBuffer = function (arrayVertices, isStatic) {
        if (isStatic === undefined) isStatic = true;

        let buf = gl.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buf);
        this.bufferData(this.ARRAY_BUFFER, arrayVertices, (isStatic) ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER, null);
        return buf;
    };

    gl.fCreateMeshVAO = function (name, aryInd, aryVert, aryNorm, aryUV, vertLength) {
        let rtn = {drawMode: this.TRIANGLES};

        //Create and bind vao
        rtn.vao = this.createVertexArray();
        this.bindVertexArray(rtn.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

        //.......................................................
        //Set up vertices
        if (aryVert !== undefined && aryVert != null) {
            rtn.bufVertices = this.createBuffer();													//Create buffer...
            rtn.vertexComponentLength = vertLength || 3;																//How many floats make up a vertex
            rtn.vertexCount = aryVert.length / rtn.vertexComponentLength;								//How many vertices in the array

            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryVert), this.STATIC_DRAW);		//then push array into it.
            this.enableVertexAttribArray(cfg.ATTR_POSITION_LOC);										//Enable Attribute location
            this.vertexAttribPointer(cfg.ATTR_POSITION_LOC, rtn.vertexComponentLength, this.FLOAT, false, 0, 0);						//Put buffer at location of the vao
        }

        //.......................................................
        //Setup normals
        if (aryNorm !== undefined && aryNorm != null) {
            rtn.bufNormals = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryNorm), this.STATIC_DRAW);
            this.enableVertexAttribArray(cfg.ATTR_NORMAL_LOC);
            this.vertexAttribPointer(cfg.ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
        }

        //.......................................................
        //Setup UV
        if (aryUV !== undefined && aryUV != null) {
            rtn.bufUV = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryUV), this.STATIC_DRAW);
            this.enableVertexAttribArray(cfg.ATTR_UV_LOC);
            this.vertexAttribPointer(cfg.ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);	//UV only has two floats per component
        }

        //.......................................................
        //Setup Index.
        if (aryInd !== undefined && aryInd != null) {
            rtn.bufIndex = this.createBuffer();
            rtn.indexCount = aryInd.length;
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.STATIC_DRAW);
            // this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        }

        //Clean up
        this.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
        this.bindBuffer(this.ARRAY_BUFFER, null);	//Unbind any buffers that might be set
        //if (aryInd != null) this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        this.mMeshCache[name] = rtn;
        return rtn;
    };

    gl.fLoadTexture = function (name, img, doYFlip = false) {
        let tex = this.createTexture();
        if (doYFlip) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
        this.bindTexture(this.TEXTURE_2D, tex);
        this.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);


        // this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // this.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
        this.generateMipmap(this.TEXTURE_2D);

        //this.bindTexture(this.TEXTURE_2D,null);
        this.mTextureCache[name] = tex;

        if (doYFlip) this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);

        return tex;
    };

    gl.fLoadCubeTexture = function(name, aImg) {
        if(aImg.length !== 6) {
            console.error('Cube map must have an image array of 6: ' + aImg + ' given');
            return null;
        }

        let tex = this.createTexture();
        this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

        for(let i = 0; i < 6; i++) {
            this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, aImg[i]);
        }

        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE);

        this.bindTexture(this.TEXTURE_CUBE_MAP, null);
        this.mTextureCache[name] = tex;
        return tex;
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