import type { CalendarNodeDeclaration } from '../../schema/calendar/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundCalendarSingle } from './bound-calendar-single.js';
import { BoundCalendarRange } from './bound-calendar-range.js';

export function BoundCalendar({
  node,
  registry,
}: {
  node: CalendarNodeDeclaration;
  registry: StateRegistry;
}) {
  return node.mode === 'range' ? (
    <BoundCalendarRange node={node} registry={registry} />
  ) : (
    <BoundCalendarSingle node={node} registry={registry} />
  );
}
