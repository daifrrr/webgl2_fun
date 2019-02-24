#version 300 es
layout(location=0) in vec4 a_position;

uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uModelViewMatrix;
uniform vec3 uColorArray[6];

out lowp vec4 color;
void main(void){
    color = vec4(uColorArray[ int(a_position.w) ],1.0);
    gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * vec4(a_position.xyz, 1.0);
}