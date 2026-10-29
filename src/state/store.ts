import { createStore } from 'jotai';
import { isRecord } from '../core/value.js';

export type ReacdStore = ReturnType<typeof createStore>;

export function createReacdStore(): ReacdStore {
  return createStore();
}

export function isReacdStore(value: unknown): value is ReacdStore {
  return (
    isRecord(value) &&
    typeof value['get'] === 'function' &&
    typeof value['set'] === 'function' &&
    typeof value['sub'] === 'function'
  );
}
