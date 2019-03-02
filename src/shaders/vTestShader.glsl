#version 300 es
in vec4 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform MatTransform {
    mat4 matProjection;
    mat4 matCameraView;
};

//uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;
uniform vec3 uColorArray[6];
uniform float uTime;

out highp vec2 vUV;
out lowp vec4 color;
out float time;

void main() {
    time = uTime;
    gl_PointSize = 8.0;
    vUV = a_uv;
    color = vec4(uColorArray[int(a_position.w)], 1.0);
    gl_Position = matProjection * matCameraView * uMVMatrix * vec4(a_position.xyz, 1.0);
}