import { expectTypeOf, it } from 'vitest';
import { ReacdRenderer, validateDocument } from '../../index.js';
import type {
  ActionContext,
  ButtonNode,
  DesignTemplate,
  ReacdDocument,
  ReacdNode,
  RendererProps,
  TextNode,
  ValidationResult,
} from '../../index.js';

it('keeps the public contract typed and excludes unsafe shapes and properties', () => {
  expectTypeOf<ReturnType<typeof validateDocument>>().toEqualTypeOf<ValidationResult>();
  expectTypeOf<Parameters<typeof validateDocument>[0]>().toBeUnknown();
  expectTypeOf<RendererProps['document']>().toBeUnknown();
  expectTypeOf<Parameters<typeof ReacdRenderer>[0]>().toEqualTypeOf<RendererProps>();
  expectTypeOf<ActionContext['values']>().toEqualTypeOf<
    Readonly<Record<string, string>>
  >();
  expectTypeOf<ReacdDocument['schemaVersion']>().toEqualTypeOf<'0.1'>();
  expectTypeOf<{ type: 'div' }>().not.toMatchTypeOf<ReacdNode>();
  expectTypeOf<{ type: 'Button'; label: string }>().not.toMatchTypeOf<ButtonNode>();
  expectTypeOf<{ type: 'Text'; content: number }>().not.toMatchTypeOf<TextNode>();
  expectTypeOf<
    Extract<'style' | 'className' | 'html' | 'onClick', keyof TextNode>
  >().toBeNever();
  expectTypeOf<
    Extract<'css' | 'className' | 'position', keyof DesignTemplate>
  >().toBeNever();
});
