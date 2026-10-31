import { ShadcnChoiceMark } from './choice-mark/choice-mark.js';
import type { AdapterPrimitives } from '../../shared/primitives/contract.js';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../vendor/ui/accordion.js';
import { Alert, AlertTitle, AlertDescription } from '../vendor/ui/alert.js';
import { Badge } from '../vendor/ui/badge.js';
import { Button } from '../vendor/ui/button.js';
import { Card, CardHeader, CardFooter } from '../vendor/ui/card.js';
import { Checkbox } from '../vendor/ui/checkbox.js';
import { Input } from '../vendor/ui/input.js';
import { Label } from '../vendor/ui/label.js';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '../vendor/ui/select.js';
import { Separator } from '../vendor/ui/separator.js';
import { Switch } from '../vendor/ui/switch.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../vendor/ui/tabs.js';
import { Textarea } from '../vendor/ui/textarea.js';

import { ShadcnControlSurface } from './control-surface/control-surface.js';

import { ShadcnControlOption } from './control-option/control-option.js';

import { ShadcnControlPart } from './control-part/control-part.js';

export const shadcnPrimitives: AdapterPrimitives = {
  ChoiceMark: ShadcnChoiceMark,
  ControlPart: ShadcnControlPart,
  ControlOption: ShadcnControlOption,
  ControlSurface: ShadcnControlSurface,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardHeader,
  CardFooter,
  Checkbox,
  Input,
  Label,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
};
