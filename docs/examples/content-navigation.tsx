import { atom, useAtom } from 'jotai';
import { ContentNavigation, Input, PageSection, Text, Toggle, VStack } from 'reacd';

const expandedAtom = atom<readonly string[]>([]);
const currentAtom = atom('');
const titleAtom = atom('Guides');
const vetoAtom = atom(false);
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const emptyAtom = atom(false);

export function ContentNavigationExample() {
  const [expanded, setExpanded] = useAtom(expandedAtom);
  const [current, setCurrent] = useAtom(currentAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [veto, setVeto] = useAtom(vetoAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  return (
    <VStack>
      <Input label="Documentation group title" value={title} onValueChange={setTitle} />
      <Toggle
        label="Veto document activation"
        checked={veto}
        onCheckedChange={setVeto}
      />
      <Toggle
        label="Read-only document expansion"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Toggle
        label="Disable document navigation"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="No navigation documents"
        checked={empty}
        onCheckedChange={setEmpty}
      />
      <ContentNavigation
        label="Documentation tree"
        items={
          empty
            ? []
            : [
                {
                  key: 'guides',
                  label: title.trim() === '' ? 'Guides' : title,
                  children: [
                    {
                      key: 'navigation-intro',
                      label: 'Navigation introduction',
                      href: '#navigation-intro',
                    },
                    {
                      key: 'external',
                      label: 'Open another reference window',
                      href: '/',
                      newWindow: true,
                    },
                    {
                      key: 'unavailable',
                      label: 'Unavailable document',
                      href: '/',
                      disabled: true,
                    },
                  ],
                },
              ]
        }
        expandedKeys={empty ? [] : expanded}
        currentKey={empty ? '' : current}
        onExpandedKeysChange={setExpanded}
        onCurrentChange={(key) => {
          if (veto) return false;
          setCurrent(key);
          return true;
        }}
        expansionReadOnly={readOnly}
        disabled={disabled}
      />
      <Text>{`Current document: ${current || 'none'}`}</Text>
      <PageSection title="Navigation introduction" anchor="navigation-intro">
        <Text>The native fragment points at this accessible section heading.</Text>
      </PageSection>
    </VStack>
  );
}
