import { templates } from '../design/templates.schema.js';
import type { TemplateRegistry } from '../design/templates.schema.js';

export const darkTemplateVariants = {
  'saas-modern-light': {
    ...templates['saas-modern-light'],
    name: 'SaaS · Spacious · Dark',
    colors: {
      canvas: '#101512',
      surface: '#18211c',
      text: '#f2f6f3',
      muted: '#bdc9c0',
      border: '#8fa397',
      primary: '#9cddb1',
      onPrimary: '#102016',
      danger: '#ffb4ab',
      onDanger: '#3a0503',
      focus: '#8bb5ff',
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
