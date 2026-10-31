import { localeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/locale-select/index.js';
import { ShadcnLocaleSelect } from '../locale-select/locale-select.adapter.js';
import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { selectMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/select-menu/index.js';
import { ShadcnSelectMenu } from '../select-menu/select-menu.adapter.js';
import { inputMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-menu/index.js';
import { ShadcnInputMenu } from '../input-menu/input-menu.adapter.js';
import { switchSchema } from '@fastsprout/reacd/adapter-runtime/schema/switch/index.js';
import { textareaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/textarea/index.js';
import { formFieldSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-field/index.js';
import { ShadcnSwitch } from '../switch/switch.adapter.js';
import { ShadcnTextarea } from '../textarea/textarea.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { inputTimeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-time/index.js';
import { inputDateSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-date/index.js';
import { fieldGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/field-group/index.js';
import { ShadcnInputTime } from '../input-time/input-time.adapter.js';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnFieldGroup } from '../field-group/field-group.adapter.js';
import { inputTagsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-tags/index.js';
import { ShadcnInputTags } from '../input-tags/input-tags.adapter.js';
import { radioGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/radio-group/radio-group.schema.js';
import { checkboxGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/checkbox-group/index.js';
import { ShadcnRadioGroup } from '../radio-group/radio-group.adapter.js';
import { ShadcnCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
import { submitButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/submit-button/index.js';
import { textAreaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/text-area/text-area.schema.js';
import { selectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/select/select.schema.js';
import { checkboxSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/checkbox/checkbox.schema.js';
import { toggleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/toggle/toggle.schema.js';
import { sliderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/slider/slider.schema.js';
import { codeEditorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/code-editor/code-editor.schema.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';
import { ShadcnTextArea } from '../text-area/text-area.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { ShadcnToggle } from '../toggle/toggle.adapter.js';
import { ShadcnSlider } from '../slider/slider.adapter.js';
import { ShadcnCodeEditor } from '../code-editor/code-editor.adapter.js';
import { inputNumberSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-number/input-number.schema.js';
import { pinInputSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pin-input/pin-input.schema.js';
import { ShadcnInputNumber } from '../input-number/input-number.adapter.js';
import { ShadcnPinInput } from '../pin-input/pin-input.adapter.js';
import { inputRatingSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-rating/index.js';
import { ShadcnInputRating } from '../input-rating/input-rating.adapter.js';

export const fieldEntries = {
  SelectMenu: renderEntry('SelectMenu', selectMenuSchema, ShadcnSelectMenu),
  InputMenu: renderEntry('InputMenu', inputMenuSchema, ShadcnInputMenu),
  Switch: renderEntry('Switch', switchSchema, ShadcnSwitch),
  Textarea: renderEntry('Textarea', textareaSchema, ShadcnTextarea),
  FormField: renderEntry('FormField', formFieldSchema, ShadcnFormField),
  LocaleSelect: renderEntry('LocaleSelect', localeSelectSchema, ShadcnLocaleSelect),
  InputTime: renderEntry('InputTime', inputTimeSchema, ShadcnInputTime),
  InputDate: renderEntry('InputDate', inputDateSchema, ShadcnInputDate),
  FieldGroup: renderEntry('FieldGroup', fieldGroupSchema, ShadcnFieldGroup),
  InputTags: renderEntry('InputTags', inputTagsSchema, ShadcnInputTags),
  InputRating: renderEntry('InputRating', inputRatingSchema, ShadcnInputRating),
  InputNumber: renderEntry('InputNumber', inputNumberSchema, ShadcnInputNumber),
  PinInput: renderEntry('PinInput', pinInputSchema, ShadcnPinInput),
  RadioGroup: renderEntry('RadioGroup', radioGroupSchema, ShadcnRadioGroup),
  CheckboxGroup: renderEntry('CheckboxGroup', checkboxGroupSchema, ShadcnCheckboxGroup),
  SubmitButton: renderEntry('SubmitButton', submitButtonSchema, ShadcnSubmitButton),
  TextArea: renderEntry('TextArea', textAreaSchema, ShadcnTextArea),
  Select: renderEntry('Select', selectSchema, ShadcnSelect),
  Checkbox: renderEntry('Checkbox', checkboxSchema, ShadcnCheckbox),
  Toggle: renderEntry('Toggle', toggleSchema, ShadcnToggle),
  Slider: renderEntry('Slider', sliderSchema, ShadcnSlider),
  CodeEditor: renderEntry('CodeEditor', codeEditorSchema, ShadcnCodeEditor),
};
