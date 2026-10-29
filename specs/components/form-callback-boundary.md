# Form callback boundary

FORM-CALLBACK-001: Public form callbacks receive exactly their declared logical
arguments. Do not forward DOM events or vendor event-details objects, even when a
callback accepting fewer arguments happens to type-check against the SDK contract. Wrap
callbacks explicitly at the trusted adapter boundary. Promise/result behavior remains
host-owned; this rule does not synthesize extra callback invocations.

FORM-CALLBACK-002: Existing Toggle and Select compatibility adapters must also honor
this boundary. Exercise SDK-shaped callbacks with a second details argument to prevent
future vendor upgrades from widening the application API. Assert real Base UI
InputNumber/CheckboxGroup and Radix Rating interactions deliver one logical argument.
Keep previously frozen date/time batches immutable when no defect is found there.
