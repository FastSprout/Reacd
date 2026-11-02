import { templates, darkTemplateVariants } from '@fastsprout/reacd';
import type { DesignTemplate } from '@fastsprout/reacd';

export function previewTemplates(
  appearance: 'light' | 'dark',
  design?: DesignTemplate,
) {
  const registry = appearance === 'dark' ? darkTemplateVariants : templates;
  return design ? { ...registry, 'saas-modern-light': design } : registry;
}
