import type { ScrollAreaProps } from
  '@fastsprout/reacd/adapter-runtime/components/scroll-area/scroll-area.props.js';
import {
  SCROLL_AREA_DEFAULTS,
  SCROLL_AREA_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/scroll-area-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { ScrollArea, ScrollBar } from '../vendor/ui/scroll-area.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnScrollAreaProps = ScrollAreaProps;
export function ShadcnScrollArea({
  label,
  children,
  orientation = SCROLL_AREA_DEFAULTS.orientation,
  extent = SCROLL_AREA_DEFAULTS.extent,
}: ScrollAreaProps) {
  const horizontal = orientation === 'horizontal';
  return (
    <ScrollArea
      className="min-w-0 max-w-full"
      style={{ blockSize: `${SCROLL_AREA_POLICY.extentRem[extent]}rem` }}
      viewportProps={{ role: 'region', 'aria-label': label, tabIndex: 0 }}
    >
      <CardContent
        className={
          horizontal
            ? 'reacd-scroll-track-horizontal flex w-max p-0'
            : 'grid min-w-0 p-0'
        }
        style={{
          gap: 'var(--space-medium)',
          overflowWrap: 'anywhere',
          ...(horizontal
            ? { '--scroll-track': `${LAYOUT_POLICY.stackTrackRem}rem` }
            : {}),
        }}
      >
        {children}
      </CardContent>
      {horizontal && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
}
