import {vec3, vec4, mat3, mat4} from "gl-matrix";
import {toRadian} from "gl-matrix/esm/common";

export default class Transform {

    constructor() {
        this.position = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.matView = mat4.create();
        this.matNormal = mat3.create();

        this.forward = vec4.create();
        this.up = vec4.create();
        this.right = vec4.create();
    }

    updateMatrix() {
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, this.position);
        console.log(matrix);
        mat4.fromXRotation(matrix, toRadian(this.rotation.x));
        mat4.fromYRotation(matrix, toRadian(this.rotation.y));
        mat4.fromZRotation(matrix, toRadian(this.rotation.z));
        mat4.scale(matrix, matrix, this.scale);

        mat3.normalFromMat4(this.matNormal, this.matView);

        vec4.transformMat4(this.forward, vec4.fromValues(0, 0, 1, 0), mat4.create());
        vec4.transformMat4(this.up, vec4.fromValues(0, 1, 1, 0), mat4.create());
        vec4.transformMat4(this.right, vec4.fromValues(1, 0, 0, 0), mat4.create());

        return matrix;
    }

    updateDirection() {
        vec4.transformMat4(this.forward, vec4.fromValues(0, 0, 1, 0), mat4.create());
        vec4.transformMat4(this.up, vec4.fromValues(0, 1, 1, 0), mat4.create());
        vec4.transformMat4(this.right, vec4.fromValues(1, 0, 0, 0), mat4.create());
        return this;
    }

    getViewMatrix() {
        return mat4.identity(this.matView);
    }

    getNormalMatrix() {
        return this.matNormal;
    }

    reset() {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
    }
}