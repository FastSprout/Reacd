# State key boundary

STATE-KEY-001: State keys use the declared ASCII identifier alphabet for their entire
value. A terminal LF, CR, CRLF, Unicode line or paragraph separator is invalid.
Never silently trim keys or enable multiline matching for this identifier.

STATE-KEY-002: The same strict key boundary applies to definitions, bindings and Editor
block ids that reuse stateKeySchema. Existing valid keys, length limits, arbitrary text
and component-specific row-id contracts remain unchanged. Exported JSON Schema must
reject the same terminal characters as the in-memory validator.

Verification finding: the original non-multiline ECMAScript expression already rejects
these endings. The regression tests confirm existing behavior in Zod and AJV; they are
not evidence of a pre-existing JavaScript bug or a runtime correction.
