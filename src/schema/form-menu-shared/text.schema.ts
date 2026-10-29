import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { FORM_MENU_DEFAULTS, FORM_MENU_POLICY } from '../../core/form-menu-policy.js';

export const menuTextSchema = z
  .string()
  .max(CONTENT_POLICY.maxTextLength, FORM_MENU_DEFAULTS.invalidText)
  .regex(FORM_MENU_POLICY.textPattern, FORM_MENU_DEFAULTS.invalidText);
