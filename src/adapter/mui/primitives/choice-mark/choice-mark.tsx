import Box from '@mui/material/Box';
import { MUI_CHOICE_STYLES } from './styles.js';
import type { ChoiceMarkProps } from
  '../../../shared/primitives/choice-mark/choice-mark.props.js';

export function MuiChoiceMark({ appearance, ...properties }: ChoiceMarkProps) {
  return <Box component="span" {...properties} sx={MUI_CHOICE_STYLES[appearance]} />;
}
