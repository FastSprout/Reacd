import type { ComponentProps, ReactNode } from 'react';
import type {
  DefaultLegendContentProps,
  DefaultTooltipContentProps,
  LegendPayload,
  Tooltip,
  TooltipPayloadEntry,
  TooltipValueType,
} from 'recharts';

type Name = string | number;
type RawPayload = Record<string, unknown> & { fill?: string | undefined };
type TooltipEntry = Omit<
  TooltipPayloadEntry, 'dataKey' | 'nameKey' | 'payload' | 'formatter'
> & {
  dataKey?: Name | undefined;
  nameKey?: Name | undefined;
  payload?: RawPayload | undefined;
};
type ContentOptions = DefaultTooltipContentProps<TooltipValueType, Name>;
type Formatters = 'formatter' | 'labelFormatter';

export type ChartTooltipContentProps = Omit<
  ComponentProps<typeof Tooltip>, Formatters
> & ComponentProps<'div'> & Omit<
  ContentOptions, Formatters | 'accessibilityLayer' | 'payload'
> & {
  hideLabel?: boolean | undefined;
  hideIndicator?: boolean | undefined;
  indicator?: 'line' | 'dot' | 'dashed' | undefined;
  nameKey?: string | undefined;
  labelKey?: string | undefined;
  payload?: readonly TooltipEntry[] | undefined;
  formatter?: ((
    value: TooltipValueType,
    name: Name,
    item: TooltipEntry,
    index: number,
    rawPayload: RawPayload | undefined,
  ) => ReactNode) | undefined;
  labelFormatter?: ((
    label: ReactNode, payload: readonly TooltipEntry[],
  ) => ReactNode) | undefined;
};

export type ChartLegendContentProps = ComponentProps<'div'> & Omit<
  DefaultLegendContentProps, 'payload'
> & {
  hideIcon?: boolean | undefined;
  nameKey?: string | undefined;
  payload?: readonly (Omit<LegendPayload, 'dataKey'> & {
    dataKey?: Name | undefined;
  })[] | undefined;
};
