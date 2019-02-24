#version 300 es
precision mediump float;

in highp vec2 vUV;
in highp vec3 posWorld;

uniform sampler2D uTex;

out vec4 outColor;

const vec3 posLight = vec3(0,5.0,0);
const vec3 lightColor = vec3(0.99,0.64,0.37);
const vec3 baseColor = vec3(0.0, 0.0, 0.0);

void main() {
    vec3 color = mix(texture(uTex, vUV).xyz, baseColor, 0.7) * .5;
    vec3 genNorm = normalize(cross(dFdx(posWorld), dFdy(posWorld)));
    float diffAngle = max( dot(genNorm, normalize(posLight-posWorld)), 0.0);
    outColor = vec4(color + lightColor * diffAngle, 1.0);
}