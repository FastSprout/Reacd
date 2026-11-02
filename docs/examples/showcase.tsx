import { Grid, Text, VStack } from '@fastsprout/reacd';
import { AccountCard } from './showcase/account.js';
import { BugReportCard } from './showcase/bug-report.js';
import { ConnectionCard } from './showcase/connection.js';
import { FieldsCard } from './showcase/fields.js';
import { InvitationCard } from './showcase/invitation.js';
import { MembershipCard } from './showcase/membership.js';
import { PreferencesCard } from './showcase/preferences.js';
import { ProgressCard } from './showcase/progress.js';
import { QuestionsCard } from './showcase/questions.js';
import { TasksCard } from './showcase/tasks.js';
import { TransferCard } from './showcase/transfer.js';
import { VolumeCard } from './showcase/volume.js';

import { PeopleCard } from './showcase/people.js';
import { CommandsCard } from './showcase/commands.js';
import { CalendarCard } from './showcase/calendar.js';
import { TransactionsCard } from './showcase/transactions.js';
import { VisitorsCard } from './showcase/visitors.js';
import { VerificationCard } from './showcase/verification.js';
import { RevenueCard } from './showcase/revenue.js';
import { SavingsCard } from './showcase/savings.js';
import { ShortcutsCard } from './showcase/shortcuts.js';
import { WorkspaceCard } from './showcase/workspace.js';
import { AnnouncementCard } from './showcase/announcement.js';
import { ContributorsCard } from './showcase/contributors.js';
import { LoginCard } from './showcase/login.js';
import { ChatCard } from './showcase/chat.js';

export function ShowcaseExample() {
  return (
    <VStack>
      <Text>All examples use local sample data.</Text>
      <Grid columns={4}>
        <VStack>
          <FieldsCard />
          <PeopleCard />
          <CommandsCard />
          <CalendarCard />
          <TasksCard />
          <QuestionsCard />
        </VStack>
        <VStack>
          <TransactionsCard />
          <TransferCard />
          <InvitationCard />
          <VisitorsCard />
          <RevenueCard />
          <SavingsCard />
        </VStack>
        <VStack>
          <VerificationCard />
          <BugReportCard />
          <ShortcutsCard />
          <WorkspaceCard />
          <VolumeCard />
          <MembershipCard />
        </VStack>
        <VStack>
          <ConnectionCard />
          <PreferencesCard />
          <AnnouncementCard />
          <AccountCard />
          <ContributorsCard />
          <LoginCard />
          <ChatCard />
          <ProgressCard />
        </VStack>
      </Grid>
    </VStack>
  );
}
