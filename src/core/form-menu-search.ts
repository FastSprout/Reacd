export interface FormMenuItem {
  readonly value: string;
  readonly label: string;
  readonly description?: string | undefined;
}

function normalized(value: string): string {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

export function filterFormMenuItems<Item extends FormMenuItem>(
  items: readonly Item[],
  query: string,
  visibleValues?: readonly string[],
): readonly Item[] {
  if (visibleValues !== undefined) {
    return visibleValues.flatMap((value) => {
      const item = items.find((candidate) => candidate.value === value);
      return item === undefined ? [] : [item];
    });
  }
  const terms = normalized(query).trim().split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const text = normalized(`${item.label} ${item.description ?? ''}`);
    return terms.every((term) => text.includes(term));
  });
}
