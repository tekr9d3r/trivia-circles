# Circles Trivia

A trivia mini app for [Circles](https://www.aboutcircles.com/) on Gnosis Chain. Test your knowledge of Circles, Safe, Gnosis Pay, and the broader Gnosis ecosystem — with speed-based scoring and a global leaderboard.

Built by [Tekr0x.eth](https://x.com/tekr0x).

---

## Features

- **10 random questions** drawn from a pool of 20 each game
- **Speed scoring** — answer faster to earn bonus points (max 1500 pts per game)
- **Circles identity** — your Circles username and avatar pulled automatically via the SDK
- **Global leaderboard** — top scores stored in Supabase, best score per wallet shown
- **Live activity ticker** — scrolling feed of recent scores on the home screen and leaderboard
- **Mini app ready** — runs inside the Circles App iframe via `@aboutcircles/miniapp-sdk`

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | SvelteKit + TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet / Identity | `@aboutcircles/miniapp-sdk` |
| Leaderboard | Supabase |
| Deployment | Vercel |

---

## Scoring

Each correct answer scores:

```
base points (100) + speed bonus (0–50)
speed bonus = floor(timeRemaining / 30 × 50)
```

Maximum: **150 pts × 10 questions = 1500 pts**

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env template and fill in your Supabase credentials
cp .env.example .env

# Start dev server
npm run dev
```

The app runs in **mock mode** when `.env` contains placeholder values — no Supabase connection needed. It uses an in-memory leaderboard with seeded fake players so you can test the full flow locally.

---

## Environment Variables

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These are baked in at build time via SvelteKit's `$env/static/public`. After changing them in Vercel, trigger a new deployment.

---

## Supabase Schema

```sql
create table leaderboard (
  id         uuid primary key default gen_random_uuid(),
  wallet     text not null,
  username   text not null,
  avatar_url text,
  score      integer not null,
  correct    integer not null,
  created_at timestamptz default now()
);

create index on leaderboard (score desc);
```

Enable Row Level Security and add a policy allowing anonymous inserts and public reads.

---

## Deployment

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings
4. Deploy — Vercel picks up `@sveltejs/adapter-vercel` automatically

---

## Circles Mini App Registration

To list this app inside the Circles App, submit a PR to the [CirclesMiniapps repository](https://github.com/aboutcircles/CirclesMiniapps) with your app's URL and metadata in `miniapps.json`.

---

## License

MIT
