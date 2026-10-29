import { ScrollArea as Primitive } from '@base-ui/react/scroll-area';
import type { ScrollAreaProps } from '../../../components/scroll-area/index.js';
import {
  SCROLL_AREA_DEFAULTS,
  SCROLL_AREA_POLICY,
} from '../../../core/scroll-area-policy.js';

export function ShadcnScrollArea({
  label,
  children,
  orientation = SCROLL_AREA_DEFAULTS.orientation,
  extent = SCROLL_AREA_DEFAULTS.extent,
}: ScrollAreaProps) {
  return (
    <Primitive.Root
      className="reacd-node reacd-scroll-area"
      data-slot="scroll-area"
      data-orientation={orientation}
      data-extent={extent}
    >
      <Primitive.Viewport
        className="reacd-scroll-area-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        style={{ maxBlockSize: `${SCROLL_AREA_POLICY.extentRem[extent]}rem` }}
      >
        <Primitive.Content className="reacd-scroll-area-content">
          {children}
        </Primitive.Content>
      </Primitive.Viewport>
      <Primitive.Scrollbar
        className="reacd-scroll-area-scrollbar"
        orientation={orientation}
      >
        <Primitive.Thumb className="reacd-scroll-area-thumb" />
      </Primitive.Scrollbar>
    </Primitive.Root>
  );
}
