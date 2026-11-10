# System Architecture & Technical Specifications
## Smart Timetable & Resource Scheduling Management System

### 1. High-Level Architecture Overview

The system is engineered as an enterprise-grade academic administration platform following a clean multi-tiered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 19 + TypeScript + Vite + Tailwind CSS                │
│  TanStack Query (Cache/Server State) + React Hook Form + Zod│
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routing Layer                        │
│  Express.js Routers (/api/health, /api/faculty, etc.)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Controllers Layer                         │
│  Input Extraction, HTTP Status Mapping, Response Packaging  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                          │
│  Domain Rules, Conflict Detection, Duplicate Constraints    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repositories Layer                        │
│  Raw Parameterized SQL, Type-safe Mapping, No ORMs          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Engine                          │
│  PostgreSQL (Native Connection Pool via pg / PGlite)        │
│  Database Name: smart_timetable                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Architectural Principles

1. **Zero ORM Policy**:
   - Strictly no Prisma, Sequelize, TypeORM, or Drizzle.
   - All persistence is authored in native PostgreSQL SQL.
   - SQL queries use parameterized arguments (`$1, $2, ...`) ensuring zero possibility of SQL injection.

2. **Repository Pattern**:
   - Controllers never execute raw SQL statements.
   - Database operations are encapsulated in strongly-typed repository classes (`FacultyRepository`, `DepartmentRepository`).

3. **Domain Validation**:
   - Request bodies are validated using Zod schemas at the middleware boundary.
   - Database constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) enforce relational integrity.

4. **Network Tab Transparency**:
   - No mock clients, fake delays, or LocalStorage workarounds.
   - Standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with canonical REST response codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Error`).

### 3. Authentication & RBAC Foundation

The system defines two primary roles in PostgreSQL:
- `ADMIN`: Full CRUD privileges, scheduling generation, and system configuration overrides.
- `VIEWER`: Read-only access to timetables and faculty allocations.
JWT tokens are issued with HMAC SHA-256 signatures, validated by `authenticateJWT` and `requireRole` middlewares.

### 4. Milestone Readiness

- **Milestone 1**: Complete Faculty Management CRUD with live PostgreSQL database, Department lookup, and architecture shell.
- **Milestone 2**: Subjects CRUD, Classrooms CRUD, Student Batches CRUD.
- **Milestone 3**: Backtracking Constraint Satisfaction Problem (CSP) automatic timetable generator with Minimum Remaining Values (MRV) heuristic.
