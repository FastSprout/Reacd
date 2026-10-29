import type { ReactNode } from 'react';
import { RenderContext } from '../src/components/shared/port.js';
import { ShadcnSwitch } from '../src/adapter/shadcn/switch/switch.adapter.js';
import { ShadcnTextarea } from '../src/adapter/shadcn/textarea/textarea.adapter.js';
import * as Field from '../src/adapter/shadcn/form-field/form-field.adapter.js';
import { switchSchema } from '../src/schema/switch/index.js';
import { textareaSchema } from '../src/schema/textarea/index.js';
import { formFieldSchema } from '../src/schema/form-field/index.js';
import { Issues } from '../src/renderer/issues/issues.renderer.js';

export function FormControls({ children }: { children: ReactNode }) {
  return (
    <RenderContext
      value={{
        render(kind, props) {
          if (kind === 'Switch') return <ShadcnSwitch {...switchSchema.parse(props)} />;
          if (kind === 'Textarea')
            return <ShadcnTextarea {...textareaSchema.parse(props)} />;
          if (kind === 'FormField')
            return <Field.ShadcnFormField {...formFieldSchema.parse(props)} />;
          throw new Error(`Unexpected form control: ${kind}`);
        },
        report: (issues) => <Issues issues={issues} />,
      }}
    >
      {children}
    </RenderContext>
  );
}
