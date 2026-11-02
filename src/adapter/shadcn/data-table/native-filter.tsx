import { useId } from 'react';
import { useDirection } from '@radix-ui/react-direction';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { FILTER_OPERATORS } from
  '@fastsprout/reacd/adapter-runtime/core/state-policy.js';
import { dataTableColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/columns.schema.js';
import { filtersValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/state/filters/filters.schema.js';
import { Input } from '../vendor/ui/input.js';
import { Label } from '../vendor/ui/label.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../vendor/ui/select.js';
import { CardContent, CardDescription } from '../vendor/ui/card.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { useNativePopup } from '../surface/use-native-popup.js';
import type { NativeTable } from './sdk-table.js';

const operatorLabels = {
  equals: 'Equals',
  contains: 'Contains',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
} as const;
interface Properties {
  readonly column: ReturnType<NativeTable['getAllLeafColumns']>[number];
  readonly disabled: boolean;
}
export function NativeFilter({ column, disabled }: Properties) {
  const id = useId();
  const theme = useShadcnTheme();
  const direction = useDirection();
  const choice = useNativePopup(!disabled);
  const operators = useNativePopup(!disabled);
  const definition = dataTableColumnsSchema
    .unwrap()
    .element.parse(column.columnDef.meta);
  const current = column.getFilterValue();
  const rules = current === undefined ? [] : filtersValueSchema.parse(current);
  const first = rules[0];
  const value = first?.value;
  const remaining = rules.slice(1);
  const update = (next: string | boolean | number | undefined) =>
    column.setFilterValue(
      next === undefined
        ? remaining.length > 0
          ? remaining
          : undefined
        : [
            {
              column: definition.key,
              operator:
                first?.operator ?? (definition.kind === 'text' ? 'contains' : 'equals'),
              value: next,
            },
            ...remaining,
          ],
    );
  return (
    <CardContent
      className="grid min-w-0 flex-1 gap-2 p-0"
      style={{ flexBasis: `${LAYOUT_POLICY.stackTrackRem}rem` }}
    >
      <Label htmlFor={id}>{`Filter ${definition.label}`}</Label>
      {definition.kind === 'boolean' ? (
        <Select
          disabled={disabled}
          open={choice.open}
          onOpenChange={choice.onOpenChange}
          value={value === undefined ? DATA_TABLE_POLICY.allFilterValue : String(value)}
          onValueChange={(next) =>
            update(
              next === DATA_TABLE_POLICY.allFilterValue ? undefined : next === 'true',
            )
          }
        >
          <SelectTrigger id={id}>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent
            aria-label={`Filter ${definition.label}`}
            container={choice.host}
            style={theme}
            dir={direction}
            className="motion-reduce:animate-none"
          >
            <SelectItem value={DATA_TABLE_POLICY.allFilterValue}>All</SelectItem>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          disabled={disabled}
          type={definition.kind === 'number' ? 'number' : 'text'}
          value={value == null ? '' : String(value)}
          onChange={(event) => {
            const next = event.target.value;
            update(
              next === ''
                ? undefined
                : definition.kind === 'number'
                  ? Number(next)
                  : next,
            );
          }}
        />
      )}
      {definition.kind !== 'boolean' && first !== undefined && first.value !== null && (
        <Select
          disabled={disabled}
          open={operators.open}
          onOpenChange={operators.onOpenChange}
          value={first.operator}
          onValueChange={(operator) =>
            column.setFilterValue(
              filtersValueSchema.parse([{ ...first, operator }, ...remaining]),
            )
          }
        >
          <SelectTrigger aria-label={`Operator ${definition.label}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            aria-label={`Operator ${definition.label}`}
            container={operators.host}
            style={theme}
            dir={direction}
            className="motion-reduce:animate-none"
          >
            {FILTER_OPERATORS.filter(
              (operator) =>
                operator === 'equals' ||
                (definition.kind === 'text'
                  ? operator === 'contains'
                  : operator !== 'contains'),
            ).map((operator) => (
              <SelectItem
                key={operator}
                value={operator}
                disabled={remaining.some((rule) => rule.operator === operator)}
              >
                {operatorLabels[operator]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {first?.value === null && <CardDescription>Equals empty value</CardDescription>}
      {remaining.map((rule) => (
        <CardDescription key={rule.operator}>
          {`${operatorLabels[rule.operator]} ${String(rule.value)}`}
        </CardDescription>
      ))}
    </CardContent>
  );
}
