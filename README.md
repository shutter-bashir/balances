# Balances

A small password-protected wallet for tracking balances on bank cards and savings jars. It's built with Next.js and can be installed to a phone's home screen.

## Screens

- `/` shows wallet folders (`frosted-folders.html`)
- `/cards` shows the bank cards (`trading-cards.html`)
- `/savings` shows savings jars (`savings-jars.html`)

Each screen is a standalone HTML file at the project root, shown full-screen by `app/html-frame.js`.

## Run locally

Requires Node 22.

```bash
npm install
npm run dev
```

Locally the app runs without a password. Balances are saved to `data/records.json`, which is gitignored.

## Deploy

Set these environment variables on the host:

| Variable | Purpose |
| --- | --- |
| `APP_PASSWORD` | Required in production. Every page and API call is locked behind it. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional. Store records in Upstash Redis (on Vercel, `KV_REST_API_*` also works). |

On Netlify, records go to Netlify Blobs automatically, so no storage variables are needed. On any other host, set the Redis variables or saving will be refused.
