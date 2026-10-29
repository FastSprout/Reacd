import type { DesignTemplate } from '../src/schema/design/templates.schema.js';

export const CHAT_CONTRAST_TEMPLATE: DesignTemplate = {
  name: 'Contrast regression fixture',
  colors: {
    canvas: '#767676',
    surface: '#767676',
    text: '#000000',
    muted: '#ffffff',
    border: '#000000',
    primary: '#000000',
    onPrimary: '#ffffff',
    danger: '#000000',
    onDanger: '#ffffff',
    focus: '#ffffff',
  },
  spacing: { small: 0.5, medium: 1, large: 1.5 },
  radius: 0.5,
  fontSize: 1,
  font: 'system',
  shadow: 'none',
};
