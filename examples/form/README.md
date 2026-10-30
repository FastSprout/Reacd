# Contact form

A required contact-name field with native validation, Save and Clear actions. The saved
message and field value stay in this application's isolated Jotai store. No server
receives the sample submission.

From the repository root:

```sh
npm ci
npm run example -- --mode form
```

Open http://127.0.0.1:5173/. [App.tsx](App.tsx) declares the form; [main.tsx](main.tsx)
mounts it through @fastsprout/reacd/bootstrap. The framework owns host HTML, field
accessibility, validation and styles.
