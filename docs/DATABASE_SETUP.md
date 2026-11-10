# Database Setup & Configuration Guide
## PostgreSQL Database: `smart_timetable`

### 1. Prerequisites

- PostgreSQL 14+ installed and running.
- `createdb` CLI or pgAdmin.

### 2. Creating the Database

Run in terminal:
```bash
createdb -U postgres smart_timetable
```
Or via psql:
```sql
CREATE DATABASE smart_timetable;
```

### 3. Environment Configuration

Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```

Set your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smart_timetable
```
Alternatively, configure individual connection parameters:
```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=YOUR_PASSWORD
PGDATABASE=smart_timetable
```

*Note: In the AI Studio container sandbox or zero-configuration environments, the application automatically activates a persistent embedded PostgreSQL engine (`@electric-sql/pglite`) storing data on disk, guaranteeing full functionality without external infrastructure.*

### 4. Running Migrations

To run the SQL migration files against PostgreSQL:
```bash
npm run db:migrate
```
This executes `backend/database/migrations/001_initial_schema.sql`, creating:
- `departments`
- `faculty`
- `users`
- Indexes on `department_id`, `status`, `faculty_code`, `email`, and `full_name`.

### 5. Running Seeds

To populate fictional departments and initial faculty records:
```bash
npm run db:seed
```
This executes `backend/database/seeds/001_seed_data.sql`. Seeding is idempotent and uses `ON CONFLICT DO NOTHING` to avoid duplicate records.

### 6. Automated One-Command Setup

Run:
```bash
npm run setup
```
This runs both `npm run db:migrate` and `npm run db:seed` in sequence.
