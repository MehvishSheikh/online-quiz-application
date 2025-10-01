## Online Quiz Application

A full‑stack quiz application with a Node.js/Express + SQLite backend and a React + Vite + TypeScript frontend. It provides a timed multiple‑choice quiz, score calculation (with optional detailed review), and a clean UI.

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite, React Router, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, SQLite3, TypeScript, Jest (tests)

### Repository Structure
```
online-quiz-application/
  be/                    # Backend (Express + SQLite + TypeScript)
    src/
      config/db.ts
      controllers/quizcontroller.ts
      routes/quizrouter.ts
      services/quizservice.ts
      utils/seedDatabase.ts
      server.ts
    quiz.db             # SQLite database file (generated/used at runtime)
    package.json
  frontend/             # Frontend (React + Vite + TS)
    src/
      services/api/api.service.ts
      components/*
      routes/AppRoutes.tsx
    package.json
  README.md             # This file
```

---

## Prerequisites
- Node.js **>= 20.19.0** (Frontend tooling like Vite 7 and React Router 7 require Node 20+)
- npm 10+

If you are on Node < 20, you may see engine warnings and dev server failures. Use a version manager (nvm, fnm, volta) to install Node 20+.

---

## Quick Start

### 1) Install dependencies
Run these in two separate terminals or sequentially:

```bash
# Backend
cd be
npm ci

# Frontend
cd ../frontend
npm ci
```

### 2) Seed the database (backend)
The backend uses SQLite and auto‑creates tables on startup. To insert initial quiz data, run:

```bash
cd be
npm run build
npm run seed
```

This creates a sample quiz titled "JavaScript Basics" with 5 questions.

### 3) Start the development servers

Backend (default port 3000):
```bash
cd be
npm run dev
```

Frontend (default Vite port 5173):
```bash
cd frontend
# point the frontend to the backend API
# PowerShell
$env:VITE_API_URL = 'http://localhost:3000/api'
npm run dev

# bash/zsh
VITE_API_URL='http://localhost:3000/api' npm run dev
```

Then open the frontend URL Vite prints (typically `http://localhost:5173`).

---

## Configuration

### Backend environment variables
- `PORT` (optional): HTTP port for Express. Default: `3000`.
- `DB_PATH` (optional): Path to SQLite DB file. Default: `./be/quiz.db` relative to project root when built, or resolved within `be`.

Create a `.env` file in `be/` if you want to override defaults, e.g.:
```env
PORT=3001
DB_PATH=D:\\data\\quiz.db
```

### Frontend environment variables
- `VITE_API_URL`: Base URL for the backend API. Default inside code: `http://localhost:3000/api`.

Set it when running locally as shown above, or add a `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Backend Overview

- `src/config/db.ts`: Initializes SQLite and creates `quizzes` and `questions` tables if they don’t exist.
- `src/utils/seedDatabase.ts`: Inserts one quiz and 5 questions.
- `src/routes/quizrouter.ts`: API routes under `/api`.
- `src/controllers/quizcontroller.ts`: Validates input, calls service layer.
- `src/services/quizservice.ts`: Fetches questions and calculates scores (with optional detailed review).
- `src/server.ts`: Express app with CORS, JSON body parsing, `/health` endpoint, graceful shutdown.

### API Endpoints
- `GET /api/quiz/:quizId/questions`
  - Response: `{ questions: Array<{ id, question_text, options: { A,B,C,D } }> }`
- `POST /api/quiz/:quizId/submit?details=true|false`
  - Body: `{ answers: Array<{ question_id: number, selected_option: 'A'|'B'|'C'|'D' }> }`
  - Response (details=false): `{ total_questions, correct_answers, score_percentage }`
  - Response (details=true): adds `details[]` with per‑question review.
- `GET /health`
  - Response: `{ status: 'ok', message: 'Quiz API is running' }`

### Scripts (backend)
- `npm run dev`: Start dev server with Nodemon (TS source).
- `npm run build`: Compile TypeScript to `dist/`.
- `npm start`: Run compiled server from `dist/server.js`.
- `npm run seed`: Seed database with sample quiz.
- `npm test`: Run Jest tests with coverage.

---

## Frontend Overview

- Entry: `frontend/src/main.tsx`, app shell in `frontend/src/App.tsx`.
- Routing: `frontend/src/routes/AppRoutes.tsx` with routes `/start`, `/quiz`, `/results`.
- API client: `frontend/src/services/api/api.service.ts` uses `VITE_API_URL` to call backend.
- Components: Quiz flow (`StartPage`, `QuizPage`, `ResultsPage`), timer, progress bar, and UI primitives.

### Scripts (frontend)
- `npm run dev`: Start Vite dev server.
- `npm run build`: Type‑check and build for production.
- `npm run preview`: Preview production build locally.

---

## Database
- SQLite file: `be/quiz.db` by default.
- Override location with `DB_PATH`.
- Tables are created automatically on backend startup. Use `npm run seed` to insert initial data.

---

## Testing (Backend)
Run Jest tests:
```bash
cd be
npm test
```

Coverage output is written to `be/coverage/`.

---

## Troubleshooting
- **Node version warnings or dev server errors**: Ensure Node **>= 20.19.0**. Many frontend dev dependencies require Node 20+.
- **CORS errors**: Backend enables CORS by default. Verify `VITE_API_URL` matches the backend address.
- **Port conflicts**: Change `PORT` (backend) or Vite port (use `--port` or env) and update `VITE_API_URL` accordingly.
- **Database not seeded / 404 for quiz**: Run `npm run seed` in `be/`. Frontend fetches quiz id `1` by default; confirm your seed created quiz `1` or adjust frontend to match.

---

## Production Build (Outline)
1) Build backend: `cd be && npm run build`
2) Build frontend: `cd ../frontend && npm run build`
3) Serve backend (`npm start`) and deploy the frontend build artifacts with your preferred static host. Configure `VITE_API_URL` accordingly.

# online-quiz-application