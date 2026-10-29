import {
  FILE_UPLOAD_DEFAULTS as D,
  FILE_UPLOAD_ERRORS as E,
  FILE_UPLOAD_POLICY as P,
} from '../../../core/file-upload-policy.js';
import { fileUploadValueSchema } from '../../../schema/file-upload/index.js';
import type { FileUploadSettings } from '../../../schema/file-upload/index.js';
import type { UploadFile } from '../../../schema/file-upload/index.js';
import { inspectNativeFiles, sameUploadFiles } from './intake-validation.js';
import type { ReadTask } from './read-file.js';
export interface IntakeHost extends FileUploadSettings {
  readonly value: readonly UploadFile[];
  readonly onValueChange: (files: readonly UploadFile[]) => void;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
}
export interface IntakeSnapshot {
  readonly status: 'idle' | 'reading' | 'error' | 'cancelled';
  readonly message: string;
}
interface IntakePorts {
  readonly read: (file: File) => ReadTask;
  readonly id: () => string;
}
const IDLE: IntakeSnapshot = { status: 'idle', message: '' };
export class FileIntake {
  private host: IntakeHost | undefined;
  private token = 0;
  private task: ReadTask | undefined;
  private snapshot = IDLE;
  private readonly listeners = new Set<() => void>();
  constructor(private readonly ports: IntakePorts) {}
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  readonly getSnapshot = (): IntakeSnapshot => this.snapshot;
  private publish(snapshot: IntakeSnapshot): void {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }
  configure(host: IntakeHost): void {
    const old = this.host;
    this.host = host;
    if (
      old &&
      (!sameUploadFiles(old.value, host.value) ||
        old.multiple !== host.multiple ||
        old.maxFiles !== host.maxFiles ||
        old.accept !== host.accept ||
        host.disabled ||
        host.readOnly)
    ) {
      this.stop();
      if (this.snapshot.status !== 'idle') this.publish(IDLE);
    }
  }
  private stop(): void {
    this.token += 1;
    this.task?.cancel();
    this.task = undefined;
    if (this.snapshot.status === 'reading') this.publish(IDLE);
  }
  cancel(): void {
    if (this.snapshot.status !== 'reading') return;
    this.stop();
    this.publish({ status: 'cancelled', message: D.cancelledLabel });
  }
  dispose(): void {
    this.stop();
  }
  start(input: ArrayLike<File>): void {
    const host = this.host;
    if (!host || host.disabled || host.readOnly || input.length === 0) return;
    this.stop();
    const inspected = inspectNativeFiles(input, host);
    if (!inspected.success) {
      this.publish({
        status: 'error',
        message: inspected.issues.map((issue) => issue.message).join(' '),
      });
      return;
    }
    this.publish({ status: 'reading', message: D.busyLabel });
    void this.collect(inspected.data, host, this.token);
  }
  private async collect(
    files: readonly File[],
    host: IntakeHost,
    token: number,
  ): Promise<void> {
    const output = host.multiple === false ? [] : [...host.value];
    const ids = new Set(output.map((file) => file.id));
    try {
      for (const file of files) {
        let id = this.ports.id();
        let attempts = P.idAttempts;
        while (ids.has(id) && attempts > 0) {
          id = this.ports.id();
          attempts -= 1;
        }
        if (ids.has(id)) throw new Error(E.identity);
        ids.add(id);
        const task = this.ports.read(file);
        this.task = task;
        const data = await task.promise;
        if (token !== this.token) return;
        this.task = undefined;
        output.push({
          id,
          name: file.name,
          mediaType: file.type || D.mediaType,
          size: file.size,
          lastModified: file.lastModified,
          content: { encoding: 'base64', data },
        });
      }
      const validated = fileUploadValueSchema(host).parse(output);
      this.publish(IDLE);
      this.host?.onValueChange(validated);
    } catch {
      if (token === this.token) this.publish({ status: 'error', message: E.read });
    }
  }
}
