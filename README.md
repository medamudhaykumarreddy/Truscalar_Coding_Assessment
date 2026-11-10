# Smart Timetable & Resource Scheduling Management System

Enterprise Academic Administration Platform with native PostgreSQL database persistence, parameterized SQL queries, connection pooling, and complete Faculty Management CRUD.

---

## 1. Project Overview

The **Smart Timetable & Resource Scheduling Management System** is built for higher education institutions (universities and colleges) to eliminate lecture clashes, balance teacher workloads, respect room capacities, and manage academic resources.

### Milestone 1 Deliverables:
- **Architecture**: Single unified monorepo with dedicated `frontend/` and `backend/` directories.
- **Database**: Native PostgreSQL with SQL migrations (`backend/database/migrations/001_initial_schema.sql`), connection pool (`pg.Pool`), and idempotent SQL seeds (`001_seed_data.sql`).
- **Backend**: Node.js + Express.js + TypeScript adhering to the layer architecture:
  `Routes → Controllers → Services → Repositories → PostgreSQL`.
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Hook Form + Zod.
- **Priority 1 Feature**: 100% functional, real PostgreSQL-connected **Faculty Management CRUD** (Create, Read, Update, Delete) with live filtering, pagination, search, validation, and metrics.
- **Zero ORM Guarantee**: No Prisma, Sequelize, TypeORM, or Drizzle. Pure native SQL.

---

## 2. Mandatory Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Server State & Cache**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form with Zod Resolvers
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js v22+
- **Server**: Express.js
- **Language**: TypeScript (`tsx` execution)
- **Database Driver**: `pg` (node-postgres connection pool) + PGlite zero-config fallback
- **Validation**: Zod schema validators
- **Security**: JWT (`jsonwebtoken`) and bcrypt password hashing

### Database
- **Engine**: PostgreSQL 14+
- **Database Name**: `smart_timetable`
- **Schema**: Native SQL with foreign keys, checks, UUIDs (`gen_random_uuid()`), and indexes.

---

## 3. Repository Architecture

```text
smart-timetable-management/
├── backend/
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   ├── seeds/
│   │   │   └── 001_seed_data.sql
│   │   └── schema.sql
│   ├── src/
│   │   ├── config/             # Database pool & environment variables
│   │   ├── controllers/        # HTTP handlers & status mapping
│   │   ├── middleware/         # Zod validator & error handling
│   │   ├── repositories/       # Raw parameterized PostgreSQL SQL queries
│   │   ├── routes/             # Express API routers
│   │   ├── services/           # Domain logic & conflict checks
│   │   ├── validators/         # Zod schemas for request validation
│   │   ├── app.ts              # Express application factory
│   │   └── server.ts           # Standalone backend entry point (port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # TanStack Query custom hooks
│   │   ├── layouts/            # MainLayout (collapsible navy sidebar, top bar)
│   │   ├── pages/
│   │   │   ├── Dashboard/      # System metrics & PostgreSQL live stats
│   │   │   ├── Faculty/        # Complete Priority 1 Faculty CRUD
│   │   │   └── ...             # Milestone 2 pending screens
│   │   ├── services/           # Axios HTTP client & API endpoints
│   │   ├── types/              # TypeScript interface definitions
│   │   └── App.tsx             # React Router and QueryClientProvider
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── ARCHITECTURE.md         # Multi-tiered architectural pattern
│   ├── DATABASE_SETUP.md       # PostgreSQL installation & migrations
│   └── API_DOCUMENTATION.md    # REST API specification & schemas
├── server.ts                   # Full-stack dev runner (port 3000)
├── .env.example
├── package.json
└── README.md
```

---

## 4. Quick Start & Execution

### Option A: Standard Full-Stack Development (Recommended)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Migrations & Seeds**:
   ```bash
   npm run setup
   ```
   *(Executes `npm run db:migrate` followed by `npm run db:seed`)*

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application runs at **http://localhost:3000** with both Express `/api` backend endpoints and React Vite frontend.

### Option B: Standalone Execution (Interviewer Evaluation)

- **Backend (Port 5000)**:
  ```bash
  cd backend && npm start
  ```
- **Frontend (Port 5173)**:
  ```bash
  cd frontend && npm run dev
  ```

---

## 5. PostgreSQL Database Verification

To point to an external PostgreSQL instance, set `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_timetable
```

Verify database health anytime:
```bash
curl http://localhost:3000/api/health
```
Expected output:
```json
{
  "status": "healthy",
  "database": {
    "engine": "native_pg",
    "status": "connected"
  }
}
```

---

## 6. Verifying in Chrome DevTools Network Tab

1. Open **http://localhost:3000** in Google Chrome.
2. Open **DevTools (F12) → Network Tab → Fetch/XHR**.
3. Navigate to **Faculty**:
   - `GET /api/faculty?page=1&limit=10`
   - `GET /api/faculty/stats`
   - `GET /api/departments`
4. Click **Add Faculty**, fill in valid details, and submit:
   - `POST /api/faculty` (Payload: JSON with faculty details)
   - Inspect response: `201 Created` with PostgreSQL generated UUID and timestamps.
5. Edit the record:
   - `PUT /api/faculty/:id` (Status: `200 OK`)
6. Delete the record:
   - `DELETE /api/faculty/:id` (Status: `200 OK`)
7. Refresh the page:
   - All changes persist in the PostgreSQL database!

---

## 7. Automated Testing & Verification

Run linter / TypeScript checks:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```
