import { ControlOption } from '../primitives/control-option.js';
import { Select } from '@base-ui/react/select';
import { CheckIcon } from 'lucide-react';
import type { SelectionOption } from
  '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';

export function SelectOption({
  option,
  descriptionId,
}: {
  readonly option: SelectionOption;
  readonly descriptionId: string;
}) {
  return (
    <Select.Item
      render={<ControlOption />}
      value={option.value}
      disabled={option.disabled}
      className="reacd-select-option"
      aria-label={option.label}
      aria-describedby={option.description ? descriptionId : undefined}
    >
      <Select.ItemIndicator className="reacd-select-indicator">
        <CheckIcon aria-hidden="true" />
      </Select.ItemIndicator>
      <div className="reacd-select-option-content">
        <Select.ItemText>{option.label}</Select.ItemText>
        {option.description && <p id={descriptionId}>{option.description}</p>}
      </div>
    </Select.Item>
  );
}
