let Asgard = (function() {
    /* Refactor webgl2_fun */
    const DEG2RAD = Math.PI/180.0;

    let gl = null,
        CULLING_STATE = true,
        BLENDIG_STATE = false;

    function Init(canvasID) {
        if(Asgard.gl != null) return Asgard.gl;

        gl = GL.GLInstance(canvasID);
    }
});

import * as GL from './core/gl';