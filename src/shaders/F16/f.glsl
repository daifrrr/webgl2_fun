#version 300 es
precision mediump float;

in vec4 color;

in highp vec2 texCoord;
uniform sampler2D uMainTex;

out vec4 finalColor;

void main() {
    finalColor = texture(uMainTex, texCoord);
}