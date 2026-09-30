import { RING_COUNT, RING_GROWTH } from './formation'

/** GLSL needs a decimal point on float literals; keep full precision so CPU and GPU agree. */
const glslFloat = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n))

export const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/**
 * Full-screen ray cast onto the ground plane. Rings are drawn as distance
 * fields so every line stays a constant on-screen width at any zoom or tilt.
 * Camera maths mirrors cameraBasis/projectPlanePoint in formation.ts.
 */
export const fragmentShader = /* glsl */ `
  precision highp float;

  #define RINGS ${RING_COUNT}
  const float TAU = 6.28318530718;
  const float GROWTH = ${glslFloat(RING_GROWTH)};

  uniform vec2 uResolution;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uStage;
  uniform float uPitch;
  uniform float uYaw;
  uniform float uDistance;
  uniform float uFocal;
  uniform float uWorldZoom;
  uniform float uActive;
  uniform float uDustDensity;
  uniform vec3 uBg;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uRadius[RINGS];
  uniform float uDir[RINGS];
  uniform float uSpeed[RINGS];
  uniform float uGap[RINGS];
  uniform float uTicks[RINGS];

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  // One layer of dust on the plane; density is in cells per plane unit.
  float dust(vec2 p, float density, float fw, float seed) {
    vec2 cell = floor(p * density);
    vec2 local = fract(p * density);
    vec2 rnd = hash22(cell + seed);
    float present = step(0.62, hash12(cell * 1.7 + seed));
    float distPx = length(local - (0.2 + 0.6 * rnd)) / (fw * density);
    float dotShape = 1.0 - smoothstep(0.5 * uPixelRatio, 1.3 * uPixelRatio, distPx);
    float twinkle = 0.55 + 0.45 * sin(uTime * 0.7 + rnd.x * TAU);
    return present * dotShape * twinkle;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5 * uResolution) / (0.5 * uResolution.y);

    float s = sin(uPitch);
    float c = cos(uPitch);
    vec3 camPos = vec3(0.0, -uDistance * s, uDistance * c);
    vec3 fwd = vec3(0.0, s, -c);
    vec3 up = vec3(0.0, c, s);
    vec3 dir = normalize(fwd * uFocal + vec3(uv.x, 0.0, 0.0) + up * uv.y);

    vec3 col = uBg + uInk * 0.02 * (1.0 - smoothstep(0.0, 1.5, length(uv)));

    if (dir.z < -1e-4) {
      float t = -camPos.z / dir.z;
      vec2 world = (camPos + dir * t).xy;
      float zoom = uWorldZoom * pow(GROWTH, uStage);
      vec2 w = world / zoom;
      float cy = cos(uYaw);
      float sy = sin(uYaw);
      vec2 p = vec2(w.x * cy + w.y * sy, -w.x * sy + w.y * cy);

      float d = length(p);
      float fw = max(fwidth(d), 1e-7);
      float turns = atan(p.y, p.x) / TAU;
      float fog = exp(-max(t - uDistance, 0.0) * 0.16);

      // Dust: two zoom layers cross-fade so density stays even while diving in.
      float level = floor(uStage);
      float blend = uStage - level;
      float baseDensity = uDustDensity;
      float dustA = dust(p, baseDensity * pow(GROWTH, level), fw, 11.0 + level);
      float dustB = dust(p, baseDensity * pow(GROWTH, level + 1.0), fw, 12.0 + level);
      // Grazing rays near the horizon smear cells into streaks; fade dust there.
      float grazing = smoothstep(0.3, 0.65, -dir.z);
      col += uInk * (dustA * (1.0 - blend) + dustB * blend) * 0.32 * fog * grazing;

      // Faint glow at the centre of the formation.
      float glow = exp(-pow(d / (uRadius[0] * 1.1), 2.0));
      col += uAccent * glow * 0.22 * fog;

      float frameR = 1.0;
      for (int i = 0; i < RINGS; i++) {
        float r = uRadius[i];
        float isActive = 1.0 - step(0.5, abs(float(i + 1) - uActive));
        float halfWidth = mix(0.55, 0.95, isActive) * uPixelRatio;
        float line = 1.0 - smoothstep(halfWidth - 0.6, halfWidth + 0.6, abs(d - r) / fw);

        float rot = uDir[i] * uSpeed[i] * (uStage * 0.22 + uTime * 0.01);
        float u = fract(turns - rot + 2.0);
        float gapDist = abs(u - uGap[i]);
        gapDist = min(gapDist, 1.0 - gapDist);
        float turnPerPx = fw / (TAU * max(r, 1e-5));
        float gap = smoothstep(0.04, 0.04 + turnPerPx * 1.5, gapDist);

        float tick = 0.0;
        if (uTicks[i] > 0.5) {
          float tu = fract(u * uTicks[i]);
          float tickPx = min(tu, 1.0 - tu) / (uTicks[i] * turnPerPx);
          float outPx = (d - r) / fw;
          float len = 5.0 * uPixelRatio;
          tick = (1.0 - smoothstep(0.45 * uPixelRatio, 0.45 * uPixelRatio + 0.9, tickPx))
               * smoothstep(-0.5, 0.5, outPx)
               * (1.0 - smoothstep(len - 0.8, len + 0.8, outPx))
               * 0.6;
        }

        // Rings that have swept past the camera fade out; deep rings sit back.
        float scaled = r * pow(GROWTH, uStage);
        float passed = 1.0 - smoothstep(frameR * 1.2, frameR * 2.3, scaled);
        float depth = mix(0.35, 1.0, smoothstep(frameR * 0.1, frameR * 0.7, scaled));
        float alpha = max(line, tick) * gap * passed * depth * mix(0.55, 1.0, isActive) * fog;
        col = mix(col, mix(uInk, uAccent, isActive), alpha);
      }
    }

    float vignette = smoothstep(0.55, 1.7, length(uv * vec2(0.8, 1.0)));
    col *= 1.0 - 0.3 * vignette;
    col += (hash12(frag + fract(uTime * 0.37) * 311.0) - 0.5) * 0.022;

    gl_FragColor = vec4(col, 1.0);
  }
`
