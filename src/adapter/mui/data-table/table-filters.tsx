import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { DATA_TABLE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/data-table-policy.js';
import { updateColumnFilter } from './filter-value.js';

export function MuiTableFilters(
  props: Pick<DataTableProps, 'columns' | 'filters' | 'onFiltersChange'>,
) {
  const change = props.onFiltersChange;
  return (
    <Stack spacing={1}>
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
        {props.columns.map((column) => {
          const operator = column.kind === 'text' ? 'contains' : 'equals';
          const current = props.filters.find(
            (rule) => rule.column === column.key && rule.operator === operator,
          );
          const value = current
            ? String(current.value)
            : column.kind === 'boolean'
              ? DATA_TABLE_POLICY.allFilterValue
              : '';
          return (
            <TextField
              key={column.key}
              label={`Filter ${column.label}`}
              value={value}
              select={column.kind === 'boolean'}
              disabled={!change}
              type={column.kind === 'number' ? 'number' : 'text'}
              onChange={(event) => {
                const next = updateColumnFilter(
                  props.filters,
                  column,
                  event.target.value,
                );
                if (next !== null) change?.(next);
              }}
            >
              {column.kind === 'boolean' && [
                <MenuItem key="all" value={DATA_TABLE_POLICY.allFilterValue}>
                  All
                </MenuItem>,
                <MenuItem key="true" value="true">
                  Yes
                </MenuItem>,
                <MenuItem key="false" value="false">
                  No
                </MenuItem>,
                <MenuItem key="null" value="null">
                  No value
                </MenuItem>,
              ]}
            </TextField>
          );
        })}
      </Stack>
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
        {props.filters.map((rule) => (
          <Chip
            key={`${rule.column}:${rule.operator}`}
            label={`${rule.column} ${rule.operator} ${String(rule.value)}`}
            {...(change
              ? {
                  onDelete: () =>
                    change(
                      props.filters.filter(
                        (candidate) =>
                          candidate.column !== rule.column ||
                          candidate.operator !== rule.operator,
                      ),
                    ),
                }
              : {})}
          />
        ))}
      </Stack>
    </Stack>
  );
}
