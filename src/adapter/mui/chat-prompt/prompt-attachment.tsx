import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InsertDriveFile from '@mui/icons-material/InsertDriveFile';
import type { ChatPromptProps } from
  '@fastsprout/reacd/adapter-runtime/components/chat-prompt/chat-prompt.props.js';
import {
  CHAT_DEFAULTS,
  CHAT_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chat-policy.js';
import { useChatLoadingRole } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-feedback/loading-scope.js';

type Attachment = NonNullable<ChatPromptProps['attachments']>[number];

export function MuiPromptAttachment({
  file,
  disabled,
  onRemove,
}: {
  readonly file: Attachment;
  readonly disabled: boolean;
  readonly onRemove: ChatPromptProps['onRemoveAttachment'];
}) {
  const loadingRole = useChatLoadingRole();
  const status = file.status ?? CHAT_DEFAULTS.attachmentStatus;
  const busy = status === 'uploading';
  return (
    <Card role="group" aria-label={file.name} aria-busy={busy}>
      <CardContent>
        <Stack>
          {file.mediaType.startsWith('image/') ? (
            <Avatar
              variant="rounded"
              src={file.url}
              alt={file.name}
              sx={{
                width: `${CHAT_POLICY.imageRem}rem`,
                height: `${CHAT_POLICY.imageRem}rem`,
              }}
            >
              <InsertDriveFile />
            </Avatar>
          ) : (
            <InsertDriveFile aria-hidden />
          )}
          <Typography sx={{ overflowWrap: 'anywhere' }}>{file.name}</Typography>
          <Typography>{file.description ?? file.mediaType}</Typography>
          {busy && (
            <Typography role={loadingRole}>{CHAT_DEFAULTS.uploadingLabel}</Typography>
          )}
          {status === 'error' && (
            <Typography role="alert">{CHAT_DEFAULTS.uploadErrorLabel}</Typography>
          )}
        </Stack>
      </CardContent>
      {onRemove !== undefined && file.removable !== false && (
        <CardActions>
          <Button type="button" disabled={disabled} onClick={() => onRemove(file.id)}>
            {`${CHAT_DEFAULTS.removePrefix} ${file.name}`}
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
