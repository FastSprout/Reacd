import { useId } from 'react';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/toast.props.js';
import { TOAST_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { Alert, AlertDescription, AlertTitle } from '../vendor/ui/alert.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { useToastAdmission } from './scope.js';
import { useToastLifecycle } from './use-lifecycle.js';
import { NativeToastCard } from './card.js';

export function ShadcnToast(properties: ToastProps) {
  const id = useId();
  const { blocked } = useNativeField({});
  const status = useToastAdmission(id, properties.open && !blocked);
  const lifecycle = useToastLifecycle(properties, !blocked);
  if (status === 'full' && properties.open && !blocked) {
    return <Alert variant="destructive" aria-label={properties.title}>
      <AlertTitle>{properties.title}</AlertTitle>
      <AlertDescription>{TOAST_DEFAULTS.limit}</AlertDescription>
    </Alert>;
  }
  return <NativeToastCard properties={properties} lifecycle={lifecycle} id={id}
    visible={properties.open && !blocked && status === 'visible'} />;
}
