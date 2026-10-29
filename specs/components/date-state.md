# Temporal state registration

Status: Agent B proposal implemented only in its isolated workspace. Agent A owns review
and root integration of these shared registrations.

TEMPSTATE-001: Register four distinct state kinds: date, time, dateRange and timeRange.
Use canonical schemas from the date/time foundation. Values remain JSON scalars or
readonly start/end DTOs; no Date, timezone or vendor class enters a store. Null and
partially edited ranges remain distinguishable from complete intervals.

TEMPSTATE-002: Definitions have the existing unique key and access contract. Each kind
has its own schema module. Runtime writes validate the same canonical domain as initial
values. Rejected updates are atomic and emit no accepted-value notification. Read
bindings expose no write function. Different applications and SSR requests keep
independent stores even when their keys and definitions are identical.

TEMPSTATE-003: A control registers its bounded schema as a shared state constraint. All
host, component and transactional updates obey the intersection of mounted control
constraints. Unmounting releases only that control's constraint. Requiredness remains a
submission rule; null is still a valid canonical editing state.

TEMPSTATE-004: Acceptance covers valid canonical updates, null clearing, partial range
updates, malformed or reversed values, permission failure, store isolation, subscription
notifications, reset and bound-constraint rejection. Every new executable module needs
100% statement, branch, function and line coverage. Schema and registry acceptance do
not prove segmented-field or calendar rendering correctness.
