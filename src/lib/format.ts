/** Two-digit ring and item numbers: 7 → "07". */
export const pad = (n: number): string => String(n).padStart(2, '0')

/** "Ring 05" for the rings, "Centre" for the middle. */
export const ringName = (ring: number): string => (ring === 0 ? 'Centre' : `Ring ${pad(ring)}`)
