import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { authFormSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/auth-form/auth-form.schema.js';
import { fieldGroupSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/field-group/field-group.schema.js';
import { ShadcnAuthForm } from '../auth-form/auth-form.adapter.js';
import { ShadcnFieldGroup } from '../field-group/field-group.adapter.js';

export const nativeAuthenticationEntries = {
  AuthForm: renderEntry('AuthForm', authFormSchema, ShadcnAuthForm),
  FieldGroup: renderEntry('FieldGroup', fieldGroupSchema, ShadcnFieldGroup),
};
