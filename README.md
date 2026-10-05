# Next.js + Strapi Blog

A blog with a Next.js frontend and a Strapi content management backend. It includes articles, categories, a home page, and a users page.

## Project folders

- `frontend/` — Next.js website
- `backend/` — Strapi API and admin dashboard

## Run locally

Use Node.js 20 or newer. Start each folder in a separate terminal.

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`, replace the example secrets, then run:

```bash
npm run develop
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local` with:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`. In Strapi, publish content and enable the public API permissions required by the blog pages.
