/** Shader colours in sRGB 0–255. Keep in sync with the tokens in styles/tokens.css. */
export const palette = {
  bg: [11, 10, 9],
  ink: [236, 231, 222],
  accent: [236, 79, 45],
} as const satisfies Record<string, readonly [number, number, number]>
