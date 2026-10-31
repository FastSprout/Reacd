import type { TableProps } from
  '@fastsprout/reacd/adapter-runtime/components/table/index.js';
import { TABLE_DEFAULTS as D } from
  '@fastsprout/reacd/adapter-runtime/core/table-policy.js';
import { TableSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/table/table.renderer.js';
import { SharedInteractiveTable } from './interactive-table.js';
import { Button } from '../primitives/button.js';
export function SharedTable(props: TableProps) {
  if (props.state === 'loading')
    return <p role="status">{props.loadingMessage ?? D.loadingMessage}</p>;
  if (props.state === 'error') {
    const retry = props.onRetry;
    return (
      <div className="reacd-vstack">
        <p role="alert">{props.errorMessage ?? D.errorMessage}</p>
        {retry === undefined ? null : (
          <Button type="button" className="reacd-button" onClick={() => retry()}>
            {props.retryLabel ?? D.retryLabel}
          </Button>
        )}
      </div>
    );
  }
  return props.mode === 'interactive' ? (
    <SharedInteractiveTable {...props} />
  ) : (
    <TableSurface {...props} />
  );
}
