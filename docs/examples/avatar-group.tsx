import { AvatarGroup } from '@fastsprout/reacd';

export function AvatarGroupExample() {
  return (
    <AvatarGroup
      label="Reviewer placeholders"
      max={2}
      items={[
        { id: 'reader', name: 'Example Reader', src: '/avatar-placeholder.svg' },
        { id: 'editor', name: 'Example Editor' },
        { id: 'reviewer', name: 'Example reviewer Alexandra Montgomery' },
        { id: 'observer', name: '👩‍💻 Example Observer' },
      ]}
    />
  );
}
