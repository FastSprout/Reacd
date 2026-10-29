# Editor examples and real transport acceptance

Status: examples/native transport verified in B snapshot; parent browser gate pending.
Extends EDITOR-001 through EDITOR-010 and EDITOR-GEN-001 through EDITOR-GEN-006. The
earlier transport freeze remains immutable.

EDITOR-EXAMPLE-001: Provide compiled EditorExample using only closed reacd TSX and Jotai
atoms. Show a controlled document writer, a shared read-only reader, literal
readOnly/disabled flags, scoped App direction, a host replacement and reset action, and
a host-declined edit. Count logical edit requests to demonstrate quiet initialization
and host replacements. Normal selection remains private; no application DOM operations,
HTML/CSS, styling escapes, SDK objects or custom editor instances.

EDITOR-EXAMPLE-002: Provide compiled EditorToolbarExample with a nearest Editor, closed
literal formatting/link/history commands and a disabled toolbar flag. The host owns the
canonical document. Native selection and toolbar command state stay within the trusted
adapter. Explain orphan diagnostics, editor-scope isolation, protection and safe links
in public documentation. Do not expose arbitrary command execution or render slots.

EDITOR-EXAMPLE-003: Public Editor and EditorToolbar pages document required props,
logical document data, controlled acceptance/rejection, private selection defaults,
readOnly/disabled, SSR preview and optional richDocument transport. Describe supported
formatting and safe links without claiming schema validation proves browser rendering.
Internal specs and verification remain outside docs. Parent owns navigation/demo mounts.

EDITOR-TRANSPORT-001: After parent registers the actual native adapter, test a real
GenerativeUI Editor readWrite writer and read reader sharing richDocument. Both render
initial content quietly. Native accepted edits update both; host replacements update
both without publishing an extra edit. Independent registries remain unchanged. Literal
readOnly and disabled projections reject editing and formatting. No stubbed Editor or
SDK is permitted in these acceptance tests.

EDITOR-TRANSPORT-002: Server render an initial labelled preview without SDK/browser
access or edit publication. Hydrate an independent client registry without recoverable
errors or document changes, then edit through the real native adapter and verify the
server registry remains unchanged. Normal selection is not transported or registered as
state. Test document replacement and auxiliary/toolbar rendering through real slots.

EDITOR-EXAMPLE-004: Write acceptance before example implementations. Wait for parent
registration readiness before real mounts. Require per-file 100% statement, branch,
function and line coverage for executable examples, strict TS7, no-ignore typed lint and
300-line/88-column/two-space maintained files. Coordinate native failures with the
owning worker; never patch the native surface in this scope.

EDITOR-TRANSPORT-003: Real generative Editor children render all three literal menu
nodes. Typing slash, at-sign and colon opens the corresponding native menu; choosing an
item publishes a validated heading command, mention atom or emoji atom. No mock
route/component/SDK substitutes are allowed. Direct central validation must traverse
present toolbar/children slots and accept an Editor with optional slots absent; missing
state references inside either recursive slot remain validation errors.

EDITOR-ATOMIC-001: Add a separate compiled EditorControlledExample using
atom<EditorEdit>. Its controlled Editor receives value, selection and one onEditChange
callback. Accept or reject the entire readonly edit snapshot; never update document and
selection atoms separately. Preserve the existing private-selection examples. The public
documentation explains the atomic controlled variant and its mutually exclusive callback
properties.

EDITOR-ATOMIC-002: Real acceptance initializes quietly, accepts a paragraph split and
removal with a valid matching selection, then rejects a structural edit without leaving
an invalid document/selection pair or rendering a validation diagnostic. A reset action
replaces the complete edit snapshot. Selection remains private in generative transport.
