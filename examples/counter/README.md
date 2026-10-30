# Counter

A small controlled counter with Increment and Reset actions. Jotai stores its value
inside this application's ReacdProvider. A second application gets its own store.

From the repository root:

```sh
npm ci
npm run example -- --mode counter
```

Open http://127.0.0.1:5173/. [App.tsx](App.tsx) declares the complete interface;
[main.tsx](main.tsx) mounts it through @fastsprout/reacd/bootstrap. The framework owns
the shared host HTML and styles. Reloading starts at zero.
