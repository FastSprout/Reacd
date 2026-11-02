import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';

export function useNativeField(
  properties: Parameters<typeof useFieldMetadata>[0],
  descriptionIds?: readonly string[],
) {
  const metadata = useFieldMetadata(properties, descriptionIds);
  const { active, pending } = useInteractionState();
  const disabled = metadata.disabled || !active;
  return { ...metadata, disabled, blocked: disabled || pending };
}
