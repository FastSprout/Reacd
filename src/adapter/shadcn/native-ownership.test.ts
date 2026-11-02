import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const COMPONENTS = [
  'button',
  'input',
  'textarea',
  'text-area',
  'checkbox',
  'toggle',
  'switch',
  'select',
  'slider',
  'radio-group',
  'checkbox-group',
  'card',
  'accordion',
  'tabs',
  'modal',
  'progress',
  'spinner',
];
const SPLIT_CONTROLS = [
  {
    name: 'checkbox',
    file: 'checkbox-control',
    component: 'ShadcnCheckboxControl',
    sdk: 'checkbox',
    primitive: 'Checkbox',
  },
  {
    name: 'switch',
    file: 'switch-control',
    component: 'ShadcnSwitchControl',
    sdk: 'switch',
    primitive: 'Switch',
  },
  {
    name: 'radio-group',
    file: 'radio-control',
    component: 'ShadcnRadioControl',
    sdk: 'radio-group',
    primitive: 'RadioGroup',
  },
];
const prohibited = /Shared|bindPrimitives|\.\.\/\.\.\/shared/;
for (const name of COMPONENTS) {
  it(`${name} maps directly to the selected SDK`, () => {
    const source = readFileSync(
      `src/adapter/shadcn/${name}/${name}.adapter.tsx`,
      'utf8',
    );
    expect(source).not.toMatch(prohibited);
    const control = SPLIT_CONTROLS.find((entry) => entry.name === name);
    if (!control) {
      expect(source).toContain('../vendor/ui/');
      return;
    }
    expect(source).toContain(
      `import { ${control.component} } from './${control.file}.js';`,
    );
    expect(source).toContain(`<${control.component}`);
    const implementation = readFileSync(
      `src/adapter/shadcn/${name}/${control.file}.tsx`,
      'utf8',
    );
    expect(implementation).not.toMatch(prohibited);
    expect(implementation).toMatch(
      new RegExp(
        `import \\{[^}]*\\b${control.primitive}\\b[^}]*\\} from ` +
          `'\\.\\./vendor/ui/${control.sdk}\\.js';`,
      ),
    );
    expect(implementation).toContain(`<${control.primitive}`);
  });
}
