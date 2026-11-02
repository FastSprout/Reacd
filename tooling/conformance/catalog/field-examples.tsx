import { DeferredView } from '../loading/deferred-view.js';
import { CoreFieldsExamples } from './core-fields-examples.js';
import { atom, useAtom } from 'jotai';
import { FileUploadExample } from '../../../docs/examples/file-upload.js';
import { ColorPickerExample } from '../../../docs/examples/color-picker.js';
import { CheckboxExample } from '../../../docs/examples/checkbox.js';
import { SelectExample } from '../../../docs/examples/select.js';
import { SliderExample } from '../../../docs/examples/slider.js';
import { SelectMenuExample } from '../fixtures/select-menu.js';
import { ListboxExample } from '../../../docs/examples/listbox.js';
import { InputMenuExample } from '../fixtures/input-menu.js';
import { SwitchExample } from '../fixtures/switch.js';
import { TextareaExample } from '../fixtures/textarea.js';
import { FormFieldExample } from '../../../docs/examples/form-field.js';
import { InputExample } from '../fixtures/input.js';
import { FormExample } from '../../../docs/examples/form.js';
import { CalendarExample } from '../fixtures/calendar.js';
import { InputTimeExample } from '../../../docs/examples/input-time.js';
import { InputDateExample } from '../fixtures/input-date.js';
import { FieldGroupExample } from '../../../docs/examples/field-group.js';
import { RadioGroupExample } from '../fixtures/radio-group.js';
import { CheckboxGroupExample } from '../fixtures/checkbox-group.js';
import { InputNumberExample } from '../fixtures/input-number.js';
import { PinInputExample } from '../fixtures/pin-input.js';
import { InputRatingExample } from '../fixtures/input-rating.js';
import {
  Checkbox,
  Form,
  Input,
  Section,
  Select,
  Slider,
  SubmitButton,
  Text,
  TextArea,
} from '@fastsprout/reacd';

const nameAtom = atom('');
const emailAtom = atom('');
const notesAtom = atom('');
const roleAtom = atom('viewer');
const updatesAtom = atom(false);
const volumeAtom = atom(50);
const statusAtom = atom('Changes stay in this local preview.');
const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
];
const VOLUME_RANGE = { min: 0, max: 100, step: 10 } as const;

export function FieldExamples() {
  const [name, setName] = useAtom(nameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [notes, setNotes] = useAtom(notesAtom);
  const [role, setRole] = useAtom(roleAtom);
  const [updates, setUpdates] = useAtom(updatesAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Section
      title="Controlled fields"
      description="Values use Jotai. Callbacks receive values, not DOM events."
    >
      <Form
        label="Example profile"
        onSubmit={() => setStatus(`Saved locally: ${name}, ${email}, ${role}.`)}
      >
        <Input label="Name" value={name} required onValueChange={setName} />
        <Input
          label="Email"
          inputType="email"
          value={email}
          required
          onValueChange={setEmail}
        />
        <TextArea label="Notes" value={notes} onValueChange={setNotes} />
        <Select label="Role" value={role} items={ROLES} onValueChange={setRole} />
        <Checkbox
          label="Receive updates"
          checked={updates}
          onCheckedChange={setUpdates}
        />
        <Slider
          label="Volume"
          value={volume}
          min={VOLUME_RANGE.min}
          max={VOLUME_RANGE.max}
          step={VOLUME_RANGE.step}
          onValueChange={setVolume}
        />
        <SubmitButton label="Save example" />
        <Text role="caption">{status}</Text>
      </Form>
      <DeferredView label="RadioGroup">
        <RadioGroupExample />
      </DeferredView>
      <DeferredView label="CheckboxGroup">
        <CheckboxGroupExample />
      </DeferredView>
      <DeferredView label="InputNumber">
        <InputNumberExample />
      </DeferredView>
      <DeferredView label="PinInput">
        <PinInputExample />
      </DeferredView>
      <DeferredView label="InputRating">
        <InputRatingExample />
      </DeferredView>
      <DeferredView label="InputTags">
        <InputTagsExample />
      </DeferredView>
      <DeferredView label="Calendar">
        <CalendarExample />
      </DeferredView>
      <DeferredView label="InputTime">
        <InputTimeExample />
      </DeferredView>
      <DeferredView label="InputDate">
        <InputDateExample />
      </DeferredView>
      <DeferredView label="FieldGroup">
        <FieldGroupExample />
      </DeferredView>
      <DeferredView label="FileUpload">
        <FileUploadExample />
      </DeferredView>
      <DeferredView label="ColorPicker">
        <ColorPickerExample />
      </DeferredView>
      <DeferredView label="Checkbox">
        <CheckboxExample />
      </DeferredView>
      <DeferredView label="Select">
        <SelectExample />
      </DeferredView>
      <DeferredView label="Slider">
        <SliderExample />
      </DeferredView>
      <DeferredView label="SelectMenu">
        <SelectMenuExample />
      </DeferredView>
      <DeferredView label="Listbox">
        <ListboxExample />
      </DeferredView>
      <DeferredView label="InputMenu">
        <InputMenuExample />
      </DeferredView>
      <DeferredView label="Switch">
        <SwitchExample />
      </DeferredView>
      <DeferredView label="Textarea">
        <TextareaExample />
      </DeferredView>
      <DeferredView label="FormField">
        <FormFieldExample />
      </DeferredView>
      <DeferredView label="Input">
        <InputExample />
      </DeferredView>
      <DeferredView label="Form">
        <FormExample />
      </DeferredView>
      <DeferredView label="CoreFields">
        <CoreFieldsExamples />
      </DeferredView>
    </Section>
  );
}
import { InputTagsExample } from '../fixtures/input-tags.js';
