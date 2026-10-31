import { localeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/locale-select/index.js';
import { MuiLocaleSelect } from '../locale-select/locale-select.adapter.js';
import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { selectMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/select-menu/index.js';
import { MuiSelectMenu } from '../select-menu/select-menu.adapter.js';
import { inputMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-menu/index.js';
import { MuiInputMenu } from '../input-menu/input-menu.adapter.js';
import { switchSchema } from '@fastsprout/reacd/adapter-runtime/schema/switch/index.js';
import { textareaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/textarea/index.js';
import { formFieldSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form-field/index.js';
import { MuiSwitch } from '../switch/switch.adapter.js';
import { MuiTextarea } from '../textarea/textarea.adapter.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { inputTimeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-time/index.js';
import { inputDateSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-date/index.js';
import { fieldGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/field-group/index.js';
import { MuiInputTime } from '../input-time/input-time.adapter.js';
import { MuiInputDate } from '../input-date/input-date.adapter.js';
import { MuiFieldGroup } from '../field-group/field-group.adapter.js';
import { inputTagsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-tags/index.js';
import { MuiInputTags } from '../input-tags/input-tags.adapter.js';
import { radioGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/radio-group/radio-group.schema.js';
import { checkboxGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/checkbox-group/index.js';
import { MuiRadioGroup } from '../radio-group/radio-group.adapter.js';
import { MuiCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
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
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { MuiTextArea } from '../text-area/text-area.adapter.js';
import { MuiSelect } from '../select/select.adapter.js';
import { MuiCheckbox } from '../checkbox/checkbox.adapter.js';
import { MuiToggle } from '../toggle/toggle.adapter.js';
import { MuiSlider } from '../slider/slider.adapter.js';
import { MuiCodeEditor } from '../code-editor/code-editor.adapter.js';
import { inputNumberSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-number/input-number.schema.js';
import { pinInputSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pin-input/pin-input.schema.js';
import { MuiInputNumber } from '../input-number/input-number.adapter.js';
import { MuiPinInput } from '../pin-input/pin-input.adapter.js';
import { inputRatingSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-rating/index.js';
import { MuiInputRating } from '../input-rating/input-rating.adapter.js';

export const fieldEntries = {
  SelectMenu: renderEntry('SelectMenu', selectMenuSchema, MuiSelectMenu),
  InputMenu: renderEntry('InputMenu', inputMenuSchema, MuiInputMenu),
  Switch: renderEntry('Switch', switchSchema, MuiSwitch),
  Textarea: renderEntry('Textarea', textareaSchema, MuiTextarea),
  FormField: renderEntry('FormField', formFieldSchema, MuiFormField),
  LocaleSelect: renderEntry('LocaleSelect', localeSelectSchema, MuiLocaleSelect),
  InputTime: renderEntry('InputTime', inputTimeSchema, MuiInputTime),
  InputDate: renderEntry('InputDate', inputDateSchema, MuiInputDate),
  FieldGroup: renderEntry('FieldGroup', fieldGroupSchema, MuiFieldGroup),
  InputTags: renderEntry('InputTags', inputTagsSchema, MuiInputTags),
  InputRating: renderEntry('InputRating', inputRatingSchema, MuiInputRating),
  InputNumber: renderEntry('InputNumber', inputNumberSchema, MuiInputNumber),
  PinInput: renderEntry('PinInput', pinInputSchema, MuiPinInput),
  RadioGroup: renderEntry('RadioGroup', radioGroupSchema, MuiRadioGroup),
  CheckboxGroup: renderEntry('CheckboxGroup', checkboxGroupSchema, MuiCheckboxGroup),
  SubmitButton: renderEntry('SubmitButton', submitButtonSchema, MuiSubmitButton),
  TextArea: renderEntry('TextArea', textAreaSchema, MuiTextArea),
  Select: renderEntry('Select', selectSchema, MuiSelect),
  Checkbox: renderEntry('Checkbox', checkboxSchema, MuiCheckbox),
  Toggle: renderEntry('Toggle', toggleSchema, MuiToggle),
  Slider: renderEntry('Slider', sliderSchema, MuiSlider),
  CodeEditor: renderEntry('CodeEditor', codeEditorSchema, MuiCodeEditor),
};
