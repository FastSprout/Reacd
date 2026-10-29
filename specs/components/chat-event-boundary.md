# Chat callback event boundary

CHAT-EVENT-001: Public zero-argument chat capabilities receive exactly zero arguments.
Trusted adapters invoke them explicitly; assigning a capability directly to native
onClick leaks a React SyntheticEvent despite its declared () => void type. This rule
applies to attachment removal, message actions, transcript retry and tool decisions.

CHAT-EVENT-002: Public value/disclosure callbacks receive exactly the declared logical
payload. Base UI event details and native events remain inside the trusted adapter.
Generation action callbacks continue receiving only their declared state context.

CHAT-EVENT-003: Acceptance first demonstrates zero-argument callback failures, then
verifies exact call arguments for pointer/keyboard activation, protected controls and
Base UI disclosure changes. Preserve all existing behavior and four-category 100%
coverage. Deliver this as a separate follow-up; do not rewrite frozen original proof.
