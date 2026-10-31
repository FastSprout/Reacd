import { useContext, useId } from 'react';
import type * as Handle from
  '@fastsprout/reacd/adapter-runtime/components/editor-drag-handle/index.js';
import { editorBlockIds } from
  '@fastsprout/reacd/adapter-runtime/core/editor-blocks.js';
import { EDITOR_DRAG_POLICY as P } from
  '@fastsprout/reacd/adapter-runtime/core/editor-drag-handle-policy.js';
import { EditorScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/editor-context.js';
import { Issues } from
  '@fastsprout/reacd/adapter-runtime/renderer/issues/issues.renderer.js';
import { Button } from '../vendor/ui/button.js';
import { useDragSession } from './use-drag-session.js';
function issue(message: string) {
  return <Issues issues={[{ path: 'EditorDragHandle', message }]} />;
}
export function ShadcnEditorDragHandle({
  label,
  blockId,
  disabled,
}: Handle.EditorDragHandleProps) {
  const id = useId();
  const port = useContext(EditorScopeContext);
  const target = blockId ?? port?.selectedBlockId;
  const known =
    port !== null &&
    target !== undefined &&
    editorBlockIds(port.document).includes(target);
  const blocked = disabled === true || port === null || port.disabled || !known;
  const session = useDragSession(target, blocked);
  if (port === null) return issue(P.scopeError);
  if (target === undefined) return issue(P.selectionError);
  if (!known) return issue(P.unknownError);
  const moves = port.blockMoves(target);
  const canDrag = !blocked && (moves.up || moves.down);
  const selectLabel = canDrag ? P.selectAndDrag : P.select;
  return (
    <div
      className="reacd-node reacd-editor-drag-handle"
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-help`}
      aria-disabled={blocked || undefined}
    >
      <p id={`${id}-label`}>{label}</p>
      <p id={`${id}-help`}>
        {blocked
          ? P.protectedInstructions
          : canDrag
            ? P.instructions
            : P.fixedInstructions}
      </p>
      <div className="reacd-editor-drag-controls">
        <Button
          type="button"
          className="reacd-button"
          variant="outline"
          disabled={blocked}
          draggable={canDrag}
          aria-label={`${label}: ${selectLabel}`}
          onClick={() => port.selectBlock(target)}
          onDragStart={(event) => {
            session.finish();
            if (!canDrag || !port.beginBlockDrag(target)) {
              event.preventDefault();
              return;
            }
            session.start({ id: target, cancel: () => port.cancelBlockDrag() });
            try {
              event.dataTransfer.effectAllowed = P.moveEffect;
              event.dataTransfer.setData(P.mimeType, target);
            } catch {
              session.finish();
              event.preventDefault();
            }
          }}
          onDragEnd={() => session.finish()}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && session.finish()) {
              event.preventDefault();
            }
          }}
        >
          {selectLabel}
        </Button>
        <Button
          type="button"
          className="reacd-button"
          variant="outline"
          disabled={blocked || !moves.up}
          aria-label={`${label}: ${P.up}`}
          onClick={() => port.moveBlock(target, 'up')}
        >
          {P.up}
        </Button>
        <Button
          type="button"
          className="reacd-button"
          variant="outline"
          disabled={blocked || !moves.down}
          aria-label={`${label}: ${P.down}`}
          onClick={() => port.moveBlock(target, 'down')}
        >
          {P.down}
        </Button>
      </div>
    </div>
  );
}
