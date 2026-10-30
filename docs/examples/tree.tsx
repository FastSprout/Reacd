import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Input,
  Section,
  Text,
  Toggle,
  Tree,
  VStack,
} from '@fastsprout/reacd';
import type { TreeProps } from '@fastsprout/reacd';

const selectedAtom = atom<readonly string[]>([]);
const expandedAtom = atom<readonly string[]>([]);
const multipleAtom = atom(false);
const disabledAtom = atom(false);
const readonlyAtom = atom(false);
const rtlAtom = atom(false);
const labelAtom = atom('Architecture');
const deepAtom = atom(false);
const SAMPLE_DEPTH = 12;
type Item = TreeProps['items'][number];
function branches(items: readonly Item[]): readonly string[] {
  return items.flatMap((item) =>
    item.children === undefined ? [] : [item.id, ...branches(item.children)],
  );
}
export function TreeExample() {
  const [value, setValue] = useAtom(selectedAtom);
  const [expanded, setExpanded] = useAtom(expandedAtom);
  const [multiple, setMultiple] = useAtom(multipleAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [label, setLabel] = useAtom(labelAtom);
  const [deep, setDeep] = useAtom(deepAtom);
  let architecture: Item = {
    id: 'architecture',
    label: label.trim() === '' ? 'Architecture' : label,
  };
  if (deep)
    for (let depth = SAMPLE_DEPTH; depth > 0; depth -= 1)
      architecture = {
        id: `level-${depth}`,
        label: `Level ${depth}`,
        children: [architecture],
      };
  const items = [
    {
      id: 'reference',
      label: 'Reference',
      children: [
        architecture,
        {
          id: 'components',
          label: 'Components',
          children: [
            { id: 'state', label: 'State' },
            { id: 'adapters', label: 'Adapters' },
          ],
        },
      ],
    },
    { id: 'draft', label: 'Unpublished draft', disabled: true },
    { id: 'guides', label: 'Guides' },
  ];
  return (
    <Section title="Tree preview">
      <VStack>
        <Input label="Tree item label" value={label} onValueChange={setLabel} />
        <Toggle
          label="Deep tree hierarchy"
          checked={deep}
          onCheckedChange={(next) => {
            setExpanded([]);
            setDeep(next);
          }}
        />
        <Button
          label="Expand sample hierarchy"
          onPress={() => setExpanded(branches(items))}
        />
        <Toggle
          label="Multiple tree selection"
          checked={multiple}
          onCheckedChange={(next) => {
            setValue([]);
            setMultiple(next);
          }}
        />
        <Toggle label="Disable tree" checked={disabled} onCheckedChange={setDisabled} />
        <Toggle
          label="Readonly tree transitions"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Toggle label="Right to left tree" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <Tree
            label="Reference hierarchy"
            value={value}
            expanded={expanded}
            onValueChange={setValue}
            onExpandedChange={setExpanded}
            multiple={multiple}
            disabled={disabled}
            selectionReadOnly={readOnly}
            expansionReadOnly={readOnly}
            items={items}
          />
        </App>
        <Text>{`Selected entries: ${value.join(', ')}`}</Text>
      </VStack>
    </Section>
  );
}
