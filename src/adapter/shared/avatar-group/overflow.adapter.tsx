import type { AvatarGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar-group/index.js';
import { SharedAvatar } from '../avatar/avatar.adapter.js';

export function AvatarGroupOverflow({
  items,
  size,
}: {
  items: AvatarGroupProps['items'];
  size: AvatarGroupProps['size'];
}) {
  return (
    <details className="reacd-avatar-overflow">
      <summary>
        <span className="reacd-avatar-count" aria-hidden="true">
          +{items.length}
        </span>
        <span>
          Show {items.length} more {items.length === 1 ? 'person' : 'people'}
        </span>
      </summary>
      <ul className="reacd-avatar-hidden-list">
        {items.map((item) => (
          <li key={item.id} className="reacd-avatar-person">
            <SharedAvatar
              name={item.name}
              src={item.src}
              fallback={item.fallback}
              size={size}
            />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
