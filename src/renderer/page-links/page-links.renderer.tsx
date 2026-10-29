import { useId } from 'react';
import type { ReactNode } from 'react';
import type { PageLinksProps } from '../../components/page-links/page-links.props.js';
import { PAGE_LINK_DEFAULTS } from '../../core/page-navigation-policy.js';
import { PageHeading } from '../page-introduction/page-heading.js';

export function PageLinksSurface({
  label,
  title,
  activeKey,
  links = PAGE_LINK_DEFAULTS.links,
  kind,
}: PageLinksProps & { kind: 'links' | 'anchors' }): ReactNode {
  const id = useId();
  return (
    <nav className="reacd-node reacd-page-links" aria-label={label} data-kind={kind}>
      <PageHeading id={id} title={title} />
      <ul className="reacd-page-links-list">
        {links.map((item) => {
          const newWindow = item.newWindow ?? PAGE_LINK_DEFAULTS.newWindow;
          return (
            <li key={item.key}>
              <a
                className="reacd-node reacd-link reacd-page-link"
                href={item.href}
                aria-current={item.key === activeKey ? 'location' : undefined}
                target={newWindow ? '_blank' : undefined}
                rel={newWindow ? 'noopener noreferrer' : undefined}
              >
                {item.leading}
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
