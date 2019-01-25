#version 300 es
precision mediump float;

uniform float uPointSize;

out vec4 outColor;


void main() {
    float c = (40.0 - uPointSize) / 20.0;
    outColor = vec4(c, c, c, 1.0);
}
