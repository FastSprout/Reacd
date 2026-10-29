# Remote Mention lookup

EditorMentionMenu can receive correlated lookup results instead of a local items list.
The host performs the lookup and returns closed data. The editor keeps its native
selection, keyboard navigation and mention insertion behavior.

```tsx
<Editor label="Notes" value={document} onValueChange={setDocument}>
  <EditorMentionMenu
    label="Directory"
    results={response}
    onQueryChange={requestLookup}
  />
</Editor>
```

The live example is a local response simulator. It makes no network request. Resolve,
Fail, Empty and Clear controls deliver real host states to the menu. Save a ready
response, change the query, then replay it to observe stale-response protection. The
host's delivered state and the menu's accepted state can differ when a response is
stale.

The remote variant requires label, results and onQueryChange. results initially equals
null. It cannot be combined with local items. disabled is optional. Public types are
EditorMentionLookupRequest, EditorMentionLookupResult and EditorMentionItem.

| Value | Required fields | Meaning |
| --- | --- | --- |
| Request | key, query | Frozen request for the active token |
| Loading result | key, query, status: loading | No selectable result yet |
| Ready result | key, query, status: ready, items | Authoritative directory matches |
| Error result | key, query, status: error, error | Accessible host error text |

Echo both key and query exactly. Keys are opaque and scoped to the native menu session.
Do not create keys from query text. A new request for A after B has a different key from
the original A request. A delayed original A response cannot satisfy the new request.
Stale props cannot replace a result already accepted for the current request. Request
callbacks run for active token changes rather than initial rendering or unrelated
response updates.

Query strings preserve whitespace and have at most 128 characters. Keys are nonempty and
bounded to 1,000 characters. Error text is trimmed, nonempty and bounded to 1,000
characters. Ready responses contain at most 100 unique items, each with a canonical id,
label and optional disabled flag. Responses contain data only; SDK objects, events,
HTML, styles and executable transport fields are rejected.

Remote ready results are authoritative and are not filtered again by substring. A
directory may return aliases, fuzzy matches or ranked results whose labels do not
contain the typed query. Selecting an enabled result inserts its canonical mention and
returns focus to the editor. Read-only and disabled editors block lookup interactions;
the host still owns response delivery and document acceptance.

Use isolated Jotai stores for separate applications and SSR requests. Cancellation of
actual network work remains the host's responsibility. Correlation prevents stale
results from being displayed; it does not abort a fetch or validate access to a remote
directory. No arbitrary suggestion renderer or SDK reference is exposed.
