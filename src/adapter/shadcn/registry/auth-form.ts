import { authFormSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/auth-form/auth-form.schema.js';
import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { ShadcnAuthForm } from '../auth-form/auth-form.adapter.js';

export const authFormEntries = {
  AuthForm: renderEntry('AuthForm', authFormSchema, ShadcnAuthForm),
};
