import { atom, useAtom } from 'jotai';
import { App, Button, Input, Table, Toggle, VStack } from 'reacd';
import type { TableProps } from 'reacd';
type Model = Extract<TableProps, { mode: 'interactive' }>['model'];
const INITIAL: Model = {
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
    { key: 'active', label: 'Active', kind: 'boolean' },
  ],
  rows: [
    { id: 'alpha', cells: { name: 'Alpha', amount: 30, active: true } },
    { id: 'beta', cells: { name: 'Beta', amount: 10, active: false } },
    { id: 'gamma', cells: { name: 'Gamma', amount: 20, active: true } },
  ],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 1 },
};
const modelAtom = atom(INITIAL);
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const rejectAtom = atom(false);
const emptyAtom = atom(false);
const stateAtom = atom<TableProps['state']>('ready');
const captionAtom = atom('Reference orders');
const CAPTION_LIMIT = 160;
export function TableExample() {
  const [model, setModel] = useAtom(modelAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [state, setState] = useAtom(stateAtom);
  const [caption, setCaption] = useAtom(captionAtom);
  const data = empty
    ? {
        ...model,
        rows: [],
        selection: [],
        pagination: { ...model.pagination, pageIndex: 0 },
      }
    : model;
  return (
    <VStack>
      <Input
        label="Table caption"
        value={caption}
        onValueChange={(next: string) => setCaption(next.slice(0, CAPTION_LIMIT))}
      />
      <Toggle label="Readonly table" checked={readOnly} onCheckedChange={setReadOnly} />
      <Toggle label="Disabled table" checked={disabled} onCheckedChange={setDisabled} />
      <Toggle label="Right to left table" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Reject table proposals"
        checked={reject}
        onCheckedChange={setReject}
      />
      <Toggle label="Empty table preview" checked={empty} onCheckedChange={setEmpty} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Table
          mode="interactive"
          caption={caption.trim() === '' ? 'Reference orders' : caption}
          model={data}
          readOnly={readOnly || empty}
          disabled={disabled}
          state={state}
          onModelChange={(next) => {
            if (!reject) setModel(next);
          }}
          onRetry={() => setState('ready')}
        />
      </App>
      <Button label="Preview loading table" onPress={() => setState('loading')} />
      <Button label="Preview failed table" onPress={() => setState('error')} />
      <Button
        label="Restore table data"
        onPress={() => {
          setModel(INITIAL);
          setState('ready');
        }}
      />
    </VStack>
  );
}
