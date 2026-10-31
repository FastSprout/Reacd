import type { AvatarGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar-group/index.js';
import { AVATAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';
import { AvatarGroupOverflow } from './overflow.adapter.js';

export function ShadcnAvatarGroup({
  label,
  items,
  max = AVATAR_DEFAULTS.max,
  size = AVATAR_DEFAULTS.size,
  emptyMessage = AVATAR_DEFAULTS.emptyMessage,
}: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const hidden = items.slice(max);
  return (
    <div
      className="reacd-node reacd-avatar-group"
      data-slot="avatar-group"
      data-size={size}
      role="group"
      aria-label={label}
    >
      <p className="reacd-avatar-group-label">{label}</p>
      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <>
          <ul className="reacd-avatar-visible-list">
            {visible.map((item) => (
              <li key={item.id}>
                <ShadcnAvatar
                  name={item.name}
                  src={item.src}
                  fallback={item.fallback}
                  size={size}
                />
              </li>
            ))}
          </ul>
          {hidden.length > 0 && <AvatarGroupOverflow items={hidden} size={size} />}
        </>
      )}
    </div>
  );
}
