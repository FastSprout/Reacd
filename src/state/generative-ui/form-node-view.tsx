import type { ReactNode } from 'react';
import { SubmitButton } from '../../components/submit-button/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundForm } from './bound-form.js';
import { BoundFormField } from './bound-form-field.js';
import { BoundSwitch } from './bound-switch.js';
import { BoundTextarea } from './bound-textarea.js';
import { BoundSelectMenu } from './bound-select-menu.js';
import { BoundListbox } from './bound-listbox.js';
import { BoundInputMenu } from './bound-input-menu.js';
import { BoundCheckbox } from './bound-checkbox.js';
import { BoundSelect } from './bound-select.js';
import { BoundSlider } from './bound-slider.js';
import { BoundColorPicker } from './bound-color-picker.js';
import { BoundFileUpload } from './bound-file-upload.js';

export function FormNodeView({ node, registry, actions, renderChild }: {
  node: Extract<GenerativeNode, {
    type: 'Form' | 'FormField' | 'SubmitButton' | 'Switch' | 'Textarea' | 'InputMenu'
      | 'Checkbox' | 'Select' | 'Slider' | 'ColorPicker' | 'FileUpload'
      | 'SelectMenu' | 'Listbox';
  }>;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  if (node.type === 'SelectMenu')
    return <BoundSelectMenu node={node} registry={registry} />;
  if (node.type === 'Listbox')
    return <BoundListbox node={node} registry={registry} />;
  if (node.type === 'Checkbox')
    return <BoundCheckbox node={node} registry={registry} />;
  if (node.type === 'Select') return <BoundSelect node={node} registry={registry} />;
  if (node.type === 'Slider') return <BoundSlider node={node} registry={registry} />;
  if (node.type === 'ColorPicker')
    return <BoundColorPicker node={node} registry={registry} />;
  if (node.type === 'FileUpload')
    return <BoundFileUpload node={node} registry={registry} />;
  if (node.type === 'InputMenu')
    return <BoundInputMenu node={node} registry={registry} />;
  if (node.type === 'Switch') return <BoundSwitch node={node} registry={registry} />;
  if (node.type === 'Textarea')
    return <BoundTextarea node={node} registry={registry} />;
  if (node.type === 'SubmitButton') {
    const { type: _type, ...properties } = node;
    return <SubmitButton {...properties} />;
  }
  const { children, ...properties } = node;
  return properties.type === 'Form' ? (
    <BoundForm node={properties} registry={registry} actions={actions}>
      {children.map(renderChild)}
    </BoundForm>
  ) : (
    <BoundFormField node={properties} registry={registry}>
      {children.map(renderChild)}
    </BoundFormField>
  );
}
