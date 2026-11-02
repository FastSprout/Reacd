export interface FormConstraint {
  readonly id: string;
  readonly label: string;
  getMessage(): string | undefined;
}

export interface FormConstraintIssue {
  readonly id: string;
  readonly label: string;
  readonly message: string;
}
