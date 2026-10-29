# Private Editor codec and SDK configuration

EDITOR-CODEC-001: The closed document foundation converts to private TipTap content,
then through an actual SDK schema back to a frozen validated DTO. Conversion preserves
supported block ordering, structural ids, marks, links, code language and inline atoms.
No public prop/transport contains SDK JSON, an SDK instance or arbitrary HTML.

EDITOR-CODEC-002: External DTOs use the strict snapshot graph contract. Native SDK
persistent nodes legitimately reuse identities across positions. A separate native
budget counts each position before enqueueing or allocating projected arrays, with a
current-ancestry cycle guard. It validates owned scalar attributes, text, mark names,
link types/lengths/URLs, depth, child counts, values, aggregate characters and blocks.
Unsupported SDK kinds and invalid content fail before an application callback.

EDITOR-CODEC-003: SDK text merging does not lose valid long blocks. Projection plans
bounded chunks before allocation, preserves Unicode surrogate pairs and repeats the
validated mark/link metadata for each new DTO node without shared object references.
Code blocks retain one bounded plain string. Missing native structural ids receive
local ordered allocation without time, randomness or shared counters; duplicate
external ids remain invalid. Native editing additionally uses the separate reviewed
identity plugin for stable split/undo behavior.

EDITOR-CODEC-004: Each editor receives independent StarterKit/identity/atom extensions.
Bundled Link is configured once with autolink/link-on-paste/opening disabled. Input
rules and implicit trailing paragraphs are disabled. Owned mention/emoji atoms render
escaped text, accessible emoji names and truthful invalid-content fallbacks. Native
block attributes round-trip through trusted HTML parsing only inside SDK configuration;
the application never provides raw HTML content.

EDITOR-CODEC-005: Closed formatting/history commands check availability without moving
focus, then execute through one focused SDK chain. Unsafe links and destroyed editors
cannot run. Active state derives from the actual SDK document/selection. The browser
and controlled adapter integration are separate acceptance work.
