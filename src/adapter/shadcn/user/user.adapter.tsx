import { useId } from 'react';
import type { UserProps } from
  '@fastsprout/reacd/adapter-runtime/components/user/user.props.js';
import { USER_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/user-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldContent, FieldDescription, FieldTitle } from '../vendor/ui/field.js';
import { Button } from '../vendor/ui/button.js';
import { BreadcrumbLink } from '../vendor/ui/breadcrumb.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnUserProps = UserProps;

export function ShadcnUser({
  name,
  description,
  avatar,
  href,
  onPress,
  disabled,
  size = USER_DEFAULTS.size,
  orientation = USER_DEFAULTS.orientation,
}: UserProps) {
  const id = useId();
  const field = useNativeField({ disabled });
  const content = (
    <>
      {avatar && <ShadcnAvatar name={name} size={size} {...avatar} />}
      <FieldContent className="min-w-0 max-w-full [overflow-wrap:anywhere]">
        <FieldTitle>{name}</FieldTitle>
        {description !== undefined && (
          <FieldDescription id={id}>{description}</FieldDescription>
        )}
      </FieldContent>
    </>
  );
  const classes =
    'flex h-auto min-w-0 max-w-full gap-3 whitespace-normal ' +
    (orientation === 'vertical' ? 'flex-col' : 'flex-row');
  const describedBy = description === undefined ? undefined : id;
  if (onPress !== undefined)
    return (
      <Button
        type="button"
        variant="ghost"
        className={classes}
        aria-label={name}
        aria-describedby={describedBy}
        disabled={field.blocked}
        onClick={() => onPress()}
      >
        {content}
      </Button>
    );
  if (href !== undefined)
    return (
      <Button asChild variant="link" className={classes}>
        <BreadcrumbLink href={href} aria-label={name} aria-describedby={describedBy}>
          {content}
        </BreadcrumbLink>
      </Button>
    );
  return <CardContent className={`${classes} p-0`}>{content}</CardContent>;
}
