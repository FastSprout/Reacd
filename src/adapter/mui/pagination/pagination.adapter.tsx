import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PaginationProps } from
  '@fastsprout/reacd/adapter-runtime/components/pagination/pagination.props.js';
import { paginationHref } from
  '@fastsprout/reacd/adapter-runtime/core/pagination-href.js';
import { paginationPageCount } from
  '@fastsprout/reacd/adapter-runtime/core/pagination.js';
import {
  PAGINATION_DEFAULTS,
  PAGINATION_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/pagination-policy.js';
import { useNativeField } from '../native-field.js';
import { emitNativeValue } from '../native-value.js';
import { requestNativePagination } from './request-change.js';

export type MuiPaginationProps = PaginationProps;

export function MuiPagination(props: MuiPaginationProps) {
  const field = useNativeField(props);
  const navigation = props.navigation;
  const change = props.onValueChange;
  const offset = PAGINATION_POLICY.displayOffset;
  const page = props.value.pageIndex + offset;
  const count = paginationPageCount(props.totalItems, props.value.pageSize);
  const blocked = field.blocked || (!navigation && !change);
  const controls = props.showControls ?? PAGINATION_DEFAULTS.showControls;
  const edges = props.showEdges ?? PAGINATION_DEFAULTS.showEdges;
  return (
    <Stack>
      <Pagination
        aria-label={props.label}
        count={count}
        page={page}
        disabled={blocked}
        size={props.size ?? PAGINATION_DEFAULTS.size}
        siblingCount={props.siblingCount ?? PAGINATION_DEFAULTS.siblingCount}
        hideNextButton={!controls}
        hidePrevButton={!controls}
        showFirstButton={edges}
        showLastButton={edges}
        onChange={(_event, next) =>
          emitNativeValue(change, { ...props.value, pageIndex: next - offset }, blocked)
        }
        renderItem={(item) => {
          if (!navigation || item.page === null || item.disabled) {
            return <PaginationItem {...item} />;
          }
          const value = { ...props.value, pageIndex: item.page - offset };
          const href = paginationHref(navigation, value);
          return (
            <PaginationItem
              {...item}
              component={Link}
              href={href}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey ||
                  event.button !== 0
                )
                  return;
                event.preventDefault();
                if (requestNativePagination(change, value)) {
                  globalThis.location.assign(href);
                }
              }}
            />
          );
        }}
      />
      <Typography role="status">
        Page {page} of {count}
      </Typography>
    </Stack>
  );
}
