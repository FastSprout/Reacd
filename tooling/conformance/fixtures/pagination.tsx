import { atom, useAtom } from 'jotai';
import {
  Button,
  Grid,
  Pagination,
  Section,
  Select,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
const DATASETS = { empty: 0, sample: 23, large: 1000, huge: 1_000_000_000 } as const;
const pageAtom = atom({ dataset: 'sample', value: { pageIndex: 0, pageSize: 10 } });
const sizeAtom = atom('medium');
const siblingsAtom = atom('2');
const edgesAtom = atom(true);
const controlsAtom = atom(true);
const disabledAtom = atom(false);
const readonlyAtom = atom(false);
const DATASET_OPTIONS = [
  { value: 'empty', label: 'Empty dataset' },
  { value: 'sample', label: '23 items' },
  { value: 'large', label: '1000 items' },
  { value: 'huge', label: 'Billion-item count' },
];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
const PAGE_SIZES = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '100', label: '100 per page' },
];
const SIBLINGS = [
  { value: '0', label: 'No siblings' },
  { value: '1', label: 'One sibling' },
  { value: '2', label: 'Two siblings' },
];
export function PaginationExample() {
  const [page, setPage] = useAtom(pageAtom);
  const [size, setSize] = useAtom(sizeAtom);
  const [siblings, setSiblings] = useAtom(siblingsAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [controls, setControls] = useAtom(controlsAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [readonly, setReadonly] = useAtom(readonlyAtom);
  const total =
    DATASETS[
      page.dataset === 'empty'
        ? 'empty'
        : page.dataset === 'large'
          ? 'large'
          : page.dataset === 'huge'
            ? 'huge'
            : 'sample'
    ];
  const selectionLabel =
    `Selected page: ${page.value.pageIndex + 1}.` +
    ` Page size: ${page.value.pageSize}.`;
  return (
    <Section title="Pagination preview">
      <VStack>
        <Grid columns={2}>
          <Select
            label="Pagination dataset"
            value={page.dataset}
            items={DATASET_OPTIONS}
            onValueChange={(dataset) =>
              setPage({ dataset, value: { ...page.value, pageIndex: 0 } })
            }
          />
          <Select
            label="Pagination page size"
            value={String(page.value.pageSize)}
            items={PAGE_SIZES}
            onValueChange={(value) =>
              setPage({
                ...page,
                value: {
                  pageIndex: 0,
                  pageSize: value === '25' ? 25 : value === '100' ? 100 : 10,
                },
              })
            }
          />
          <Select
            label="Pagination size"
            value={size}
            items={SIZES}
            onValueChange={setSize}
          />
          <Select
            label="Pagination siblings"
            value={siblings}
            items={SIBLINGS}
            onValueChange={setSiblings}
          />
        </Grid>
        <Toggle
          label="Show pagination edges"
          checked={edges}
          onCheckedChange={setEdges}
        />
        <Toggle
          label="Show pagination controls"
          checked={controls}
          onCheckedChange={setControls}
        />
        <Toggle
          label="Disable pagination"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle
          label="Read-only pagination"
          checked={readonly}
          onCheckedChange={setReadonly}
        />
        <Pagination
          label="Sample result pages"
          totalItems={total}
          value={page.value}
          onValueChange={readonly ? undefined : (value) => setPage({ ...page, value })}
          size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
          siblingCount={siblings === '0' ? 0 : siblings === '1' ? 1 : 2}
          showEdges={edges}
          showControls={controls}
          disabled={disabled}
        />
        <Text>{selectionLabel}</Text>
        <Button
          label="Reset sample page"
          intent="secondary"
          onPress={() => setPage({ ...page, value: { ...page.value, pageIndex: 0 } })}
        />
      </VStack>
    </Section>
  );
}

export function UrlPaginationExample() {
  return (
    <Pagination
      label="Linked result pages"
      totalItems={100}
      value={{ pageIndex: 0, pageSize: 10 }}
      navigation={{ href: '/orders?status=open#results' }}
    />
  );
}
