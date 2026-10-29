import { editorNodeBindings } from '../editor/generative.schema.js';
import { selectMenuBindings } from '../select-menu/generative.schema.js';
import { listboxBindings } from '../listbox/bindings.js';
import { menuTextSchema } from '../form-menu-shared/text.schema.js';
import { z } from 'zod';
import { checkboxNodeBindings } from '../checkbox/generative.schema.js';
import { selectNodeBindings } from '../select/generative.schema.js';
import { sliderNodeBindings } from '../slider/generative.schema.js';
import { colorValueSchema } from '../color-picker/index.js';
import { fileUploadValueSchema } from '../file-upload/index.js';
import { inputValueSchema } from '../input/value.schema.js';
import { paginationBoundValueSchema } from '../pagination/value.schema.js';
import { textSchema } from '../shared/values.js';
import {
  choiceValueSchema,
  choiceSelectionSchema,
  validChoiceValue,
  validChoiceSelection,
} from '../shared/choices.js';
import { boundedProgressValueSchema } from '../progress/progress.schema.js';
import { chipTextSchema } from '../chip/chip.schema.js';
import { kbdSchema } from '../kbd/kbd.schema.js';
import { dataTableModelSchema } from '../data-table/model.schema.js';
import {
  accordionValuesSchema,
  validAccordionSelection,
} from '../accordion/accordion.schema.js';
import type { GenerativeNode } from './document.schema.js';
import type { BindingContract } from './binding-contract.js';
import { catalogBindings } from './catalog-bindings.js';

export const displayValueSchema = z
  .union([textSchema, z.number().finite(), z.boolean()])
  .transform((value) => (typeof value === 'boolean' ? String(value) : value));

export function nodeBindings(node: GenerativeNode): BindingContract[] {
  switch (node.type) {
    case 'Editor':
      return editorNodeBindings(node);
    case 'SelectMenu':
      return selectMenuBindings(node);
    case 'Listbox':
      return listboxBindings(node);
    case 'Checkbox':
      return checkboxNodeBindings(node);
    case 'Select':
      return selectNodeBindings(node);
    case 'Slider':
      return sliderNodeBindings(node);
    case 'ColorPicker':
      return [{
        reference: node.value, property: 'value', mode: node.value.mode,
        kinds: ['text'], schema: colorValueSchema(node.mode),
      }];
    case 'FileUpload':
      return [{
        reference: node.value, property: 'value', mode: node.value.mode,
        kinds: ['fileList'], schema: fileUploadValueSchema(node),
      }];
    case 'Pagination':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['pagination'],
          mode: node.value.mode,
          schema: paginationBoundValueSchema(node.totalItems, node.navigation),
        },
      ];
    case 'Skeleton':
    case 'Empty': {
      const reference = node.type === 'Skeleton' ? node.show : node.loading;
      return typeof reference === 'object'
        ? [
            {
              reference,
              property: node.type === 'Skeleton' ? 'show' : 'loading',
              kinds: ['boolean'],
              mode: 'read',
              schema: z.boolean(),
            },
          ]
        : [];
    }
    case 'Kbd':
      return typeof node.value === 'object'
        ? [
            {
              reference: node.value,
              property: 'value',
              kinds: ['text'],
              mode: 'read',
              schema: kbdSchema.shape.value,
            },
          ]
        : [];
    case 'Chip': {
      const contracts: BindingContract[] = [];
      if (typeof node.text === 'object')
        contracts.push({
          reference: node.text,
          property: 'text',
          kinds: ['text', 'number'],
          mode: 'read',
          schema: chipTextSchema,
        });
      if (typeof node.show === 'object')
        contracts.push({
          reference: node.show,
          property: 'show',
          kinds: ['boolean'],
          mode: 'read',
          schema: z.boolean(),
        });
      return contracts;
    }
    case 'Tooltip':
      return node.open === undefined
        ? []
        : [
            {
              reference: node.open,
              property: 'open',
              kinds: ['boolean'],
              mode: 'readWrite',
              schema: z.boolean(),
            },
          ];
    case 'RadioGroup':
      return [
        {
          reference: node.value,
          property: 'value',
          mode: 'readWrite',
          kinds: ['text'],
          schema: choiceValueSchema.refine((value) =>
            validChoiceValue(node.items, value),
          ),
        },
      ];
    case 'CheckboxGroup':
      return [
        {
          reference: node.value,
          property: 'value',
          mode: 'readWrite',
          kinds: ['selection'],
          schema: choiceSelectionSchema.refine((value) =>
            validChoiceSelection({ items: node.items, max: node.max, value }),
          ),
        },
      ];
    case 'Modal':
    case 'Popover':
    case 'Collapsible':
      return [
        {
          reference: node.open,
          property: 'open',
          kinds: ['boolean'],
          mode: 'readWrite',
          schema: z.boolean(),
        },
      ];
    case 'Accordion':
      return [
        {
          reference: node.value,
          property: 'value',
          kinds: ['selection'],
          mode: 'readWrite',
          schema: accordionValuesSchema.refine((value) =>
            validAccordionSelection({ ...node, value }),
          ),
        },
      ];
    case 'Text':
      return typeof node.content === 'object'
        ? [
            {
              reference: node.content,
              property: 'content',
              mode: 'read',
              kinds: ['text', 'number', 'boolean'],
              schema: displayValueSchema,
            },
          ]
        : [];
    case 'Input':
      return [
        {
          reference: node.value,
          property: 'value',
          mode: node.value.mode,
          kinds: ['text'],
          schema: inputValueSchema(node.maxLength, node.inputType),
        },
      ];
    case 'InputMenu':
      return [
        {
          reference: node.value, property: 'value', mode: node.value.mode,
          kinds: ['text'], schema: menuTextSchema,
        },
        ...(node.open === undefined ? [] : [{
          reference: node.open, property: 'open', mode: 'readWrite' as const,
          kinds: ['boolean'] as const, schema: z.boolean(),
        }]),
      ];
    case 'Toggle':
      return [
        {
          reference: node.checked,
          property: 'checked',
          mode: 'readWrite',
          kinds: ['boolean'],
          schema: z.boolean(),
        },
      ];
    case 'Progress':
      return node.value !== null && typeof node.value === 'object'
        ? [
            {
              reference: node.value,
              property: 'value',
              mode: 'read',
              kinds: ['number', 'nullableNumber'],
              schema: boundedProgressValueSchema(node.max),
            },
          ]
        : [];
    case 'Table':
      return node.mode === 'interactive'
        ? nodeBindings({ ...node, type: 'DataTable' }) : [];
    case 'DataTable':
      return [
        {
          property: 'rows',
          reference: node.bindings.rows,
          kinds: ['tableRows'],
          mode: 'read',
          schema: dataTableModelSchema.shape.rows,
        },
        {
          property: 'selection',
          reference: node.bindings.selection,
          kinds: ['selection'],
          mode: node.bindings.selection.mode,
          schema: dataTableModelSchema.shape.selection,
        },
        {
          property: 'sorting',
          reference: node.bindings.sorting,
          kinds: ['sorting'],
          mode: node.bindings.sorting.mode,
          schema: dataTableModelSchema.shape.sorting,
        },
        {
          property: 'filters',
          reference: node.bindings.filters,
          kinds: ['filters'],
          mode: node.bindings.filters.mode,
          schema: dataTableModelSchema.shape.filters,
        },
        {
          property: 'pagination',
          reference: node.bindings.pagination,
          kinds: ['pagination'],
          mode: node.bindings.pagination.mode,
          schema: dataTableModelSchema.shape.pagination,
        },
      ];
    default:
      return catalogBindings(node);
  }
}
