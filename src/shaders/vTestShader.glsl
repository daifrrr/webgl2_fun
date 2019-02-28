#version 300 es
in vec4 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;

out highp vec2 vUV;

void main() {
    mat4 p;
    p[0] = vec4(1.0, 0.0, 0.0, 0.0);
    p[1] = vec4(0.0, 1.0, 0.0, 0.0);
    p[2] = vec4(0.0, 0.0, 1.0, 0.0);
    p[3] = vec4(0.0, 0.0, -5.0, 1.0);

    gl_PointSize = 8.0;
    vUV = a_uv;
    mat4 tmp = uCameraMatrix;
    gl_Position = uPMatrix * p * uMVMatrix * vec4(a_position.xyz, 1.0);
}