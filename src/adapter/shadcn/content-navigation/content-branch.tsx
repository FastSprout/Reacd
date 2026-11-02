import type { ContentNavigationItem } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import type { ContentNavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-navigation/index.js';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../vendor/ui/accordion.js';
import { ShadcnContentLink } from './content-link.js';

interface ContentBranchProps {
  readonly item: ContentNavigationItem;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly currentKey?: string | undefined;
  readonly onCurrentChange?: ContentNavigationProps['onCurrentChange'];
}

export function ShadcnContentBranch({
  item,
  disabled,
  readOnly,
  currentKey,
  onCurrentChange,
}: ContentBranchProps) {
  const blocked = disabled || item.disabled === true;
  const link = (
    <ShadcnContentLink
      item={item}
      disabled={blocked}
      currentKey={currentKey}
      onCurrentChange={onCurrentChange}
    />
  );
  return item.children ? (
    <AccordionItem value={item.key} disabled={blocked || readOnly}>
      <AccordionTrigger>{item.label}</AccordionTrigger>
      <AccordionContent>
        {item.href !== undefined && link}
        {item.children.map((child) => (
          <ShadcnContentBranch
            key={child.key}
            item={child}
            disabled={blocked}
            readOnly={readOnly}
            currentKey={currentKey}
            onCurrentChange={onCurrentChange}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  ) : link;
}
