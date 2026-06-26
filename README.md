# psycho2

Static Hebrew RTL psychometry prep app for Campus IL PDF sources. AI-generated practice content is always labeled separately from official source-backed content.

## Large Campus IL extraction artifacts

Full PDF extraction output is intentionally kept out of normal pull requests to `main` so GitHub can render and review app changes without hitting generated-diff limits.

- The stable artifact branch is `campus-il-extraction-artifacts`.
- Normal app PRs should contain only source code, scripts, compact manifests, lightweight summaries, tests, and documentation.
- Raw extracted PDF text, giant generated indexes, duplicated `docs/data/extracted` trees, and large generated `src/officialData.js` payloads must not be committed to `main`.
- The bulk ingest workflow publishes full extraction outputs and parsed official JSON artifacts to the artifact branch.
- `docs/` is generated from source for GitHub Pages and should not duplicate raw extraction artifacts.

Run the compact app/docs build with:

```sh
npm run build:docs
```

Run the official parser after PDF discovery, fetch, and text extraction with:

```sh
npm run parse:official
```
