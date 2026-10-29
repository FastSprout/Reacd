# Bounded plain-text clipboard projection

EDITOR-PASTE-001: buildEditorPlainPaste accepts clipboard text and a private inline/code
mode. It returns only private SDK text/hardBreak JSON nodes. Literal HTML remains text;
never call insertContent(string), parse clipboard HTML or expose SDK data publicly.
Normalize CRLF and lone CR to LF. Empty input is a successful empty fragment.

EDITOR-PASTE-002: Guard raw character count before normalization or splitting. Count
line breaks before allocating split arrays. Bound the fragment by maxInlines and the
conservative three JSON values per inline node plus its array container. Account for
projected domain field-name/type characters before materializing SDK nodes. Fragment
limits never raise the full document limits enforced by the controller/identity guard.

EDITOR-PASTE-003: Inline mode turns each LF into a hardBreak and chunks text within the
named maximum text length without separating a valid UTF16 surrogate pair. Preserve
empty lines and surrounding text. Code mode retains LF inside one text node; it rejects
text longer than the code-block string limit instead of inserting unsupported breaks.

EDITOR-PASTE-004: Rejection returns generic editor content-limit issues, no clipboard
text in diagnostics and no callbacks or partial result. The controller chooses its
native mode, inserts the validated fragment and reconciles controlled host rejection.
Acceptance uses actual SDK node construction and closed domain conversion. Browser
clipboard behavior remains a separate Editor integration requirement.
