import { mountApplication } from '../src/state/bootstrap.js';
import { App } from './app.js';

export const root = mountApplication(App);
