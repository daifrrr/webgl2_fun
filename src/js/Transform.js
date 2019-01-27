import {vec3, mat3, mat4} from "gl-matrix";
import {toRadian} from "gl-matrix/esm/common";
import {normalFromMat4} from "gl-matrix/esm/mat3";

class Transform {

    constructor() {
        this.position = vec3.fromValues(0,0,0);
        this.scale = vec3.fromValues(1,1,1);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.matView = mat4.create();
        this.matNormal = mat3.create();

        this.forward = new Float32Array(4);
        this.up = new Float32Array(4);
        this.right = new Float32Array(4);
    }

    updateMatrix() {
        let matrix = this.matView().reset();
            matrix.fromTranslation(matrix, this.position);
            matrix.fromXRotation(matrix, toRadian(this.rotation.x));
            matrix.rotateY(this.rotation.y);
            matrix.rotateZ(this.rotation.z);
            matrix.scale(this.scale);

        normalFromMat4(this.matNormal, this.matView);
    }
}