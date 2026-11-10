import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.ts';
import { runMigrations } from '../database/migrate.ts';
import { runSeeds } from '../database/seed.ts';

describe('Faculty Management API Integration Tests (PostgreSQL)', () => {
  let createdFacultyId: string;
  let testDepartmentId: string;

  beforeAll(async () => {
    // Ensure migrations and seed data are ready
    await runMigrations();
    await runSeeds();

    // Fetch existing department to attach new faculty
    const deptRes = await request(app).get('/api/departments');
    expect(deptRes.status).toBe(200);
    expect(deptRes.body.data.length).toBeGreaterThan(0);
    testDepartmentId = deptRes.body.data[0].id;
  });

  it('GET /api/health should verify PostgreSQL database connection', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database.status).toBe('connected');
  });

  it('GET /api/faculty should retrieve paginated faculty records with joined department data', async () => {
    const res = await request(app).get('/api/faculty?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(5);

    // Verify relations
    if (res.body.data.length > 0) {
      const first = res.body.data[0];
      expect(first).toHaveProperty('faculty_code');
      expect(first).toHaveProperty('department_name');
      expect(first).toHaveProperty('department_code');
    }
  });

  it('POST /api/faculty should insert a new faculty record into PostgreSQL', async () => {
    const testCode = `FAC-TEST-${Date.now().toString().slice(-4)}`;
    const newFaculty = {
      faculty_code: testCode,
      full_name: 'Dr. Automated Tester',
      email: `autotest-${Date.now()}@university.edu`,
      phone: '+1 (555) 019-2834',
      department_id: testDepartmentId,
      designation: 'Associate Professor',
      specialization: 'Automated Testing & Formal Verification',
      max_weekly_hours: 15,
      status: 'ACTIVE',
    };

    const res = await request(app).post('/api/faculty').send(newFaculty);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.faculty_code).toBe(testCode);
    expect(res.body.data.department_id).toBe(testDepartmentId);
    expect(res.body.data.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    createdFacultyId = res.body.data.id;
  });

  it('POST /api/faculty should reject duplicate faculty_code with 409 Conflict', async () => {
    const existing = await request(app).get(`/api/faculty/${createdFacultyId}`);
    expect(existing.status).toBe(200);

    const duplicateCode = {
      faculty_code: existing.body.data.faculty_code,
      full_name: 'Dr. Imposter',
      email: `unique-${Date.now()}@university.edu`,
      department_id: testDepartmentId,
      designation: 'Lecturer',
      max_weekly_hours: 12,
      status: 'ACTIVE',
    };

    const res = await request(app).post('/api/faculty').send(duplicateCode);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already registered');
  });

  it('POST /api/faculty should reject invalid payload without required fields', async () => {
    const invalidPayload = {
      full_name: 'Incomplete Record',
      // missing faculty_code, email, department_id, designation, max_weekly_hours
    };

    const res = await request(app).post('/api/faculty').send(invalidPayload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/faculty/:id should update faculty details and timestamps in PostgreSQL', async () => {
    const updatePayload = {
      designation: 'Full Tenured Professor',
      max_weekly_hours: 10,
      status: 'ON_LEAVE',
    };

    const res = await request(app)
      .put(`/api/faculty/${createdFacultyId}`)
      .send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.designation).toBe('Full Tenured Professor');
    expect(res.body.data.max_weekly_hours).toBe(10);
    expect(res.body.data.status).toBe('ON_LEAVE');
  });

  it('GET /api/faculty/:id should return 404 for nonexistent UUID', async () => {
    const nonexistentUUID = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/faculty/${nonexistentUUID}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/faculty/:id should delete faculty record from PostgreSQL', async () => {
    const res = await request(app).delete(`/api/faculty/${createdFacultyId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it is gone
    const verifyRes = await request(app).get(`/api/faculty/${createdFacultyId}`);
    expect(verifyRes.status).toBe(404);
  });
});
