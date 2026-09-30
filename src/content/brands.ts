import economicTimes from '../assets/brands/economic-times.svg?raw'
import iqoo from '../assets/brands/iqoo.svg?raw'
import meta from '../assets/brands/meta.svg?raw'
import pytorch from '../assets/brands/pytorch.svg?raw'

/**
 * Organisers' logos, shown beside the results won at their events. One-colour
 * SVGs (fill="currentColor") so they take the ink of wherever they sit.
 * Sources: Meta and PyTorch from Simple Icons (CC0); The Economic Times and
 * iQOO wordmarks from Wikimedia Commons. All are their owners' trademarks.
 */
export type BrandId = 'meta' | 'pytorch' | 'economic-times' | 'iqoo'

export interface Brand {
  readonly name: string
  readonly svg: string
}

export const brands: Record<BrandId, Brand> = {
  meta: { name: 'Meta', svg: meta },
  pytorch: { name: 'PyTorch', svg: pytorch },
  'economic-times': { name: 'The Economic Times', svg: economicTimes },
  iqoo: { name: 'iQOO', svg: iqoo },
}
