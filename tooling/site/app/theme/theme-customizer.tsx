import { atom, useAtom } from 'jotai';
import { Popover } from '@fastsprout/reacd';
import type { ThemeCustomizerProps } from './theme-customizer.props.js';
import { ThemeControls } from './theme-controls.js';

const openAtom = atom(false);

export function ThemeCustomizer(props: ThemeCustomizerProps) {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <Popover
      title="Customize theme"
      triggerLabel="Customize theme"
      closeLabel="Close"
      open={open}
      onOpenChange={setOpen}
      modal={false}
      placement="bottom"
      align="end"
    >
      <ThemeControls preferences={props.preferences} onChange={props.onChange} />
    </Popover>
  );
}
