#version 300 es
precision mediump float;

in vec2 uv;

out vec4 finalColor;


void main() {
    float c = (uv.x <= 0.1 || uv.x >=0.9 || uv.y <= 0.1 || uv.y >= 0.9)? 0.0 : 1.0;
    finalColor = vec4(c, c, c, 1.0-c);
}
