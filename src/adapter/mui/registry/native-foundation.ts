import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { buttonComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/button/button.schema.js';
import { MuiButton } from '../button/button.adapter.js';
import { inputComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input/input.schema.js';
import { MuiInput } from '../input/input.adapter.js';
import { textareaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/textarea/textarea.schema.js';
import { MuiTextarea } from '../textarea/textarea.adapter.js';
import { textAreaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/text-area/text-area.schema.js';
import { MuiTextArea } from '../text-area/text-area.adapter.js';
import { checkboxSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/checkbox/checkbox.schema.js';
import { MuiCheckbox } from '../checkbox/checkbox.adapter.js';
import { toggleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/toggle/toggle.schema.js';
import { MuiToggle } from '../toggle/toggle.adapter.js';
import { switchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/switch/switch.schema.js';
import { MuiSwitch } from '../switch/switch.adapter.js';
import { selectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/select/select.schema.js';
import { MuiSelect } from '../select/select.adapter.js';
import { sliderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/slider/slider.schema.js';
import { MuiSlider } from '../slider/slider.adapter.js';
import { radioGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/radio-group/radio-group.schema.js';
import { MuiRadioGroup } from '../radio-group/radio-group.adapter.js';
import { checkboxGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/checkbox-group/checkbox-group.schema.js';
import { MuiCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
import { cardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/card/card.schema.js';
import { MuiCard } from '../card/card.adapter.js';
import { accordionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/accordion/accordion.schema.js';
import { MuiAccordion } from '../accordion/accordion.adapter.js';
import { tabsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/tabs/tabs.schema.js';
import { MuiTabs } from '../tabs/tabs.adapter.js';
import { modalSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/modal/modal.schema.js';
import { MuiModal } from '../modal/modal.adapter.js';
import { progressSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/progress/progress.schema.js';
import { MuiProgress } from '../progress/progress.adapter.js';
import { spinnerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/spinner/spinner.schema.js';
import { MuiSpinner } from '../spinner/spinner.adapter.js';

export const nativeFoundationEntries = {
  Button: renderEntry('Button', buttonComponentSchema, MuiButton),
  Input: renderEntry('Input', inputComponentSchema, MuiInput),
  Textarea: renderEntry('Textarea', textareaSchema, MuiTextarea),
  TextArea: renderEntry('TextArea', textAreaSchema, MuiTextArea),
  Checkbox: renderEntry('Checkbox', checkboxSchema, MuiCheckbox),
  Toggle: renderEntry('Toggle', toggleSchema, MuiToggle),
  Switch: renderEntry('Switch', switchSchema, MuiSwitch),
  Select: renderEntry('Select', selectSchema, MuiSelect),
  Slider: renderEntry('Slider', sliderSchema, MuiSlider),
  RadioGroup: renderEntry('RadioGroup', radioGroupSchema, MuiRadioGroup),
  CheckboxGroup: renderEntry('CheckboxGroup', checkboxGroupSchema, MuiCheckboxGroup),
  Card: renderEntry('Card', cardSchema, MuiCard),
  Accordion: renderEntry('Accordion', accordionSchema, MuiAccordion),
  Tabs: renderEntry('Tabs', tabsSchema, MuiTabs),
  Modal: renderEntry('Modal', modalSchema, MuiModal),
  Progress: renderEntry('Progress', progressSchema, MuiProgress),
  Spinner: renderEntry('Spinner', spinnerSchema, MuiSpinner),
};
