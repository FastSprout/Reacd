import { createContext, useContext } from 'react';

export interface FieldMetadata {
  readonly name: string | undefined;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly error: string;
  readonly descriptionIds: readonly string[];
}

export const FieldMetadataContext = createContext<FieldMetadata | null>(null);

interface ControlMetadata {
  readonly name?: string | undefined;
  readonly required?: boolean | undefined;
  readonly disabled?: boolean | undefined;
}

export function useFieldMetadata(
  properties: ControlMetadata,
  descriptionIds: readonly string[] = [],
): FieldMetadata {
  const parent = useContext(FieldMetadataContext);
  return {
    name: properties.name ?? parent?.name,
    required: properties.required ?? parent?.required ?? false,
    disabled: Boolean(properties.disabled || parent?.disabled),
    error: parent?.error ?? '',
    descriptionIds: [
      ...new Set([...(parent?.descriptionIds ?? []), ...descriptionIds]),
    ],
  };
}
