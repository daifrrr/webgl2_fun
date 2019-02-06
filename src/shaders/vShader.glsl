#version 300 es
in vec4 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uMVMatrix;

uniform vec3 uColor[6];
uniform float uTime;

out lowp vec4 color;
out highp vec2 texCoord;

void main() {
    texCoord = a_uv;
    color = vec4(uColor[ int(a_position.w)], 1.0);
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0);
}