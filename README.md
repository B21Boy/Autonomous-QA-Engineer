# Autonomous QA Engineer — Day 1

Foundation layer: Next.js (frontend) + NestJS (backend) + PostgreSQL + Redis + Prisma + Docker.

No external API is used or required for Day 1.

## What's included

```
autonomous-qa/
├── apps/
│   ├── web/   → Next.js frontend (login, register, dashboard, new project)
│   └── api/   → NestJS backend (auth, projects) + Prisma schema
├── docker-compose.yml   → PostgreSQL + Redis
└── .env.example
```

## Setup (run these on your own machine — Docker/npm need internet access)

### 1. Start PostgreSQL + Redis

```bash
cd autonomous-qa
docker compose up -d
docker compose ps   # both should show "running"
```

### 2. Set up the backend (apps/api)

```bash
cd apps/api
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

The API should now be running at `http://localhost:4000`.

### 3. Set up the frontend (apps/web)

Open a **new terminal**:

```bash
cd apps/web
cp .env.local.example .env.local
npm install
npm run dev
```

The frontend should now be running at `http://localhost:3000`.

## Test the flow

1. Go to `http://localhost:3000` → redirects to `/login`
2. Click "Register" → create an account
3. You should land on `/dashboard`
4. Click "+ New Project" → enter a name + staging URL → Create
5. Project should appear on the dashboard
6. Refresh the page → project should still be there (it's in PostgreSQL, not browser memory)
7. Open an incognito window, register a **second** user → they should see an **empty** dashboard (user isolation working)

## Notes

- Sessions use an httpOnly cookie (`session`), not `localStorage` — safer against XSS.
- Passwords are hashed with bcrypt before being stored — never stored in plain text.
- `Environment` model currently only stores `staging` — `development`/`production` can be added the same way later.
- `TestCase`, `TestRun`, `TestResult`, `Bug`, and `Artifact` models are intentionally **not** built yet — those come with the AI agent on later days.
