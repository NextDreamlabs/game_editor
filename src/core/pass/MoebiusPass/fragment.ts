export default `
#include <packing>
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform float cameraNear;
uniform float cameraFar;
uniform vec2 resolution;
uniform float shadowType;

const mat3 Sx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 );
const mat3 Sy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 );

float hash(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  
  return fract((p3.x + p3.y) * p3.z);
}

float readDepth( sampler2D depthTexture, vec2 coord ) {
  float fragCoordZ = texture2D( depthTexture, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

float luma(vec3 color) {
  const vec3 magic = vec3(0.2125, 0.7154, 0.0721);
  return dot(magic, color);
}

void main() {
  vec2 uv = vUv;
  vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

  float outlineThickness = 1.5;
  vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec2 displacement = vec2(
    (hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * 0.35)) ,
    (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * 0.35))
  ) * 2.8 /resolution.xy;

  float depth = readDepth(tDepth, vUv);
  vec4 normal = texture2D(tNormal, vUv);
  vec4 pixelColor = texture2D(tDiffuse, vUv);

  float depth00 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 1));
  float depth01 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 0));
  float depth02 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, -1));

  float depth10 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, -1));
  float depth11 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 0));
  float depth12 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 1));

  float depth20 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, -1));
  float depth21 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 0));
  float depth22 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 1));

  float xSobelValueDepth = 
    Sx[0][0] * depth00 + Sx[1][0] * depth01 + Sx[2][0] * depth02 +
    Sx[0][1] * depth10 + Sx[1][1] * depth11 + Sx[2][1] * depth12 +
    Sx[0][2] * depth20 + Sx[1][2] * depth21 + Sx[2][2] * depth22;

  float ySobelValueDepth = 
    Sy[0][0] * depth00 + Sy[1][0] * depth01 + Sy[2][0] * depth02 +
    Sy[0][1] * depth10 + Sy[1][1] * depth11 + Sy[2][1] * depth12 +
    Sy[0][2] * depth20 + Sy[1][2] * depth21 + Sy[2][2] * depth22;

  float gradientDepth = sqrt(pow(xSobelValueDepth, 2.0) + pow(ySobelValueDepth, 2.0));

  float normal00 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, -1)).rgb);
  float normal01 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 0)).rgb);
  float normal02 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 1)).rgb);

  float normal10 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, -1)).rgb);
  float normal11 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 0)).rgb);
  float normal12 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 1)).rgb);

  float normal20 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, -1)).rgb);
  float normal21 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 0)).rgb);
  float normal22 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 1)).rgb);

  float xSobelNormal = 
    Sx[0][0] * normal00 + Sx[1][0] * normal10 + Sx[2][0] * normal20 +
	Sx[0][1] * normal01 + Sx[1][1] * normal11 + Sx[2][1] * normal21 +
	Sx[0][2] * normal02 + Sx[1][2] * normal12 + Sx[2][2] * normal22;

  float ySobelNormal = 
    Sy[0][0] * normal00 + Sy[1][0] * normal10 + Sy[2][0] * normal20 +
    Sy[0][1] * normal01 + Sy[1][1] * normal11 + Sy[2][1] * normal21 +
    Sy[0][2] * normal02 + Sy[1][2] * normal12 + Sy[2][2] * normal22;

  float gradientNormal = sqrt(pow(xSobelNormal, 2.0) + pow(ySobelNormal, 2.0));

  float outline = gradientDepth * 25.0 + gradientNormal;

  float diffuseLight = normal.a;
  float pixelLuma = luma(pixelColor.rgb + diffuseLight * 0.65);

  if (shadowType == 1.0) {
    if(pixelLuma <= 0.35 && depth <= 0.99) {
      pixelColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

    if (pixelLuma <= 0.45 && depth <= 0.99) {
      pixelColor = pixelColor * vec4(0.25, 0.25, 0.25, 1.0);
    }

    if (pixelLuma <= 0.6 && depth <= 0.99) {
      pixelColor = pixelColor * vec4(0.5, 0.5, 0.5, 1.0);
    }

    if (pixelLuma <= 0.75 && depth <= 0.99) {
      pixelColor = pixelColor * vec4(0.7, 0.7, 0.7, 1.0);
    }
  }

  if(shadowType == 2.0) {
    const float rasterSize = 6.0;
    float raster = length(mod(vUv * resolution.xy, vec2(rasterSize)) / rasterSize - vec2(0.5));

    if(pixelLuma <= raster * 1.25 && depth <= 0.99) {
      pixelColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }

  float modVal = 11.0;

  if(shadowType == 3.0) {
    if (pixelLuma <= 0.35 && depth <= 0.99) {
      if (mod((vUv.y + displacement.y) * resolution.y , modVal)  < outlineThickness) {
        pixelColor = outlineColor;
      };
    }
    if (pixelLuma <= 0.55 && depth <= 0.99) {
      if (mod((vUv.x + displacement.x) * resolution.x , modVal)  < outlineThickness) {
        pixelColor = outlineColor;
      };

    }
    if (pixelLuma <= 0.75 && depth <= 0.99) {
      if (mod((vUv.x + displacement.x) * resolution.y + (vUv.y + displacement.y) * resolution.x, modVal) <= outlineThickness) {
        pixelColor = outlineColor;
      };
    }
  }

  if(normal.r >= 1.0 && normal.g >= 1.0 && normal.b >= 1.0) {
    pixelColor = vec4(1.0, 1.0, 1.0, 1.0);
  }

  vec4 color = mix(pixelColor, outlineColor, outline);

  gl_FragColor = color;
}
`