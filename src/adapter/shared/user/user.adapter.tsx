import { useId } from 'react';
import type { UserProps } from
  '@fastsprout/reacd/adapter-runtime/components/user/user.js';
import { USER_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/user-policy.js';
import { SharedAvatar } from '../avatar/avatar.adapter.js';
import { Button } from '../primitives/button.js';

export function SharedUser({
  name,
  description,
  avatar,
  size = USER_DEFAULTS.size,
  orientation = USER_DEFAULTS.orientation,
  href,
  onPress,
  disabled,
}: UserProps) {
  const descriptionId = useId();
  const properties = {
    className: 'reacd-node reacd-user',
    'data-slot': 'user',
    'data-size': size,
    'data-orientation': orientation,
  };
  const content = (
    <>
      {avatar !== undefined && <SharedAvatar {...avatar} name={name} size={size} />}
      <span className="reacd-user-identity">
        <span className="reacd-user-name">{name}</span>
        {description !== undefined && (
          <span className="reacd-user-description" id={descriptionId}>
            {description}
          </span>
        )}
      </span>
    </>
  );
  const identity = {
    'aria-label': name,
    'aria-describedby': description === undefined ? undefined : descriptionId,
  };
  if (href !== undefined)
    return (
      <a {...properties} {...identity} href={href}>
        {content}
      </a>
    );
  if (onPress !== undefined)
    return (
      <Button
        {...properties}
        {...identity}
        variant="ghost"
        type="button"
        onClick={() => onPress()}
        disabled={disabled}
      >
        {content}
      </Button>
    );
  return <div {...properties}>{content}</div>;
}
