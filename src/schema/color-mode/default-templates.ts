import { templates } from '../design/templates.data.js';
import type { TemplateRegistry } from '../design/templates.schema.js';

export const darkTemplateVariants = {
  'saas-modern-light': {
    ...templates['saas-modern-light'],
    name: 'SaaS · Spacious · Dark',
    colors: {
      canvas: '#0a0a0a',
      surface: '#171717',
      text: '#fafafa',
      muted: '#a3a3a3',
      border: '#737373',
      primary: '#fafafa',
      onPrimary: '#171717',
      danger: '#ffb4ab',
      onDanger: '#3a0503',
      focus: '#d4d4d4',
    },
  },
  'erp-compact': {
    ...templates['erp-compact'],
    name: 'ERP · Compact · Dark',
    colors: {
      canvas: '#10151c',
      surface: '#182230',
      text: '#f4f7fc',
      muted: '#c3cfdf',
      border: '#8a9db5',
      primary: '#9fc6ff',
      onPrimary: '#10213c',
      danger: '#ffb4ab',
      onDanger: '#3a0503',
      focus: '#c2ddff',
    },
  },
} as const satisfies TemplateRegistry;
