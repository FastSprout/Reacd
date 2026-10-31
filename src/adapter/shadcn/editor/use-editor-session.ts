import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import type { Editor } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import type { EditorProps } from
  '@fastsprout/reacd/adapter-runtime/components/editor/index.js';
import {
  EDITOR_BEHAVIOR,
  EDITOR_ERRORS,
} from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { editorDocumentToSdk } from '../editor-conversion/to-sdk.js';
import { editorDocumentFromSdk } from '../editor-conversion/from-sdk.js';
import { createEditorExtensions } from '../editor-sdk/extensions.js';
import {
  domainSelectionToSdk,
  sdkSelectionToDomain,
} from '../editor-sdk/selection-mapping.js';
import { buildEditorPlainPaste } from '../editor-sdk/plain-paste.js';
import { applyEditorPlainPaste } from '../editor-sdk/apply-paste.js';
import { createEditorDragSession } from './drag-session.js';
import { EDITOR_NATIVE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/editor-native-policy.js';
import { sameEditorSelection } from '../editor-sdk/controlled-selection.js';
import {
  selectedSdkBlockId,
  sdkBlockPosition,
} from '../editor-sdk/structural-selection.js';
import { publishEditorDocument } from './publish-edit.js';
import { createEditorResources } from '../editor-sdk/resources.js';

const CONTROLLED_TRANSACTION = EDITOR_NATIVE_POLICY.controlledTransaction;

export function useEditorSession(input: EditorProps, id: string) {
  const metadata = useFieldMetadata({ disabled: input.disabled }, [
    `${id}-description`,
  ]);
  const properties: EditorProps = { ...input, disabled: metadata.disabled };
  const active = useContext(PortalActiveContext);
  const [drag] = useState(createEditorDragSession);
  const [resources] = useState(createEditorResources);
  useEffect(() => () => resources.dispose(), [resources]);
  const [ready, setReady] = useState(false);
  const [issue, setIssue] = useState<string>();
  const [extensions] = useState(() =>
    createEditorExtensions({
      onRejected: () => setIssue(EDITOR_ERRORS.rejected),
    }),
  );
  const protectedView =
    !active || properties.disabled === true || properties.readOnly === true;
  const editor: Editor | null = useEditor({
    extensions,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    injectCSS: false,
    enableInputRules: EDITOR_BEHAVIOR.automaticInputRules,
    content: editorDocumentToSdk(properties.value),
    editable: !protectedView,
    onBeforeCreate: ({ editor: current }) => resources.capture(current),
    onCreate: () => setReady(true),
    onUpdate: ({ editor: current, transaction }) => {
      if (protectedView || transaction.getMeta(CONTROLLED_TRANSACTION)) return;
      const projected = editorDocumentFromSdk(current.state.doc);
      if (!projected.success) {
        setIssue(EDITOR_ERRORS.projection);
        return;
      }
      setIssue(undefined);
      if (
        !publishEditorDocument(
          properties,
          projected.data,
          sdkSelectionToDomain(current.state.doc, current.state.selection),
        )
      )
        setIssue(EDITOR_NATIVE_POLICY.selectionError);
    },
    onSelectionUpdate: ({ editor: current, transaction }) => {
      if (
        !active ||
        properties.disabled === true ||
        transaction.docChanged ||
        transaction.getMeta(CONTROLLED_TRANSACTION)
      )
        return;
      if (
        properties.onEditChange === undefined ||
        !current.state.doc.eq(
          current.schema.nodeFromJSON(editorDocumentToSdk(properties.value)),
        )
      )
        return;
      const selection = sdkSelectionToDomain(
        current.state.doc,
        current.state.selection,
      );
      if (
        selection !== undefined &&
        !sameEditorSelection(selection, properties.selection)
      )
        publishEditorDocument(properties, properties.value, selection);
    },
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': `${id}-label`,
        'aria-describedby': metadata.descriptionIds.join(' '),
        'aria-invalid': String(metadata.error.length > 0),
        'aria-placeholder': properties.placeholder ?? '',
        'aria-readonly': String(properties.readOnly === true),
        'aria-disabled': String(properties.disabled === true || !active),
        tabindex: properties.disabled === true || !active ? '-1' : '0',
        'data-placeholder': properties.placeholder ?? '',
      },
      handlePaste: (view, event) => {
        if (protectedView) return true;
        const clipboard = event.clipboardData;
        if (clipboard === null) return true;
        const projected = buildEditorPlainPaste(
          clipboard.getData('text/plain'),
          view.state.selection.$from.parent.type.name === 'codeBlock'
            ? 'code'
            : 'inline',
        );
        if (!projected.success) {
          setIssue(EDITOR_ERRORS.rejected);
          return true;
        }
        if (projected.data.length > 0) applyEditorPlainPaste(view, projected.data);
        return true;
      },
      handleDrop: (view, event) => {
        if (protectedView) {
          drag.cancel();
          return true;
        }
        const next = drag.drop(properties.value, event.target, event.clientY, view.dom);
        if (next !== undefined && next !== properties.value)
          publishEditorDocument(
            properties,
            next,
            sdkSelectionToDomain(view.state.doc, view.state.selection),
          );
        return true;
      },
    },
  });
  useEffect(() => () => drag.cancel(), [drag]);
  useLayoutEffect(() => {
    if (editor === null || !ready) return;
    editor.setEditable(!protectedView, false);
    if (protectedView) drag.cancel();
    const value = editor.schema.nodeFromJSON(editorDocumentToSdk(properties.value));
    const changed = !editor.state.doc.eq(value);
    const selectedBlock = selectedSdkBlockId(editor.state.selection);
    const logical = sdkSelectionToDomain(editor.state.doc, editor.state.selection);
    if (changed)
      editor
        .chain()
        .setMeta(CONTROLLED_TRANSACTION, true)
        .setMeta('addToHistory', false)
        .setContent(value, { emitUpdate: false, errorOnInvalidContent: true })
        .run();
    const selection = properties.selection ?? logical;
    const controlled = properties.selection !== undefined;
    if (
      selection !== undefined &&
      ((controlled &&
        !sameEditorSelection(
          sdkSelectionToDomain(editor.state.doc, editor.state.selection),
          selection,
        )) ||
        (!controlled && changed))
    ) {
      const structural =
        !controlled && selectedBlock !== undefined
          ? sdkBlockPosition(editor.state.doc, selectedBlock)
          : undefined;
      const mapped = domainSelectionToSdk(editor.state.doc, selection);
      if (structural !== undefined)
        editor
          .chain()
          .setMeta(CONTROLLED_TRANSACTION, true)
          .setMeta('addToHistory', false)
          .setNodeSelection(structural)
          .run();
      else if (mapped.success)
        editor
          .chain()
          .setMeta(CONTROLLED_TRANSACTION, true)
          .setMeta('addToHistory', false)
          .setTextSelection({ from: mapped.data.anchor, to: mapped.data.head })
          .run();
    }
  });
  return { editor, ready, issue, protectedView, drag, properties };
}
