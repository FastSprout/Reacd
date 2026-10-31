import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { SyntheticEvent } from 'react';
import type { FileUploadProps } from
  '@fastsprout/reacd/adapter-runtime/components/file-upload/index.js';
import {
  FILE_ACCEPT_TYPES,
  FILE_UPLOAD_DEFAULTS as D,
  FILE_UPLOAD_POLICY as P,
} from '@fastsprout/reacd/adapter-runtime/core/file-upload-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Button } from '../primitives/button.js';
import { FileIntake } from './intake.js';
import { readFile } from './read-file.js';
export function SharedFileUpload(props: FileUploadProps) {
  const id = useId();
  const chooser = useRef<HTMLInputElement>(null);
  const chooseButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(props, props.description ? [`${id}-help`] : []);
  const [intake] = useState(
    () =>
      new FileIntake({
        read: readFile,
        id: () => `${P.idPrefix}${crypto.randomUUID()}`,
      }),
  );
  const snapshot = useSyncExternalStore(
    intake.subscribe,
    intake.getSnapshot,
    intake.getSnapshot,
  );
  useLayoutEffect(() => {
    intake.configure({ ...props, disabled: metadata.disabled });
  });
  useEffect(() => () => intake.dispose(), [intake]);
  const requiredError = metadata.required && props.value.length === 0;
  const localError =
    snapshot.status === 'error'
      ? snapshot.message
      : attempted && requiredError
        ? D.requiredLabel
        : '';
  const error = metadata.error || localError;
  const describedBy =
    [
      ...metadata.descriptionIds,
      ...(!metadata.error && localError ? [`${id}-error`] : []),
    ].join(' ') || undefined;
  function invalid(event: SyntheticEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAttempted(true);
    if (props.readOnly || metadata.disabled) root.current?.focus();
    else chooseButton.current?.focus();
  }
  return (
    <div
      ref={root}
      role="group"
      aria-labelledby={`${id}-label`}
      tabIndex={-1}
      aria-describedby={describedBy}
      aria-invalid={Boolean(error) || undefined}
      aria-disabled={metadata.disabled || undefined}
      className="reacd-node reacd-field reacd-file-upload"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        intake.start(event.dataTransfer.files);
      }}
    >
      <label id={`${id}-label`} htmlFor={props.readOnly ? undefined : id}>
        {props.label}
      </label>
      {props.description && <p id={`${id}-help`}>{props.description}</p>}
      {!props.readOnly && (
        <>
          <p>{D.dropLabel}</p>
          <Button
            ref={chooseButton}
            type="button"
            className="reacd-button"
            disabled={metadata.disabled}
            onClick={() => chooser.current?.click()}
          >
            {D.chooseLabel}
          </Button>
          <input
            ref={chooser}
            id={id}
            type="file"
            hidden
            multiple={props.multiple ?? D.multiple}
            accept={FILE_ACCEPT_TYPES[props.accept ?? D.accept]}
            disabled={metadata.disabled}
            onChange={(event) => {
              const files = event.currentTarget.files;
              if (files) intake.start(files);
              event.currentTarget.value = '';
            }}
          />
        </>
      )}
      {props.value.length === 0 ? (
        <p>{D.emptyLabel}</p>
      ) : (
        <ul className="reacd-file-upload-list">
          {props.value.map((file) => (
            <li key={file.id}>
              <span>{file.name}</span>
              {!props.readOnly && (
                <Button
                  type="button"
                  className="reacd-button"
                  disabled={metadata.disabled}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => {
                    intake.cancel();
                    props.onValueChange(
                      props.value.filter((entry) => entry.id !== file.id),
                    );
                  }}
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {snapshot.status === 'reading' && (
        <Button
          type="button"
          className="reacd-button"
          onClick={() => {
            intake.cancel();
            chooseButton.current?.focus();
          }}
        >
          {D.cancelLabel}
        </Button>
      )}
      {snapshot.status !== 'error' && snapshot.message && (
        <p role="status">{snapshot.message}</p>
      )}
      {localError && !metadata.error && (
        <p role="alert" id={`${id}-error`}>
          {localError}
        </p>
      )}
      {metadata.name && !metadata.disabled && (
        <input type="hidden" name={metadata.name} value={JSON.stringify(props.value)} />
      )}
      <input
        type="text"
        hidden
        required={requiredError}
        disabled={metadata.disabled}
        defaultValue=""
        onInvalid={invalid}
      />
    </div>
  );
}
