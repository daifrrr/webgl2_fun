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

vec3 warp(vec3 p){
			//return p + 0.2 * abs(cos(uTime*0.002)) * a_norm;
			//return p + 0.5 * abs(cos(uTime*0.003 + p.y)) * a_norm;
			return p + 0.5 * abs(cos(uTime*0.01 + p.x + p.y + p.z)) * a_norm;
		}


void main() {
    texCoord = a_uv;
    color = vec4(uColor[ int(a_position.w)], 1.0);
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(warp(a_position.xyz), 1.0);
}