# Spend Journal

A full-stack personal finance tracker for recording income and expenses and seeing where your money goes.

**Live demo:** [spend-journal.vercel.app](https://spend-journal.vercel.app) (create a free account to try it. The API runs on a free plan, so the first request after a while can take 30–60 seconds while it wakes up.)

![Spend Journal dashboard](screenshots/02-overview.png)

## Features

- **Accounts**: register and sign in with JWT access and refresh tokens. Sessions renew silently when the access token expires.
- **Transactions**: add, edit and delete income and expense entries, with a category, description and date.
- **Filtering, sorting and pagination**: filter by type, category and date range, sort by date, amount or category, and page through results.
- **Dashboard**: total balance with savings rate, income and expense totals with this month's figures, a 12-month cash-flow chart, spending by category, and recent activity.
- **CSV export**: download all your entries.
- **Daily summaries**: a cron job runs every night and saves each user's income, expense and balance for the previous day.
- **Responsive**: works on desktop and mobile.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui (Base UI), Recharts, React Router |
| Backend | Node.js, Express 5, TypeScript, TypeORM |
| Data | PostgreSQL, Redis (response caching) |
| Security | JWT access and refresh tokens, bcrypt password hashing, per-route rate limiting (`express-rate-limit`) |
| Jobs and logging | `node-cron` daily summaries, Winston logging |
| Hosting | Vercel (frontend), Render (API, PostgreSQL, Redis) |

## How it works

```
Browser ──► Vercel (React app)
              │  /api/*  forwarded by vercel.json
              ▼
            Render (Express API) ──► PostgreSQL
                                 └─► Redis
```

The frontend always calls `/api/...` on its own domain. Locally the Vite dev server forwards those calls to the API; in production Vercel does. Because of this, the API needs no CORS setup.

- **Caching**: entry lists are cached in Redis for 20 seconds. Each user has a cache version number that goes up on every create, update or delete, so stale lists are never served.
- **Rate limiting**: each route has its own limit. For example, login allows 3 attempts per 15 minutes, creating entries 30 per 15 minutes, and exports 10 per hour.

## API

All routes are under `/api/v1`. Everything except register, login and refresh needs an `Authorization: Bearer <accessToken>` header.

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Create an account (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Sign in and receive `accessToken` and `refreshToken` |
| `POST` | `/auth/refresh` | Exchange a refresh token for a new access token |
| `GET` | `/auth/me` | The signed-in user's name and email |
| `GET` | `/entries` | List entries. Query: `page`, `limit`, `type`, `category`, `startDate` + `endDate`, `sortBy` (`date` / `amount` / `category`), `sortOrder` (`ASC` / `DESC`) |
| `GET` | `/entries/:id` | Get one entry |
| `POST` | `/entries` | Create an entry (`amount`, `type`, `category`, `description`, `date`) |
| `PUT` | `/entries/:id` | Update an entry |
| `DELETE` | `/entries/:id` | Delete an entry |
| `GET` | `/summary` | Latest saved daily summary |
| `GET` | `/summary/totals` | All-time income, expense and balance |
| `GET` | `/summary/insights` | Monthly income and expense for the last 12 months, plus spending by category |
| `GET` | `/export` | Download all entries as CSV |

## Running locally

**Requirements:** Node.js 22+, PostgreSQL and Redis running locally. On macOS: `brew install postgresql@16 redis`, then `brew services start postgresql@16` and `brew services start redis`.

### 1. Backend

```bash
cd "Personal Finance Tracker-Backend"
cp .env.example .env    # then fill in the values
npm install
npm run dev             # http://localhost:3000
```

Create the database named in `DB_DATABASE` first (for example `createdb personal_finanace`). Tables are created automatically on startup.

| Variable | Purpose |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` | PostgreSQL connection |
| `DATABASE_URL` | Optional single connection string; overrides the `DB_*` values (used in production) |
| `DB_SSL` | Set to `true` for hosted databases that require SSL |
| `REDIS_HOST`, `REDIS_PORT` | Redis connection |
| `REDIS_URL` | Optional full Redis URL; overrides host and port |
| `JWT_SECRET`, `REFRESH_SECRET` | Token signing secrets (generate with `openssl rand -hex 32`) |
| `JWT_SECRET_EXPIRATION`, `REFRESH_SECRET_EXPIRATION` | Token lifetimes, e.g. `2h` and `7d` |
| `PORT` | Port to listen on (default `3000`) |

### 2. Frontend

```bash
cd "Personal Finance Tracker - Frontend"
npm install
npm run dev             # http://localhost:5173
```

## Deployment

- **API, PostgreSQL and Redis** are defined in [`render.yaml`](render.yaml). In Render, choose **New → Blueprint** and select this repo. Secrets are generated automatically.
- **Frontend** is deployed on Vercel with **Root Directory** set to `Personal Finance Tracker - Frontend`. [`vercel.json`](Personal%20Finance%20Tracker%20-%20Frontend/vercel.json) forwards `/api/*` to the Render API and serves the app for every other route.

Pushing to `main` redeploys both.

## Project structure

```
├── render.yaml                         # Render blueprint (API + PostgreSQL + Redis)
├── Personal Finance Tracker-Backend/
│   └── src/
│       ├── controller/                 # Auth, entries, summaries, export logic
│       ├── routes/                     # Express routers with rate limits
│       ├── entity/                     # TypeORM entities: User, Entries, DailySummary
│       ├── middleware/                 # JWT auth middleware
│       ├── cron/                       # Nightly daily-summary job
│       ├── config/ · utils/            # Redis, database, logger
│       └── index.ts                    # App entry point
└── Personal Finance Tracker - Frontend/
    ├── vercel.json                     # API forwarding + SPA routing
    └── src/
        ├── pages/                      # Login/Register, Overview, Transactions
        ├── components/                 # App layout, logo, entry form, shadcn/ui
        └── lib/                        # API client, auth context, formatting
```
