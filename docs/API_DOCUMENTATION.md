# REST API Documentation
## Smart Timetable Management Backend

Base URL: `http://localhost:5000/api` (or `/api` in unified dev server)

---

### 1. Health Check

#### `GET /api/health`
Checks server uptime and verifies active PostgreSQL database connection.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "smart-timetable-backend",
  "timestamp": "2026-11-10T11:00:00.000Z",
  "uptimeSeconds": 142,
  "database": {
    "engine": "native_pg",
    "status": "connected",
    "latencyMs": 4
  }
}
```

---

### 2. Departments

#### `GET /api/departments`
Retrieves all academic departments for dropdown selects and relations.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e4b2d130-1b2c-4977-9831-417ba3f87b32",
      "code": "CSE",
      "name": "Computer Science & Engineering",
      "building": "Alan Turing Block",
      "contact_email": "cse-dept@university.edu",
      "created_at": "2026-11-10T11:00:00.000Z",
      "updated_at": "2026-11-10T11:00:00.000Z"
    }
  ],
  "count": 5
}
```

---

### 3. Faculty Management (Priority 1 CRUD)

#### `GET /api/faculty`
Lists faculty with pagination, search, sorting, and department/status filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | `""` | Filters by name, email, code, specialization, designation |
| `department_id` | string | `""` | Filters by department UUID or `"all"` |
| `status` | string | `""` | `ACTIVE`, `INACTIVE`, `ON_LEAVE`, or `"all"` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page (1 - 100) |
| `sortBy` | string | `"created_at"` | Field: `full_name`, `faculty_code`, `email`, `department_name`, `max_weekly_hours`, `status` |
| `sortOrder` | string | `"DESC"` | `ASC` or `DESC` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "7fa1bc82-9cb7-4a0b-9ef1-8a4e3fa29901",
      "faculty_code": "FAC-CSE-001",
      "full_name": "Dr. Aris Thorne",
      "email": "aris.thorne@university.edu",
      "phone": "+1 (555) 234-5678",
      "department_id": "e4b2d130-1b2c-4977-9831-417ba3f87b32",
      "designation": "Professor & HOD",
      "specialization": "Distributed Systems & Cloud Architecture",
      "max_weekly_hours": 16,
      "status": "ACTIVE",
      "created_at": "2026-11-10T11:00:00.000Z",
      "updated_at": "2026-11-10T11:00:00.000Z",
      "department_code": "CSE",
      "department_name": "Computer Science & Engineering",
      "building": "Alan Turing Block"
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### `GET /api/faculty/stats`
Returns aggregated count metrics directly from PostgreSQL.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "active": 7,
    "inactive": 0,
    "onLeave": 1
  }
}
```

#### `GET /api/faculty/:id`
Retrieves a single faculty record by UUID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "7fa1bc82-9cb7-4a0b-9ef1-8a4e3fa29901",
    "faculty_code": "FAC-CSE-001",
    "full_name": "Dr. Aris Thorne",
    "email": "aris.thorne@university.edu",
    ...
  }
}
```

#### `POST /api/faculty`
Inserts a new faculty member into PostgreSQL.

**Request Payload:**
```json
{
  "faculty_code": "FAC-CSE-004",
  "full_name": "Dr. Grace Hopper",
  "email": "grace.hopper@university.edu",
  "phone": "+1 (555) 111-2222",
  "department_id": "e4b2d130-1b2c-4977-9831-417ba3f87b32",
  "designation": "Professor",
  "specialization": "Compilers & High Performance Computing",
  "max_weekly_hours": 16,
  "status": "ACTIVE"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Faculty member created successfully in PostgreSQL.",
  "data": {
    "id": "a918e7d2-7c89-4fa2-8b43-918237461823",
    "faculty_code": "FAC-CSE-004",
    ...
  }
}
```

**Conflict Errors (409 Conflict):**
- When `email` is already registered.
- When `faculty_code` is already registered.

#### `PUT /api/faculty/:id`
Updates an existing faculty record in PostgreSQL.

**Request Payload:** (Any subset of fields)
```json
{
  "full_name": "Dr. Grace Hopper, Ph.D.",
  "max_weekly_hours": 18,
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Faculty member updated successfully in PostgreSQL.",
  "data": { ... }
}
```

#### `DELETE /api/faculty/:id`
Permanently deletes a faculty record from PostgreSQL.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Faculty member 'Dr. Grace Hopper' deleted successfully."
}
```
