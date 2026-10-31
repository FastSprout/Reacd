import { MuiChoiceMark } from './choice-mark/choice-mark.js';
import type { AdapterPrimitives } from '../../shared/primitives/contract.js';
import { MuiAccordionPrimitive } from './accordion/accordion.js';
import { MuiAccordionItemPrimitive } from './accordion-item/accordion-item.js';
import { MuiAccordionTriggerPrimitive } from './accordion-trigger/accordion-trigger.js';
import { MuiAccordionContentPrimitive } from './accordion-content/accordion-content.js';
import { MuiAlertPrimitive } from './alert/alert.js';
import { MuiAlertTitlePrimitive } from './alert-title/alert-title.js';
import { MuiAlertDescriptionPrimitive } from './alert-description/alert-description.js';
import { MuiBadgePrimitive } from './badge/badge.js';
import { MuiButtonPrimitive } from './button/button.js';
import { MuiCardPrimitive } from './card/card.js';
import { MuiCardHeaderPrimitive } from './card-header/card-header.js';
import { MuiCardFooterPrimitive } from './card-footer/card-footer.js';
import { MuiCheckboxPrimitive } from './checkbox/checkbox.js';
import { MuiInputPrimitive } from './input/input.js';
import { MuiLabelPrimitive } from './label/label.js';
import { MuiSelectPrimitive } from './select/select.js';
import { MuiSelectItemPrimitive } from './select-item/select-item.js';
import { MuiSelectTriggerPrimitive } from './select-trigger/select-trigger.js';
import { MuiSelectValuePrimitive } from './select-value/select-value.js';
import { MuiSelectScrollUpButtonPrimitive } from
  './select-scroll-up-button/select-scroll-up-button.js';
import { MuiSelectScrollDownButtonPrimitive } from
  './select-scroll-down-button/select-scroll-down-button.js';
import { MuiSeparatorPrimitive } from './separator/separator.js';
import { MuiSwitchPrimitive } from './switch/switch.js';
import { MuiTabsPrimitive } from './tabs/tabs.js';
import { MuiTabsContentPrimitive } from './tabs-content/tabs-content.js';
import { MuiTabsListPrimitive } from './tabs-list/tabs-list.js';
import { MuiTabsTriggerPrimitive } from './tabs-trigger/tabs-trigger.js';
import { MuiTextareaPrimitive } from './textarea/textarea.js';

import { MuiControlSurface } from './control-surface/control-surface.js';

import { MuiControlOption } from './control-option/control-option.js';

import { MuiControlPart } from './control-part/control-part.js';

export const muiPrimitives: AdapterPrimitives = {
  ChoiceMark: MuiChoiceMark,
  ControlPart: MuiControlPart,
  ControlOption: MuiControlOption,
  ControlSurface: MuiControlSurface,
  Accordion: MuiAccordionPrimitive,
  AccordionItem: MuiAccordionItemPrimitive,
  AccordionTrigger: MuiAccordionTriggerPrimitive,
  AccordionContent: MuiAccordionContentPrimitive,
  Alert: MuiAlertPrimitive,
  AlertTitle: MuiAlertTitlePrimitive,
  AlertDescription: MuiAlertDescriptionPrimitive,
  Badge: MuiBadgePrimitive,
  Button: MuiButtonPrimitive,
  Card: MuiCardPrimitive,
  CardHeader: MuiCardHeaderPrimitive,
  CardFooter: MuiCardFooterPrimitive,
  Checkbox: MuiCheckboxPrimitive,
  Input: MuiInputPrimitive,
  Label: MuiLabelPrimitive,
  Select: MuiSelectPrimitive,
  SelectItem: MuiSelectItemPrimitive,
  SelectTrigger: MuiSelectTriggerPrimitive,
  SelectValue: MuiSelectValuePrimitive,
  SelectScrollUpButton: MuiSelectScrollUpButtonPrimitive,
  SelectScrollDownButton: MuiSelectScrollDownButtonPrimitive,
  Separator: MuiSeparatorPrimitive,
  Switch: MuiSwitchPrimitive,
  Tabs: MuiTabsPrimitive,
  TabsContent: MuiTabsContentPrimitive,
  TabsList: MuiTabsListPrimitive,
  TabsTrigger: MuiTabsTriggerPrimitive,
  Textarea: MuiTextareaPrimitive,
};
