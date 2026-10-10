# Review browser checks

Run from the repo root with Playwright installed and Chrome at `/usr/bin/google-chrome`:

```
npm run build
node scripts/audit/review-browser.cjs
```

The script starts/stops its own Vite preview, seeds fictional browser-local data only in fresh browser contexts, checks nine routes at 320/390/1280, checks sketch focus, plan save/reload/storage failure, and pin save/reload. Screenshots go to `/downloads`. It does not touch user data, production, or accounts. These are bounded Chrome checks, not full cross-browser certification.

For review hosting use `npm run build:review` and deploy `dist-review`, never raw `dist`. It removes analytics and adds robots/header noindex without changing the normal production build.
