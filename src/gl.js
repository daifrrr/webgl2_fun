export default function GLInstance(canvasID) {
    let canvas = document.getElementById(canvasID);
    let gl = canvas.getContext("webgl2");
    if(!gl) {
        console.error('could not get gl context');
    }

    gl.clearColor(0.0,0.0, 0.0, 1.0);

    gl.fClear = function() {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    };

    gl.fCreateArrayBuffer = function(arrayVertices, isStatic) {
        if(isStatic === undefined) isStatic = true;

        let buf = gl.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buf);
        this.bufferData(this.ARRAY_BUFFER, arrayVertices, (isStatic) ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER,null);
        return buf;
    };

    gl.fSetSize = function(w, h) {
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;
        this.viewport(0,0,w,h);
        return this;
    };

    return gl;
}