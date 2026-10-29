import { FieldGroup } from '../src/components/field-group/index.js';
import { Text } from '../src/components/text/index.js';
import { Tree } from '../src/components/tree/index.js';

export const STRUCTURE_EXAMPLES = {
  FieldGroup: (
    <FieldGroup label="Example controls">
      <Text>Grouped content</Text>
    </FieldGroup>
  ),
  Tree: (
    <Tree
      label="Files"
      items={[{ id: 'file', label: 'File' }]}
      value={[]}
      expanded={[]}
      onValueChange={() => undefined}
      onExpandedChange={() => undefined}
    />
  ),
};
