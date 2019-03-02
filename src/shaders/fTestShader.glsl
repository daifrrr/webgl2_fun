#version 300 es
precision mediump float;

in highp vec2 vUV;
in lowp vec4 color;
in float time;

uniform sampler2D mainTexture;

out vec4 outColor;

void main() {
    vec4 p = texture(mainTexture, vUV);
    outColor = mix(color, p, 0.5);
}