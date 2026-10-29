import { formBindings } from './form-bindings.js';
import { colorModeBindings } from '../color-mode/binding-contracts.js';
import { localeValueSchema } from '../locale-select/index.js';
import { carouselValueSchema } from '../carousel/index.js';
import { z } from 'zod';
import { chatComposerBindings } from '../chat-prompt/composer-contracts.js';
import {
  boundedDateValueSchema,
  dateRangeValueSchema,
  boundedTimeValueSchema,
  timeRangeValueSchema,
} from '../date-time/index.js';
import { chatFeedbackBindings } from '../chat-tool/feedback-contracts.js';
import {
  contentCurrentSchema,
  contentExpansionSchema,
} from '../content-outline/value.schema.js';
import { dashboardBindings } from './dashboard-bindings.js';
import { menuItemBindings } from '../action-menu/bindings.js';
import { sidebarSplitterBindings } from './sidebar-splitter-bindings.js';
import { commandQuerySchema } from '../command-palette/command-palette.schema.js';
import { commandSelectionSchema } from '../command-palette/generative.schema.js';
import { tagsValueSchema } from '../input-tags/index.js';
import { treeValueSchema, treeExpandedSchema } from '../tree/value.schema.js';
import { stepperValueSchema } from '../stepper/stepper.schema.js';
import { tabValueSchema } from '../tabs/value.schema.js';
import { INPUT_NUMBER_POLICY } from '../../core/input-number-policy.js';
import { numericValueSchema } from '../input-number/input-number.schema.js';
import { pinValueSchema } from '../pin-input/pin-input.schema.js';
import { timelineValueSchema } from '../timeline/value.schema.js';
import { ratingValueSchema } from '../input-rating/index.js';
import type { GenerativeNode } from './document.schema.js';
import type { BindingContract } from './binding-contract.js';

