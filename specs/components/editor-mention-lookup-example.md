# Remote Mention runnable example

Status: approved disjoint documentation and acceptance slice. The Editor worker owns
the native remote menu. The Forms worker owns lookup schemas and correlation state.

LOOKUP-EXAMPLE-001: Provide EditorMentionLookupExample using public closed TSX and
isolated Jotai state. Clearly describe it as a local response simulator, without a
network service, artificial timers or backend claims. Start with no request and null
response. A genuine active @query requests once for each token change. Display its
opaque key, exact query and request count. Do not derive a request key in the example.

LOOKUP-EXAMPLE-002: Keep one host response atom and a separately saved response for
replay. Explicit Resolve current, Fail current, Empty current and Clear response
controls publish matching ready/error/empty/null states. New requests publish matching
loading. Save response for replay snapshots a real ready response; Replay saved
response delivers it unchanged. Disabled controls cannot publish without prerequisites.
The engine must retain accepted current results when stale host props arrive, reject
out-of-order keys and reject the first A response when a new A token follows B.

LOOKUP-EXAMPLE-003: Ready items are server-authoritative. Use a labelled fuzzy directory
match that does not contain the test query, and insert its canonical mention through
the genuine native Editor. After insertion focus returns to the document. Host edit
rejection preserves the previous document. Read-only/disabled protection blocks menu
requests and commits. App direction changes use actual provider RTL.

LOOKUP-EXAMPLE-004: Colocated acceptance exercises loading, error, empty, null, ready,
saved stale props, same-query ABA, actual insertion, rejected edits, resets, protection,
SSR hydration and independent providers. Do not mock the remote menu, editor surface
or request controller. Geometry shims in JSDOM are not native-browser proof.

LOOKUP-EXAMPLE-005: Production browser acceptance covers both templates and narrow/wide
layout, 200% text, RTL, keyboard/pointer actions, containment, accessible status/error
and current request display. The coordinator mounts the example once in the Editor
group and owns official outputs. The public reference explains request/result DTOs and
stale-response behavior. Internal specifications remain outside docs.

LOOKUP-EXAMPLE-006: Every owned executable file has 100% statements, branches,
functions and lines without exclusions or threshold changes. Keep 300 lines, 88
columns, two spaces and English. No new dependency, state kind or aggregate replacement
is required. Final combined type/build/browser verification belongs to the coordinator.

Primary references:

- https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorMentionMenu.vue
- https://tiptap.dev/docs/editor/extensions/nodes/mention
