export function ChoiceHeader({
  id,
  label,
  description,
  required,
  max,
}: {
  id: string;
  label: string;
  description?: string | undefined;
  required?: boolean | undefined;
  max?: number | undefined;
}) {
  return (
    <>
      <legend className="reacd-choice-legend">
        <span id={id}>{label}</span>
        {required && <span> (required)</span>}
      </legend>
      {(description !== undefined || max !== undefined) && (
        <p id={`${id}-description`} className="reacd-choice-description">
          {description}
          {max !== undefined && <span> Choose up to {max} options.</span>}
        </p>
      )}
    </>
  );
}
