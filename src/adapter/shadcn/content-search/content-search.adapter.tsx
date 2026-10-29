import { useState } from 'react';
import type { ContentSearchProps } from '../../../components/content-search/index.js';
import { CommandPalette } from '../../../components/command-palette/index.js';
import { Modal } from '../../../components/modal/modal.js';
import { CONTENT_SEARCH_DEFAULTS } from '../../../core/content-search-policy.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';

export function ShadcnContentSearch({
  title,
  description = CONTENT_SEARCH_DEFAULTS.description,
  open,
  onOpenChange,
  triggerLabel,
  closeLabel = CONTENT_SEARCH_DEFAULTS.closeLabel,
  closeOnSelect = CONTENT_SEARCH_DEFAULTS.closeOnSelect,
  footer,
  onSelect,
  emptyMessage = CONTENT_SEARCH_DEFAULTS.emptyMessage,
  ...palette
}: ContentSearchProps) {
  const [invalid, setInvalid] = useState(false);
  return (
    <Modal
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      triggerLabel={triggerLabel}
      closeLabel={closeLabel}
      disabled={palette.disabled}
      retainContent={CONTENT_SEARCH_DEFAULTS.retainContent}
      footer={footer}
    >
      {invalid && (
        <Issues
          issues={[
            {
              path: 'selection',
              message: CONTENT_SEARCH_DEFAULTS.invalidSelection,
            },
          ]}
        />
      )}
      <CommandPalette
        {...palette}
        emptyMessage={emptyMessage}
        onSelect={(key) => {
          const decision: unknown = onSelect?.(key);
          if (decision !== undefined && typeof decision !== 'boolean') {
            setInvalid(true);
            return false;
          }
          setInvalid(false);
          if (decision === false) return false;
          if (closeOnSelect) onOpenChange(false);
          return true;
        }}
      />
    </Modal>
  );
}
