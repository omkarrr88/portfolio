import { PageHead } from '../components/PageHead'
import { Link, useRouter } from '../router/Router'
import { SECTIONS } from '../router/routes'

/** An address that doesn't exist: say so plainly and offer the ways in. */
export function NotFound({ ring }: { readonly ring: number }) {
  const { path } = useRouter()
  return (
    <section className="overview" aria-labelledby="missing-title">
      <PageHead
        ring={ring}
        crumbs={[{ label: 'Nothing here', href: path }]}
        titleId="missing-title"
        title="There’s nothing on this ring."
        lede="The link may be old or mistyped. Everything on the site is one of these:"
      />
      <ul className="missing-links" data-stagger>
        <li>
          <Link to="/" className="text-link">
            Home
          </Link>
        </li>
        {SECTIONS.map((s) => (
          <li key={s.key}>
            <Link to={s.href} className="text-link">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
