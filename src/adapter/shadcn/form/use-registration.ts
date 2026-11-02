import { useContext, useLayoutEffect } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { RegistrationContext } from './registration-context.js';
import { registrationId } from './registration-id.js';

export function useRegistration(
  id: string,
  options: RegisterOptions<Record<string, unknown>>,
) {
  const form = useFormContext<Record<string, unknown>>();
  const scope = useContext(RegistrationContext);
  const name = registrationId(id);
  scope?.declare(name);
  const register = form?.register;
  useLayoutEffect(() => {
    if (!register) return;
    const restore = () => {
      register(name, options);
    };
    if (scope) return scope.commit(name, restore);
    restore();
    return undefined;
  }, [name, options, register, scope]);
  return { form, scope, name };
}
