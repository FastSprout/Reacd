import type { ShadcnFormProps } from './form.props.js';
import { FRAMEWORK_ERRORS } from '@fastsprout/reacd/adapter-runtime/core/errors.js';
import { useFormAncestry } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/use-form-ancestry.js';
import { Alert, AlertDescription } from '../vendor/ui/alert.js';
import { CardContent } from '../vendor/ui/card.js';
import { ShadcnFormContent } from './form-content.js';

export type { ShadcnFormProps } from './form.props.js';
export function ShadcnForm(props: ShadcnFormProps) {
  const { setElement, ready, nested } = useFormAncestry();
  return (
    <CardContent ref={setElement} className="min-w-0 p-0">
      {!ready ? null : nested ? (
        <Alert variant="destructive">
          <AlertDescription>{FRAMEWORK_ERRORS.nestedForm}</AlertDescription>
        </Alert>
      ) : (
        <ShadcnFormContent {...props} />
      )}
    </CardContent>
  );
}
