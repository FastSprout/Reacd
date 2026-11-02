import { renderEntry } from
'@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { buttonComponentSchema } from
'@fastsprout/reacd/adapter-runtime/schema/button/button.schema.js';
import { ShadcnButton } from '../button/button.adapter.js';
import { inputComponentSchema } from
'@fastsprout/reacd/adapter-runtime/schema/input/input.schema.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { textareaSchema } from
'@fastsprout/reacd/adapter-runtime/schema/textarea/textarea.schema.js';
import { ShadcnTextarea } from '../textarea/textarea.adapter.js';
import { textAreaSchema } from
'@fastsprout/reacd/adapter-runtime/schema/text-area/text-area.schema.js';
import { ShadcnTextArea } from '../text-area/text-area.adapter.js';
import { checkboxSchema } from
'@fastsprout/reacd/adapter-runtime/schema/checkbox/checkbox.schema.js';
import { ShadcnCheckbox } from '../checkbox/checkbox.adapter.js';
import { toggleSchema } from
'@fastsprout/reacd/adapter-runtime/schema/toggle/toggle.schema.js';
import { ShadcnToggle } from '../toggle/toggle.adapter.js';
import { switchSchema } from
'@fastsprout/reacd/adapter-runtime/schema/switch/switch.schema.js';
import { ShadcnSwitch } from '../switch/switch.adapter.js';
import { selectSchema } from
'@fastsprout/reacd/adapter-runtime/schema/select/select.schema.js';
import { ShadcnSelect } from '../select/select.adapter.js';
import { sliderSchema } from
'@fastsprout/reacd/adapter-runtime/schema/slider/slider.schema.js';
import { ShadcnSlider } from '../slider/slider.adapter.js';
import { radioGroupSchema } from
'@fastsprout/reacd/adapter-runtime/schema/radio-group/radio-group.schema.js';
import { ShadcnRadioGroup } from '../radio-group/radio-group.adapter.js';
import { checkboxGroupSchema } from
'@fastsprout/reacd/adapter-runtime/schema/checkbox-group/checkbox-group.schema.js';
import { ShadcnCheckboxGroup } from '../checkbox-group/checkbox-group.adapter.js';
import { cardSchema } from
'@fastsprout/reacd/adapter-runtime/schema/card/card.schema.js';
import { ShadcnCard } from '../card/card.adapter.js';
import { accordionSchema } from
'@fastsprout/reacd/adapter-runtime/schema/accordion/accordion.schema.js';
import { ShadcnAccordion } from '../accordion/accordion.adapter.js';
import { tabsSchema } from
'@fastsprout/reacd/adapter-runtime/schema/tabs/tabs.schema.js';
import { ShadcnTabs } from '../tabs/tabs.adapter.js';
import { modalSchema } from
'@fastsprout/reacd/adapter-runtime/schema/modal/modal.schema.js';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { progressSchema } from
'@fastsprout/reacd/adapter-runtime/schema/progress/progress.schema.js';
import { ShadcnProgress } from '../progress/progress.adapter.js';
import { spinnerSchema } from
'@fastsprout/reacd/adapter-runtime/schema/spinner/spinner.schema.js';
import { ShadcnSpinner } from '../spinner/spinner.adapter.js';

export const nativeFoundationEntries = {
  Button: renderEntry('Button', buttonComponentSchema, ShadcnButton),
  Input: renderEntry('Input', inputComponentSchema, ShadcnInput),
  Textarea: renderEntry('Textarea', textareaSchema, ShadcnTextarea),
  TextArea: renderEntry('TextArea', textAreaSchema, ShadcnTextArea),
  Checkbox: renderEntry('Checkbox', checkboxSchema, ShadcnCheckbox),
  Toggle: renderEntry('Toggle', toggleSchema, ShadcnToggle),
  Switch: renderEntry('Switch', switchSchema, ShadcnSwitch),
  Select: renderEntry('Select', selectSchema, ShadcnSelect),
  Slider: renderEntry('Slider', sliderSchema, ShadcnSlider),
  RadioGroup: renderEntry('RadioGroup', radioGroupSchema, ShadcnRadioGroup),
  CheckboxGroup: renderEntry('CheckboxGroup', checkboxGroupSchema, ShadcnCheckboxGroup),
  Card: renderEntry('Card', cardSchema, ShadcnCard),
  Accordion: renderEntry('Accordion', accordionSchema, ShadcnAccordion),
  Tabs: renderEntry('Tabs', tabsSchema, ShadcnTabs),
  Modal: renderEntry('Modal', modalSchema, ShadcnModal),
  Progress: renderEntry('Progress', progressSchema, ShadcnProgress),
  Spinner: renderEntry('Spinner', spinnerSchema, ShadcnSpinner),
};
