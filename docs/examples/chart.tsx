import { atom, useAtom } from 'jotai';
import { z } from 'zod';
import {
  App,
  Button,
  Chart,
  Input,
  Select,
  Theme,
  Toggle,
  VStack,
  templates,
} from '@fastsprout/reacd';
import type { ChartProps } from '@fastsprout/reacd';
const kindAtom = atom<NonNullable<ChartProps['kind']>>('line');
const stateAtom = atom<ChartProps['state']>('ready');
const missingAtom = atom(true);
const emptyAtom = atom(false);
const zeroAtom = atom(false);
const rtlAtom = atom(false);
const invertedAtom = atom(false);
const labelAtom = atom('Reference activity');
const LABEL_LIMIT = 160;
const kindSchema = z.enum(['line', 'area', 'bar', 'donut']);
const KINDS = [
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
  { value: 'donut', label: 'Donut' },
];
const INVERTED = {
  ...templates['saas-modern-light'],
  name: 'Inverted chart contrast',
  colors: {
    ...templates['saas-modern-light'].colors,
    canvas: '#000000',
    surface: '#000000',
    text: '#ffffff',
    muted: '#ffffff',
    border: '#ffffff',
    focus: '#ffffff',
    primary: '#000000',
    onPrimary: '#ffffff',
  },
};
export function ChartExample() {
  const [kind, setKind] = useAtom(kindAtom);
  const [state, setState] = useAtom(stateAtom);
  const [missing, setMissing] = useAtom(missingAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [zero, setZero] = useAtom(zeroAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [inverted, setInverted] = useAtom(invertedAtom);
  const [label, setLabel] = useAtom(labelAtom);
  const categories = [
    { id: 'draft', label: 'Draft' },
    { id: 'review', label: 'Review' },
    { id: 'ready', label: 'Ready' },
  ];
  const values = zero ? [0, 0, 0] : [2, missing ? null : 4, 8];
  const series =
    kind === 'donut'
      ? [{ id: 'count', label: 'Count', values }]
      : [
          { id: 'count', label: 'Count', values },
          { id: 'change', label: 'Change', values: zero ? [0, 0, 0] : [-2, 3, -1] },
        ];
  return (
    <VStack>
      <Input
        label="Chart label"
        value={label}
        onValueChange={(next: string) => setLabel(next.slice(0, LABEL_LIMIT))}
      />
      <Select
        label="Chart kind"
        value={kind}
        items={KINDS}
        onValueChange={(next) => setKind(kindSchema.parse(next))}
      />
      <Toggle
        label="Missing chart values"
        checked={missing}
        onCheckedChange={setMissing}
      />
      <Toggle label="Zero chart values" checked={zero} onCheckedChange={setZero} />
      <Toggle label="Empty chart data" checked={empty} onCheckedChange={setEmpty} />
      <Toggle label="Right to left chart" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Inverted chart template"
        checked={inverted}
        onCheckedChange={setInverted}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Theme template={inverted ? INVERTED : undefined}>
          <Chart
            label={label.trim() === '' ? 'Reference activity' : label}
            description="Counts and signed changes by workflow category."
            kind={kind}
            state={state}
            categories={empty ? [] : categories}
            series={empty ? [] : series}
            onRetry={() => setState('ready')}
          />
        </Theme>
      </App>
      <Button label="Preview loading chart" onPress={() => setState('loading')} />
      <Button label="Preview failed chart" onPress={() => setState('error')} />
      <Button label="Restore chart" onPress={() => setState('ready')} />
    </VStack>
  );
}
