#version 300 es
precision mediump float;

in vec3 vPos;
in vec3 vNorm;
in highp vec2 vUV;
in vec3 vCamPos;

uniform sampler2D uMainTex;
uniform vec3 uLightPosition;

out vec4 outColor;


void main() {
    //vec4 colorBase = vec4(1.0, 1.0, 0.2, 1.0);
    vec4 colorBase = texture(uMainTex, vUV);
    vec3 colorLight = vec3(1.0, 1.0, 1.0);
    // ambient
    float ambientStrength = 0.5;
    vec3 colorAmbient = ambientStrength * colorLight;

    // diffuse
    vec3 lightDir = normalize(uLightPosition - vPos);
    float diffAngle = max( dot( vNorm, lightDir), 0.0);
    float diffStrength = 0.3;
    vec3 colorDiffuse = diffAngle * colorLight * diffStrength;

    //specular
    float specularStrength = 0.2;
    float specularShininess = 255.0;
    vec3 camDir = normalize(vCamPos - vPos);
    vec3 reflectDir = reflect(-lightDir, normalize(vNorm));

    float spec = pow(max(dot(reflectDir,camDir), 0.0), specularShininess);
    vec3 colorSpecular = specularStrength * spec * colorLight;

    vec3 finalColor = (colorAmbient + colorDiffuse + colorSpecular) * colorBase.rgb;
    outColor = vec4(finalColor, 1.0);
}