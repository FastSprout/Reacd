import type { HeaderProps } from
  '@fastsprout/reacd/adapter-runtime/components/header/header.js';
import { SharedHeaderMenu } from './header-menu.js';

export function SharedHeader({
  title,
  href,
  children,
  start,
  end,
  top,
  bottom,
  menu,
}: HeaderProps) {
  return (
    <header className="reacd-node reacd-header">
      {top !== undefined && <div className="reacd-shell-band">{top}</div>}
      <div className="reacd-container reacd-shell-row">
        <div className="reacd-shell-start">
          {href === undefined ? (
            <span className="reacd-shell-title">{title}</span>
          ) : (
            <a className="reacd-shell-title" href={href}>
              {title}
            </a>
          )}
          {start}
        </div>
        <div className="reacd-shell-center">{children}</div>
        <div className="reacd-shell-end">
          {end}
          {menu !== undefined && <SharedHeaderMenu title={title} menu={menu} />}
        </div>
      </div>
      {bottom !== undefined && <div className="reacd-shell-band">{bottom}</div>}
    </header>
  );
}
