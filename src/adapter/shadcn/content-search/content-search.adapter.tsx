import { useRef } from 'react';
import type { ContentSearchProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-search/index.js';
import { CONTENT_SEARCH_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-search-policy.js';
import { ShadcnModal } from '../modal/modal.adapter.js';
import { ShadcnCommandPalette } from '../command-palette/command-palette.adapter.js';

export type ShadcnContentSearchProps = ContentSearchProps;

export function ShadcnContentSearch(props: ContentSearchProps) {
  const opener = useRef<HTMLElement | null>(null);
  return (
    <ShadcnModal
      title={props.title}
      description={props.description ?? CONTENT_SEARCH_DEFAULTS.description}
      open={props.open}
      onOpenChange={props.onOpenChange}
      triggerLabel={props.triggerLabel}
      closeLabel={props.closeLabel ?? CONTENT_SEARCH_DEFAULTS.closeLabel}
      disabled={props.disabled}
      footer={props.footer}
      retainContent={CONTENT_SEARCH_DEFAULTS.retainContent}
      onOpenAutoFocus={() => {
        const element = document.activeElement;
        opener.current =
          element instanceof HTMLElement && element !== document.body ? element : null;
      }}
      onCloseAutoFocus={(event) => {
        if (opener.current?.isConnected) {
          event.preventDefault();
          opener.current.focus();
        }
      }}
    >
      <ShadcnCommandPalette
        {...props}
        emptyMessage={props.emptyMessage ?? CONTENT_SEARCH_DEFAULTS.emptyMessage}
        onAccepted={() => {
          if (props.closeOnSelect ?? CONTENT_SEARCH_DEFAULTS.closeOnSelect) {
            props.onOpenChange(false);
          }
        }}
      />
    </ShadcnModal>
  );
}
