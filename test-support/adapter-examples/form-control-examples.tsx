import { FormField } from '../../src/components/form-field/index.js';
import { Switch } from '../../src/components/switch/index.js';
import { Textarea } from '../../src/components/textarea/index.js';

export const FORM_CONTROL_EXAMPLES = {
  Switch: (
    <Switch label="Publish example" checked={false} onCheckedChange={() => undefined} />
  ),
  Textarea: (
    <Textarea
      label="Notes example"
      value="Example draft"
      onValueChange={() => undefined}
      autoResize
      rows={2}
      maxRows={4}
    />
  ),
  FormField: (
    <FormField name="example" label="Example field" help="Supporting text">
      <Textarea label="Field example" value="Example" onValueChange={() => undefined} />
    </FormField>
  ),
};
