#version 300 es
precision mediump float;

uniform sampler2D uMask_A;
uniform sampler2D uMask_B;
uniform vec3[2] uColors;

in highp vec2 vUV;
out vec4 outColor;

void main() {
    vec4 mask_a = texture(uMask_A,vUV*4.0) * 0.15;
    vec4 mask_b = texture(uMask_B,vUV*2.0);
    float c = min(mask_a.r + mask_b.r, 1.0);
    outColor = vec4( mix(uColors[0],uColors[1], c), 1.0);
}