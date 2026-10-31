import { Avatar as Primitive } from '@base-ui/react/avatar';
import type { AvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar/avatar.js';
import {
  AVATAR_DEFAULTS,
  AVATAR_DIMENSIONS,
} from '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { avatarInitials } from '@fastsprout/reacd/adapter-runtime/core/avatar-text.js';

export function ShadcnAvatar({
  name,
  src,
  fallback,
  size = AVATAR_DEFAULTS.size,
}: AvatarProps) {
  const dimensions = AVATAR_DIMENSIONS[size];
  return (
    <Primitive.Root
      className="reacd-node reacd-avatar"
      data-slot="avatar"
      data-size={size}
      role="img"
      aria-label={name}
      title={name}
    >
      <Primitive.Fallback className="reacd-avatar-fallback" aria-hidden="true">
        {fallback ?? avatarInitials(name)}
      </Primitive.Fallback>
      {src !== undefined && (
        <Primitive.Image
          keepMounted
          src={src}
          alt=""
          className="reacd-avatar-image"
          width={dimensions.pixels}
          height={dimensions.pixels}
          referrerPolicy="no-referrer"
          decoding="async"
          loading="lazy"
        />
      )}
    </Primitive.Root>
  );
}
