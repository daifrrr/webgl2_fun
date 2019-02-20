#version 300 es
in vec4 a_postion;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

out highp vec2 vUV;

void main() {
    vUV = a_uv;
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_postion.xyz, 1.0);
}
