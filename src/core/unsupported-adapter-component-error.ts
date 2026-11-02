export class UnsupportedAdapterComponentError extends Error {
  readonly adapterId: string;
  readonly componentName: string;

  constructor(adapterId: string, componentName: string) {
    super(`Adapter "${adapterId}" does not support component "${componentName}".`);
    this.name = 'UnsupportedAdapterComponentError';
    this.adapterId = adapterId;
    this.componentName = componentName;
  }
}
