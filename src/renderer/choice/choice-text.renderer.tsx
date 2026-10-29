export function ChoiceText({
  id,
  label,
  description,
}: {
  id: string;
  label: string;
  description?: string | undefined;
}) {
  return (
    <span className="reacd-choice-text">
      <span id={id}>{label}</span>
      {description !== undefined && (
        <span id={`${id}-description`} className="reacd-choice-description">
          {description}
        </span>
      )}
    </span>
  );
}
