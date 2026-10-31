import type { ChoiceMarkProps } from './choice-mark/choice-mark.props.js';
import type { ComponentType } from 'react';
import type { AccordionPrimitiveProps } from './accordion/accordion.props.js';
import type { AccordionItemPrimitiveProps } from
  './accordion-item/accordion-item.props.js';
import type { AccordionTriggerPrimitiveProps } from
  './accordion-trigger/accordion-trigger.props.js';
import type { AccordionContentPrimitiveProps } from
  './accordion-content/accordion-content.props.js';
import type { AlertPrimitiveProps } from './alert/alert.props.js';
import type { AlertTitlePrimitiveProps } from './alert-title/alert-title.props.js';
import type { AlertDescriptionPrimitiveProps } from
  './alert-description/alert-description.props.js';
import type { BadgePrimitiveProps } from './badge/badge.props.js';
import type { ButtonPrimitiveProps } from './button/button.props.js';
import type { CardPrimitiveProps } from './card/card.props.js';
import type { CardHeaderPrimitiveProps } from './card-header/card-header.props.js';
import type { CardFooterPrimitiveProps } from './card-footer/card-footer.props.js';
import type { CheckboxPrimitiveProps } from './checkbox/checkbox.props.js';
import type { InputPrimitiveProps } from './input/input.props.js';
import type { LabelPrimitiveProps } from './label/label.props.js';
import type { SelectPrimitiveProps } from './select/select.props.js';
import type { SelectItemPrimitiveProps } from './select-item/select-item.props.js';
import type { SelectTriggerPrimitiveProps } from
  './select-trigger/select-trigger.props.js';
import type { SelectValuePrimitiveProps } from './select-value/select-value.props.js';
import type { SelectScrollUpButtonPrimitiveProps } from
  './select-scroll-up-button/select-scroll-up-button.props.js';
import type { SelectScrollDownButtonPrimitiveProps } from
  './select-scroll-down-button/select-scroll-down-button.props.js';
import type { SeparatorPrimitiveProps } from './separator/separator.props.js';
import type { SwitchPrimitiveProps } from './switch/switch.props.js';
import type { TabsPrimitiveProps } from './tabs/tabs.props.js';
import type { TabsContentPrimitiveProps } from './tabs-content/tabs-content.props.js';
import type { TabsListPrimitiveProps } from './tabs-list/tabs-list.props.js';
import type { TabsTriggerPrimitiveProps } from './tabs-trigger/tabs-trigger.props.js';
import type { TextareaPrimitiveProps } from './textarea/textarea.props.js';

import type { ControlSurfaceProps } from './control-surface/control-surface.props.js';

import type { ControlOptionProps } from './control-option/control-option.props.js';

import type { ControlPartProps } from './control-part/control-part.props.js';

export interface AdapterPrimitives {
  readonly ChoiceMark: ComponentType<ChoiceMarkProps>;
  readonly ControlPart: ComponentType<ControlPartProps>;
  readonly ControlOption: ComponentType<ControlOptionProps>;
  readonly ControlSurface: ComponentType<ControlSurfaceProps>;
  readonly Accordion: ComponentType<AccordionPrimitiveProps>;
  readonly AccordionItem: ComponentType<AccordionItemPrimitiveProps>;
  readonly AccordionTrigger: ComponentType<AccordionTriggerPrimitiveProps>;
  readonly AccordionContent: ComponentType<AccordionContentPrimitiveProps>;
  readonly Alert: ComponentType<AlertPrimitiveProps>;
  readonly AlertTitle: ComponentType<AlertTitlePrimitiveProps>;
  readonly AlertDescription: ComponentType<AlertDescriptionPrimitiveProps>;
  readonly Badge: ComponentType<BadgePrimitiveProps>;
  readonly Button: ComponentType<ButtonPrimitiveProps>;
  readonly Card: ComponentType<CardPrimitiveProps>;
  readonly CardHeader: ComponentType<CardHeaderPrimitiveProps>;
  readonly CardFooter: ComponentType<CardFooterPrimitiveProps>;
  readonly Checkbox: ComponentType<CheckboxPrimitiveProps>;
  readonly Input: ComponentType<InputPrimitiveProps>;
  readonly Label: ComponentType<LabelPrimitiveProps>;
  readonly Select: ComponentType<SelectPrimitiveProps>;
  readonly SelectItem: ComponentType<SelectItemPrimitiveProps>;
  readonly SelectTrigger: ComponentType<SelectTriggerPrimitiveProps>;
  readonly SelectValue: ComponentType<SelectValuePrimitiveProps>;
  readonly SelectScrollUpButton: ComponentType<SelectScrollUpButtonPrimitiveProps>;
  readonly SelectScrollDownButton: ComponentType<SelectScrollDownButtonPrimitiveProps>;
  readonly Separator: ComponentType<SeparatorPrimitiveProps>;
  readonly Switch: ComponentType<SwitchPrimitiveProps>;
  readonly Tabs: ComponentType<TabsPrimitiveProps>;
  readonly TabsContent: ComponentType<TabsContentPrimitiveProps>;
  readonly TabsList: ComponentType<TabsListPrimitiveProps>;
  readonly TabsTrigger: ComponentType<TabsTriggerPrimitiveProps>;
  readonly Textarea: ComponentType<TextareaPrimitiveProps>;
}
