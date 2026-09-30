import { brands, type BrandId } from '../content/brands'

interface BrandMarksProps {
  readonly ids: readonly BrandId[]
  readonly className?: string
}

/** The organisers' logos in a row. Decorative: the event is always named in text beside them. */
export function BrandMarks({ ids, className }: BrandMarksProps) {
  if (ids.length === 0) return null
  return (
    <span className={className ? `brands ${className}` : 'brands'} aria-hidden="true">
      {ids.map((id) => (
        // Our own SVG files from src/assets, bundled at build time; nothing user-supplied reaches this.
        <span key={id} className={`brand brand--${id}`} dangerouslySetInnerHTML={{ __html: brands[id].svg }} />
      ))}
    </span>
  )
}
