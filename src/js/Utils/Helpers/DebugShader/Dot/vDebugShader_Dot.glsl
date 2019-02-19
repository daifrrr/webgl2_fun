#version 300 es
layout(location=0) in vec4 a_position;

uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uModelViewMatrix;
uniform vec3 uColorArray[6];
uniform vec3 uCameraPosition;
uniform float uPointSize;

out lowp vec4 color;

void main(void){
    vec4 pos = uModelViewMatrix * vec4(a_position.xyz, 1.0);
    color = vec4(uColorArray[ int(a_position.w) ],1.0);
    gl_PointSize = (1.0 - distance( uCameraPosition, pos.xyz ) / 10.0 ) * uPointSize;
    gl_Position = uProjectionMatrix * uCameraMatrix * pos;
}