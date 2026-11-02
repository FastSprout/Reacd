import { z } from 'zod';
import { templates as presets } from './templates.data.js';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const rem = z.number().min(0).max(4);

export function contrastRatio(first: string, second: string): number {
  function luminance(hex: string): number {
    function channel(offset: number): number {
      const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  }
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export const templateSchema = z
  .strictObject({
    name: z.string().min(1).max(100),
    colors: z.strictObject({
      canvas: color,
      surface: color,
      text: color,
      muted: color,
      border: color,
      primary: color,
      onPrimary: color,
      danger: color,
      onDanger: color,
      focus: color,
    }),
    spacing: z.strictObject({ small: rem, medium: rem, large: rem }),
    radius: rem,
    fontSize: z.number().min(0.875).max(1.25),
    font: z.enum(['system', 'humanist']),
    shadow: z.enum(['none', 'soft']),
  })
  .superRefine((template, context) => {
    const { colors, spacing } = template;
    const pairs = [
      [colors.text, colors.canvas, 4.5],
      [colors.text, colors.surface, 4.5],
      [colors.muted, colors.canvas, 4.5],
      [colors.muted, colors.surface, 4.5],
      [colors.onPrimary, colors.primary, 4.5],
      [colors.onDanger, colors.danger, 4.5],
      [colors.border, colors.surface, 3],
      [colors.border, colors.canvas, 3],
      [colors.focus, colors.surface, 3],
      [colors.focus, colors.canvas, 3],
    ] satisfies [string, string, number][];
    for (const [foreground, background, minimum] of pairs) {
      if (contrastRatio(foreground, background) < minimum) {
        context.addIssue({
          code: 'custom',
          path: ['colors'],
          message:
            `Insufficient contrast ${foreground} / ${background}; ` +
            `required ${minimum}:1.`,
        });
      }
    }
    if (spacing.small > spacing.medium || spacing.medium > spacing.large) {
      context.addIssue({
        code: 'custom',
        path: ['spacing'],
        message: 'Spacing must satisfy small ≤ medium ≤ large.',
      });
    }
  });

export type DesignTemplate = z.infer<typeof templateSchema>;
export type TemplateRegistry = Readonly<Record<string, DesignTemplate>>;

export const templates = presets satisfies TemplateRegistry;
