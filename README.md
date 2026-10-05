# Smart Parking frontend

React, TypeScript, and Material UI, deployable independently from the backend. Node.js 24 is required. Shared contracts are included in `vendor/contracts`; no private npm registry or sibling repository is required.

```sh
npm ci
cp .env.example .env
npm start
```

The default API URL is `http://localhost:5050/api`. Set `REACT_APP_API_BASE_URL` to the backend URL when building for deployment. `.env.local` overrides `.env`; neither is committed.

## Vercel settings

Use the repository root, `npm run build`, and output directory `build`. `vercel.json` includes SPA rewrites so direct navigation and reloads work for nested routes. Configure `REACT_APP_API_BASE_URL=https://your-backend.example/api` in production and preview as appropriate. Ensure the backend permits this frontend origin in `CORS_ORIGINS`. The new frontend requires API v2; deploy the prepared backend first. Existing sessions must sign in again.

Checks: `npm run lint`, `npm run typecheck`, `npm run test:ci`, `npm run build`. See the [API contract](docs/API.md) and [verification notes](docs/VALIDATION.md).

Payments are simulated. No card details or real money are collected. Server data refreshes on focus, every minute, and after mutations. Shared workspace sources are synchronized into this repository using `npm run sync:repos` from the local combined workspace.
