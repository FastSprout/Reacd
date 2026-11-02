import { FormValidationContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-validation/context.js';
import { MuiFormFocusContext } from './focus-context.js';
import { useMaterialValidation } from './use-material-validation.js';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { MuiFormProps } from './form.props.js';
import { FRAMEWORK_ERRORS } from '@fastsprout/reacd/adapter-runtime/core/errors.js';
import { useFormAncestry } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/use-form-ancestry.js';
import { FORM_SUBMIT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/form-submit-policy.js';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import { FieldMetadataContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import {
  FormPendingContext,
  useInteractionState,
} from '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { materialSpacing } from '../layout/spacing.js';
import { useNativeField } from '../native-field.js';

export type { MuiFormProps } from './form.props.js';

export function MuiForm(props: MuiFormProps) {
  const { setElement, ready, nested } = useFormAncestry();
  return (
    <Stack ref={setElement}>
      {!ready ? null : nested ? (
        <Alert severity="error">{FRAMEWORK_ERRORS.nestedForm}</Alert>
      ) : (
        <MuiFormContent {...props} />
      )}
    </Stack>
  );
}

function MuiFormContent(props: MuiFormProps) {
  const theme = useTheme();
  const validation = useMaterialValidation();
  const { active, pending: parentPending } = useInteractionState();
  const field = useNativeField(props);
  const busyLabel = `${FORM_SUBMIT_POLICY.submittingPrefix} ${props.label}`;
  const pending = parentPending || Boolean(props.submitting);
  const blocked = field.blocked || pending;
  const issues = [...(props.errors ?? []), ...validation.issues].slice(
    0,
    FORM_SUBMIT_POLICY.maximumIssues,
  );
  return (
    <Stack>
      {pending && props.announcePending !== false && (
        <CircularProgress aria-label={busyLabel} />
      )}
      <Box
        component="form"
        aria-label={props.label}
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!blocked && validation.submit()) props.onSubmit();
        }}
      >
        <FormValidationContext value={validation.metadata}>
          <MuiFormFocusContext value={validation.focusMetadata}>
            <FormScopeContext value={true}>
              <FieldMetadataContext value={field}>
                <FormPendingContext value={pending}>
                  <PortalActiveContext value={active && !field.disabled}>
                    {issues.length > 0 && (
                      <Alert severity="error">
                        <AlertTitle>{FORM_SUBMIT_POLICY.summaryLabel}</AlertTitle>
                        <List>
                          {issues.map((issue, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={issue.message}
                                secondary={issue.label}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Alert>
                    )}
                    <FormControl
                      component="fieldset"
                      fullWidth
                      disabled={field.disabled}
                      inert={blocked}
                    >
                      <Stack spacing={materialSpacing(theme)}>{props.children}</Stack>
                    </FormControl>
                  </PortalActiveContext>
                </FormPendingContext>
              </FieldMetadataContext>
            </FormScopeContext>
          </MuiFormFocusContext>
        </FormValidationContext>
      </Box>
    </Stack>
  );
}
