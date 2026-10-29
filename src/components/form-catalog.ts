import type { CalendarProps } from './calendar/index.js';
import type { InputDateProps } from './input-date/index.js';
import type { InputTimeProps } from './input-time/index.js';
import type { FieldGroupProps } from './field-group/index.js';
import type { SwitchProps } from './switch/index.js';
import type { TextareaProps } from './textarea/index.js';
import type { FormFieldProps } from './form-field/index.js';
import type { InputMenuProps } from './input-menu/index.js';

import type { SelectMenuProps } from './select-menu/index.js';
import type { ListboxProps } from './listbox/index.js';

export interface FormCatalog {
  SelectMenu: SelectMenuProps;
  Listbox: ListboxProps;
  ColorPicker: ColorPickerProps;
  FileUpload: FileUploadProps;
  InputMenu: InputMenuProps;
  Switch: SwitchProps;
  Textarea: TextareaProps;
  FormField: FormFieldProps;
  Calendar: CalendarProps;
  InputDate: InputDateProps;
  InputTime: InputTimeProps;
  FieldGroup: FieldGroupProps;
}
import type { ColorPickerProps } from './color-picker/index.js';
import type { FileUploadProps } from './file-upload/index.js';
