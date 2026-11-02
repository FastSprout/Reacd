import { templates } from '../../../src/schema/design/templates.data.js';
import { darkTemplateVariants } from
  '../../../src/schema/color-mode/default-templates.js';
import type { DesignTemplate } from '../../../src/schema/design/templates.schema.js';
import type { NeutralPreset, PrimaryPreset } from './preferences.js';

type NeutralColors = Pick<
  DesignTemplate['colors'],
  'canvas' | 'surface' | 'text' | 'muted' | 'border'
>;
type PrimaryColors = Pick<DesignTemplate['colors'], 'primary' | 'onPrimary'>;
type Modes<T> = Readonly<{ light: T; dark: T }>;

export const NEUTRAL_COLORS: Readonly<Record<NeutralPreset, Modes<NeutralColors>>> = {
  neutral: {
    light: templates['saas-modern-light'].colors,
    dark: darkTemplateVariants['saas-modern-light'].colors,
  },
  slate: {
    light: {
      canvas: '#ffffff',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#475569',
      border: '#64748b',
    },
    dark: {
      canvas: '#0f172a',
      surface: '#172033',
      text: '#f1f5f9',
      muted: '#94a3b8',
      border: '#64748b',
    },
  },
  gray: {
    light: {
      canvas: '#ffffff',
      surface: '#ffffff',
      text: '#111827',
      muted: '#4b5563',
      border: '#6b7280',
    },
    dark: {
      canvas: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      muted: '#9ca3af',
      border: '#6b7280',
    },
  },
  zinc: {
    light: {
      canvas: '#ffffff',
      surface: '#ffffff',
      text: '#18181b',
      muted: '#52525b',
      border: '#71717a',
    },
    dark: {
      canvas: '#09090b',
      surface: '#18181b',
      text: '#fafafa',
      muted: '#a1a1aa',
      border: '#71717a',
    },
  },
  stone: {
    light: {
      canvas: '#ffffff',
      surface: '#ffffff',
      text: '#1c1917',
      muted: '#57534e',
      border: '#78716c',
    },
    dark: {
      canvas: '#0c0a09',
      surface: '#1c1917',
      text: '#fafaf9',
      muted: '#a8a29e',
      border: '#78716c',
    },
  },
};

export const PRIMARY_COLORS: Readonly<
  Record<Exclude<PrimaryPreset, 'monochrome'>, Modes<PrimaryColors>>
> = {
  green: {
    light: { primary: '#047857', onPrimary: '#ffffff' },
    dark: { primary: '#34d399', onPrimary: '#0a0a0a' },
  },
  blue: {
    light: { primary: '#1d4ed8', onPrimary: '#ffffff' },
    dark: { primary: '#60a5fa', onPrimary: '#0a0a0a' },
  },
  violet: {
    light: { primary: '#6d28d9', onPrimary: '#ffffff' },
    dark: { primary: '#a78bfa', onPrimary: '#0a0a0a' },
  },
  rose: {
    light: { primary: '#be123c', onPrimary: '#ffffff' },
    dark: { primary: '#fb7185', onPrimary: '#0a0a0a' },
  },
  amber: {
    light: { primary: '#92400e', onPrimary: '#ffffff' },
    dark: { primary: '#fbbf24', onPrimary: '#0a0a0a' },
  },
};