export function catalogBindings(node: GenerativeNode): BindingContract[] {
  switch (node.type) {
    case 'ChatPrompt':
    case 'ChatPromptSubmit':
      return chatComposerBindings(node);
    case 'Form':
    case 'FormField':
    case 'Switch':
    case 'Textarea':
      return formBindings(node);
    case 'ColorModeButton':
    case 'ColorModeSwitch':
    case 'ColorModeSelect':
    case 'ColorModeAvatar':
    case 'ColorModeImage':
      return colorModeBindings(node);
    case 'LocaleSelect':
      return [{
        reference: node.value, property: 'value', kinds: ['text'],
        mode: node.value.mode, schema: localeValueSchema(node.locales),
      }];
    case 'Carousel':
      return [{
        reference: node.value, property: 'value', kinds: ['number'],
        mode: node.value.mode, schema: carouselValueSchema(node.items.length),
      }];
    case 'Marquee':
      return [{
        reference: node.paused, property: 'paused', kinds: ['boolean'],
        mode: node.paused.mode, schema: z.boolean(),
      }];
    case 'ChatReasoning':
    case 'ChatTool':
    case 'ChatShimmer':
      return chatFeedbackBindings(node);
    case 'Alert':
      return typeof node.open === 'object'
        ? [{
            reference: node.open, property: 'open', kinds: ['boolean'],
            mode: node.open.mode, schema: z.boolean(),
          }]
        : [];
    case 'Calendar':
    case 'InputDate':
      return [{
        reference: node.value, property: 'value',
        kinds: node.mode === 'range' ? ['dateRange'] : ['date'],
        mode: node.value.mode,
        schema: node.mode === 'range'
          ? dateRangeValueSchema({ min: node.min, max: node.max })
          : boundedDateValueSchema({ min: node.min, max: node.max }),
      }];
    case 'InputTime':
      return [{
        reference: node.value, property: 'value',
        kinds: node.mode === 'range' ? ['timeRange'] : ['time'],
        mode: node.value.mode,
        schema: node.mode === 'range'
          ? timeRangeValueSchema({ min: node.min, max: node.max })
          : boundedTimeValueSchema({ min: node.min, max: node.max }),
      }];
    case 'ContentNavigation':
    case 'ContentToc':
      return [
        { reference: node.currentKey, property: 'currentKey', kinds: ['text'],
          mode: node.currentKey.mode, schema: contentCurrentSchema(node.items) },
        ...(node.type === 'ContentToc' ? [] : [{
          reference: node.expandedKeys, property: 'expandedKeys',
          kinds: ['selection'] as const, mode: node.expandedKeys.mode,
          schema: contentExpansionSchema(node.items),
        }]),
      ];
    case 'AuthForm': {
      const contracts: BindingContract[] = [];
      for (const property of ['loading', 'disabled'] as const) {
        const reference = node[property];
        if (typeof reference === 'object')
          contracts.push({
            reference, property, kinds: ['boolean'], mode: 'read',
            schema: z.boolean(),
          });
      }
      return contracts;
    }
    case 'ContentSearchButton':
      return [{
        reference: node.open, property: 'open', kinds: ['boolean'],
        mode: 'readWrite', schema: z.boolean(),
      }];
    case 'ContentSearch':
      return [
        {
          reference: node.open, property: 'open', kinds: ['boolean'],
          mode: 'readWrite', schema: z.boolean(),
        },
        ...catalogBindings({
          type: 'CommandPalette', label: node.label, query: node.query,
          groups: node.groups, selection: node.selection,
        }),
      ];
    case 'DashboardGroup':
    case 'DashboardSearch':
      return dashboardBindings(node);
    case 'ContextMenu':
    case 'DropdownMenu':
      return [
        {
          reference: node.open,
          property: 'open',
          kinds: ['boolean'],
          mode: 'readWrite',
          schema: z.boolean(),
        },
        ...menuItemBindings(node.items),
      ];
    case 'Toast':
    case 'Drawer':
    case 'Slideover':
      return [
        {
          reference: node.open,
          property: 'open',
          kinds: ['boolean'],
          mode: 'readWrite',
          schema: z.boolean(),
        },
      ];
    case 'CommandPalette':
      return [
        {
          reference: node.query,
          property: 'query',
          kinds: ['text'],
          mode: 'readWrite',
          schema: commandQuerySchema,
        },
        ...(node.selection === undefined
          ? []
          : [
              {
                reference: node.selection,
                property: 'selection',
                kinds: ['text'] as const,
                mode: 'readWrite' as const,
                schema: commandSelectionSchema(node.groups),
              },
            ]),
      ];
    case 'InputTags':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['selection'],
          mode: node.value.mode,
          schema: tagsValueSchema(node.maxTags, node.maxTagLength),
        },
      ];
    case 'Tree':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['selection'],
          mode: node.value.mode,
          schema: treeValueSchema(node.items, node.multiple),
        },
        {
          reference: node.expanded,
          property: 'expanded',
          kinds: ['selection'],
          mode: node.expanded.mode,
          schema: treeExpandedSchema(node.items),
        },
      ];
    case 'Stepper':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['text'],
          mode: node.value.mode,
          schema: stepperValueSchema(node.items),
        },
      ];
    case 'Tabs':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['text'],
          mode: node.value.mode,
          schema: tabValueSchema(node.items),
        },
      ];
    case 'InputRating':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['number'],
          mode: node.value.mode,
          schema: ratingValueSchema(node.length, node.step),
        },
      ];
    case 'Timeline':
      return typeof node.value === 'object'
        ? [
            {
              reference: node.value,
              property: 'value',
              kinds: ['text'],
              mode: 'readWrite',
              schema: timelineValueSchema(node.items),
            },
          ]
        : [];
    case 'InputNumber':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['nullableNumber'],
          mode: node.value.mode,
          schema: numericValueSchema
            .min(node.min ?? INPUT_NUMBER_POLICY.minimum)
            .max(node.max ?? INPUT_NUMBER_POLICY.maximum)
            .nullable(),
        },
      ];
    case 'PinInput':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['text'],
          mode: node.value.mode,
          schema: pinValueSchema(node.length, node.inputType),
        },
      ];
    case 'Banner':
      return [
        {
          reference: node.open,
          property: 'open',
          kinds: ['boolean'],
          mode: 'readWrite',
          schema: z.boolean(),
        },
      ];
    case 'Header':
      return node.menu === undefined
        ? []
        : [
            {
              reference: node.menu.open,
              property: 'menu.open',
              kinds: ['boolean'],
              mode: 'readWrite',
              schema: z.boolean(),
            },
          ];
    default:
      return sidebarSplitterBindings(node);
  }
}
