#version 300 es
precision mediump float;

in vec4 color;
in vec3 norm;
in vec3 light;

in highp vec2 texCoord;
uniform sampler2D uMainTex;

out vec4 finalColor;

void main() {
    vec4 texelColor = texture(uMainTex, texCoord);
    finalColor = vec4(texelColor.rgb * light, 1.0);
}

/*

    vec2 vTextureCoord;
    vec3 vLighting;

          uniform sampler2D uSampler;

          void main(void) {
            vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

            gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
          }

*/