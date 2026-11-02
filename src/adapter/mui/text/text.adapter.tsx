import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useContext } from 'react';
import type { TextProps } from
  '@fastsprout/reacd/adapter-runtime/components/text/text.props.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { textHeadingLevel } from
  '@fastsprout/reacd/adapter-runtime/core/text-heading.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';
import { headingTag } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-tag.js';
import { MuiFullText } from './full-text.js';

const VARIANTS = {
  headline: 'h4',
  subheadline: 'h6',
  body: 'body1',
  caption: 'caption',
  display: 'h2',
} as const;
const WEIGHTS = {
  normal: 'fontWeightRegular',
  medium: 'fontWeightMedium',
  bold: 'fontWeightBold',
} as const;
export type MuiTextProps = TextProps;

export function MuiText(props: MuiTextProps) {
  const role = props.role ?? DEFAULTS.textRole;
  const level = textHeadingLevel(role, useContext(HeadingLevelContext));
  const text = (
    <Typography
      component={level === undefined ? 'p' : headingTag(level)}
      variant={VARIANTS[role]}
      noWrap={props.lineLimit === 1}
      sx={{
        fontWeight: WEIGHTS[props.weight ?? 'normal'],
        overflowWrap: 'anywhere',
        minWidth: 0,
        ...(props.lineLimit !== undefined && props.lineLimit > 1
          ? {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: props.lineLimit,
              overflow: 'hidden',
            }
          : {}),
      }}
    >
      {props.children}
    </Typography>
  );
  if (props.lineLimit === undefined) return text;
  return (
    <Stack sx={{ minWidth: 0 }}>
      {text}
      <MuiFullText>{props.children}</MuiFullText>
    </Stack>
  );
}
