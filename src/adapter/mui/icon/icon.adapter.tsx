import Add from '@mui/icons-material/Add';
import Check from '@mui/icons-material/Check';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Close from '@mui/icons-material/Close';
import Download from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import Info from '@mui/icons-material/Info';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Remove from '@mui/icons-material/Remove';
import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import Brightness6 from '@mui/icons-material/Brightness6';
import ViewSidebar from '@mui/icons-material/ViewSidebar';
import Sync from '@mui/icons-material/Sync';
import Upload from '@mui/icons-material/Upload';
import Warning from '@mui/icons-material/Warning';
import type { IconProps } from
  '@fastsprout/reacd/adapter-runtime/components/icon/icon.props.js';

const MATERIAL_ICONS = {
  add: Add,
  remove: Remove,
  close: Close,
  check: Check,
  search: Search,
  info: Info,
  warning: Warning,
  error: ErrorIcon,
  success: CheckCircle,
  settings: Settings,
  appearance: Brightness6,
  layout: ViewSidebar,
  download: Download,
  upload: Upload,
  external: OpenInNew,
  loading: Sync,
};

export type MuiIconProps = IconProps;

export function MuiIcon(props: MuiIconProps) {
  const Icon = MATERIAL_ICONS[props.name];
  return (
    <Icon
      fontSize={props.size ?? 'medium'}
      titleAccess={props.decorative ? undefined : props.label}
    />
  );
}
