# M&F — Cloudflare Worker setup

This folder contains the Cloudflare Wrangler configuration scaffold. The Worker source is intentionally not included; add your own `worker.js` here when ready.

## KV binding

- Binding name: `MF_KV`
- Namespace ID: replace `REPLACE_WITH_KV_NAMESPACE_ID` in `wrangler.jsonc` with the ID of the KV namespace created in your Cloudflare account.

The binding name is what the Worker accesses at runtime (for example, `env.MF_KV`).

## Variables

The starter non-secret variables are:

- `APP_ENV`: deployment environment (currently `production`)
- `CACHE_TTL_SECONDS`: example cache duration in seconds (currently `60`)

Change these values/names to match the Worker code. Do not put API keys, passwords, or other secrets in `vars`; add those separately as Worker secrets in Cloudflare.

## Worker entry point

The config expects the Worker source at `M&F/worker.js`. Add that file manually before deploying.

## Deploy

From this folder, after replacing the KV namespace ID and adding `worker.js`, use Wrangler to deploy:

```bash
npx wrangler deploy
```

This scaffold does not create the KV namespace in your Cloudflare account and does not deploy the Worker.
