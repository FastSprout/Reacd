import { authFormSchema } from '../../../schema/auth-form/auth-form.schema.js';
import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { ShadcnAuthForm } from '../auth-form/auth-form.adapter.js';

export const authFormEntries = {
  AuthForm: renderEntry('AuthForm', authFormSchema, ShadcnAuthForm),
};
