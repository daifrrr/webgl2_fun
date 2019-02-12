#version 300 es

in vec4 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uNormMatrix;

uniform vec3 uColor[6];
uniform float uTime;

out highp vec2 texCoord;
out vec3 light;

void main() {
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position.xyz, 1.0);

    texCoord = a_uv;

    vec3 ambientLight = vec3(0.25, 0.25, 0.25);
    vec3 directionalLightColor = vec3(0.2, 0.2, 0.2);
    float tmp = a_position.y;
    vec3 directionalVector = vec3(5.0 * cos(0.002 * uTime), 2,5.0 * sin(0.002 * uTime));

    vec4 transformedNormal = uNormMatrix * vec4(a_norm, 1.0);

    float directional = max(dot(transformedNormal.xyz, directionalVector), a_position.y);
    light = ambientLight + (directionalLightColor * directional);
}