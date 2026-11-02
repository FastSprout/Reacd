---
reacd_example: Showcase
---

# Component showcase

Explore fields, profiles, commands, dates, transactions, charts, verification,
account settings, notifications, credentials and chat in one interactive gallery.
Every example uses local sample data. Try its controls, or change the adapter to
compare the same component declarations and state with another native SDK.

The complete gallery supports both shadcn/ui and Material UI. The selected SDK
owns its controls, calendars, charts, keyboard interaction and theme rendering.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/showcase.tsx"
```

Render `ShowcaseExample` within the provider in [Get started](../getting-started.md).

## Source modules

The [entry point](showcase.tsx) composes separate, focused cards. Each link opens
its actual compiled source; the same files supply this live gallery.

| Card | Source |
| --- | --- |
| Account settings | [account.tsx](showcase/account.tsx) |
| Product update | [announcement.tsx](showcase/announcement.tsx) |
| Bug report | [bug-report.tsx](showcase/bug-report.tsx) |
| Calendar and date entry | [calendar.tsx](showcase/calendar.tsx) |
| Chat composer | [chat.tsx](showcase/chat.tsx) |
| Quick actions | [commands.tsx](showcase/commands.tsx) |
| Bank connection | [connection.tsx](showcase/connection.tsx) |
| Contributors | [contributors.tsx](showcase/contributors.tsx) |
| Email and search | [fields.tsx](showcase/fields.tsx) |
| Team invitation | [invitation.tsx](showcase/invitation.tsx) |
| Credential form | [login.tsx](showcase/login.tsx) |
| Workspace plan | [membership.tsx](showcase/membership.tsx) |
| People | [people.tsx](showcase/people.tsx) |
| Notification preferences | [preferences.tsx](showcase/preferences.tsx) |
| Project progress | [progress.tsx](showcase/progress.tsx) |
| Questions | [questions.tsx](showcase/questions.tsx) |
| Revenue | [revenue.tsx](showcase/revenue.tsx) |
| Savings targets | [savings.tsx](showcase/savings.tsx) |
| Keyboard shortcuts | [shortcuts.tsx](showcase/shortcuts.tsx) |
| Tasks | [tasks.tsx](showcase/tasks.tsx) |
| Transactions | [transactions.tsx](showcase/transactions.tsx) |
| Transfer | [transfer.tsx](showcase/transfer.tsx) |
| Verification | [verification.tsx](showcase/verification.tsx) |
| Visitor chart | [visitors.tsx](showcase/visitors.tsx) |
| Volume | [volume.tsx](showcase/volume.tsx) |
| Workspace navigation | [workspace.tsx](showcase/workspace.tsx) |

The cards also reuse the focused [Calendar](calendar.tsx),
[InputDate](input-date.tsx), [PinInput](pin-input.tsx), and
[ChatPrompt](chat-prompt.tsx) examples.
