import type { FormConstraint, FormConstraintIssue } from './form-constraint.js';
import { FORM_SUBMIT_POLICY } from './form-submit-policy.js';

export class FormConstraintRegistry {
  private readonly constraints = new Map<string, FormConstraint>();

  register(constraint: FormConstraint): () => void {
    this.constraints.set(constraint.id, constraint);
    return () => {
      if (this.constraints.get(constraint.id) === constraint) {
        this.constraints.delete(constraint.id);
      }
    };
  }

  inspect(): readonly FormConstraintIssue[] {
    const issues: FormConstraintIssue[] = [];
    for (const constraint of this.constraints.values()) {
      const message = constraint.getMessage();
      if (message !== undefined) {
        issues.push({ id: constraint.id, label: constraint.label, message });
      }
    }
    return issues.slice(0, FORM_SUBMIT_POLICY.maximumIssues);
  }
}
