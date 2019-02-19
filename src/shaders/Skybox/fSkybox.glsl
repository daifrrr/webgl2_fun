#version 300 es
precision mediump float;

in highp vec3 texCoord;
uniform samplerCube uSkyTex;
uniform float uTime;

out vec4 finalColor;

void main() {
    finalColor = texture(uSkyTex, texCoord);
}
