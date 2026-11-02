import { Fragment } from 'react';
import { ChevronRight, Slash } from 'lucide-react';
import type { BreadcrumbProps } from
  '@fastsprout/reacd/adapter-runtime/components/breadcrumb/breadcrumb.props.js';
import { BREADCRUMB_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/breadcrumb-policy.js';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../vendor/ui/breadcrumb.js';
import { Button } from '../vendor/ui/button.js';
import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnBreadcrumbProps = BreadcrumbProps;
type Item = BreadcrumbProps['items'][number];

function Target({ item, current }: { readonly item: Item; readonly current: boolean }) {
  const field = useNativeField({ disabled: item.disabled });
  const active = current ? 'page' : undefined;
  if (item.href !== undefined)
    return (
      <BreadcrumbLink
        role="link"
        href={field.blocked ? undefined : item.href}
        aria-disabled={field.blocked}
        tabIndex={field.blocked ? -1 : undefined}
        aria-current={active}
        className="min-w-0 max-w-full whitespace-normal [overflow-wrap:anywhere]"
      >
        {item.label}
      </BreadcrumbLink>
    );
  const action = item.onPress;
  if (action !== undefined)
    return (
      <BreadcrumbLink asChild>
        <Button
          type="button"
          variant="link"
          disabled={field.blocked}
          aria-current={active}
          onClick={() => action()}
          className={
            'h-auto min-w-0 max-w-full p-0 whitespace-normal ' +
            '[overflow-wrap:anywhere]'
          }
        >
          {item.label}
        </Button>
      </BreadcrumbLink>
    );
  return (
    <BreadcrumbPage
      role={current ? 'link' : undefined}
      aria-current={active}
      aria-disabled={current ? true : undefined}
      className="min-w-0 max-w-full [overflow-wrap:anywhere]"
    >
      {item.label}
    </BreadcrumbPage>
  );
}

export function ShadcnBreadcrumb({
  label,
  items,
  separator = BREADCRUMB_DEFAULTS.separator,
}: BreadcrumbProps) {
  return (
    <Breadcrumb aria-label={label} className="min-w-0 max-w-full">
      <BreadcrumbList className="min-w-0 max-w-full">
        {items.map((item, index) => (
          <Fragment key={item.key}>
            {index > 0 && (
              <BreadcrumbSeparator>
                {separator === 'slash' ? (
                  <Slash />
                ) : (
                  <ChevronRight className="rtl:rotate-180" />
                )}
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem className="min-w-0 max-w-full">
              <Target item={item} current={index === items.length - 1} />
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
