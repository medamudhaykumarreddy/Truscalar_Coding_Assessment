import { db } from '../config/database.ts';

export interface FacultyRecord {
  id: string;
  faculty_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department_id: string;
  designation: string;
  specialization: string | null;
  max_weekly_hours: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  created_at: string;
  updated_at: string;
}

export interface FacultyWithDepartment extends FacultyRecord {
  department_code: string;
  department_name: string;
  building: string | null;
}

export interface FacultyFilter {
  search?: string;
  department_id?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateFacultyInput {
  faculty_code: string;
  full_name: string;
  email: string;
  phone?: string | null;
  department_id: string;
  designation: string;
  specialization?: string | null;
  max_weekly_hours: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
}

export interface UpdateFacultyInput {
  faculty_code?: string;
  full_name?: string;
  email?: string;
  phone?: string | null;
  department_id?: string;
  designation?: string;
  specialization?: string | null;
  max_weekly_hours?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
}

export class FacultyRepository {
  async findAll(filter: FacultyFilter = {}): Promise<{ data: FacultyWithDepartment[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.search && filter.search.trim() !== '') {
      const searchTerm = `%${filter.search.trim()}%`;
      conditions.push(`(
        f.full_name ILIKE $${paramIndex} OR
        f.email ILIKE $${paramIndex} OR
        f.faculty_code ILIKE $${paramIndex} OR
        f.specialization ILIKE $${paramIndex} OR
        f.designation ILIKE $${paramIndex}
      )`);
      params.push(searchTerm);
      paramIndex++;
    }

    if (filter.department_id && filter.department_id !== 'all') {
      conditions.push(`f.department_id = $${paramIndex}`);
      params.push(filter.department_id);
      paramIndex++;
    }

    if (filter.status && filter.status !== 'all') {
      conditions.push(`f.status = $${paramIndex}`);
      params.push(filter.status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column to avoid SQL injection
    const allowedSortColumns: Record<string, string> = {
      full_name: 'f.full_name',
      faculty_code: 'f.faculty_code',
      email: 'f.email',
      department_name: 'd.name',
      max_weekly_hours: 'f.max_weekly_hours',
      status: 'f.status',
      created_at: 'f.created_at',
      updated_at: 'f.updated_at'
    };

    const sortColumn = (filter.sortBy && allowedSortColumns[filter.sortBy]) || 'f.created_at';
    const sortDirection = filter.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, Math.min(100, filter.limit || 10));
    const offset = (page - 1) * limit;

    // First get the total count for accurate pagination metadata
    const countSql = `
      SELECT COUNT(*)::int AS count
      FROM faculty f
      JOIN departments d ON f.department_id = d.id
      ${whereClause}
    `;
    const countResult = await db.query<{ count: number }>(countSql, params);
    const total = countResult.rows[0]?.count || 0;

    // Retrieve paginated records
    const dataSql = `
      SELECT 
        f.id,
        f.faculty_code,
        f.full_name,
        f.email,
        f.phone,
        f.department_id,
        f.designation,
        f.specialization,
        f.max_weekly_hours,
        f.status,
        f.created_at,
        f.updated_at,
        d.code AS department_code,
        d.name AS department_name,
        d.building
      FROM faculty f
      JOIN departments d ON f.department_id = d.id
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const result = await db.query<FacultyWithDepartment>(dataSql, params);

    return {
      data: result.rows,
      total,
    };
  }

  async findById(id: string): Promise<FacultyWithDepartment | null> {
    const query = `
      SELECT 
        f.id,
        f.faculty_code,
        f.full_name,
        f.email,
        f.phone,
        f.department_id,
        f.designation,
        f.specialization,
        f.max_weekly_hours,
        f.status,
        f.created_at,
        f.updated_at,
        d.code AS department_code,
        d.name AS department_name,
        d.building
      FROM faculty f
      JOIN departments d ON f.department_id = d.id
      WHERE f.id = $1;
    `;
    const result = await db.query<FacultyWithDepartment>(query, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string, excludeId?: string): Promise<FacultyRecord | null> {
    let query = `SELECT * FROM faculty WHERE LOWER(email) = LOWER($1)`;
    const params: any[] = [email];

    if (excludeId) {
      query += ` AND id != $2`;
      params.push(excludeId);
    }

    const result = await db.query<FacultyRecord>(query, params);
    return result.rows[0] || null;
  }

  async findByCode(faculty_code: string, excludeId?: string): Promise<FacultyRecord | null> {
    let query = `SELECT * FROM faculty WHERE UPPER(faculty_code) = UPPER($1)`;
    const params: any[] = [faculty_code];

    if (excludeId) {
      query += ` AND id != $2`;
      params.push(excludeId);
    }

    const result = await db.query<FacultyRecord>(query, params);
    return result.rows[0] || null;
  }

  async create(input: CreateFacultyInput): Promise<FacultyWithDepartment> {
    const insertSql = `
      INSERT INTO faculty (
        faculty_code,
        full_name,
        email,
        phone,
        department_id,
        designation,
        specialization,
        max_weekly_hours,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id;
    `;

    const status = input.status || 'ACTIVE';
    const params = [
      input.faculty_code.trim(),
      input.full_name.trim(),
      input.email.trim().toLowerCase(),
      input.phone?.trim() || null,
      input.department_id,
      input.designation.trim(),
      input.specialization?.trim() || null,
      input.max_weekly_hours,
      status
    ];

    const insertResult = await db.query<{ id: string }>(insertSql, params);
    const newId = insertResult.rows[0].id;

    const record = await this.findById(newId);
    if (!record) {
      throw new Error('Failed to retrieve newly created faculty member.');
    }
    return record;
  }

  async update(id: string, input: UpdateFacultyInput): Promise<FacultyWithDepartment | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const params: any[] = [id];
    let paramIndex = 2;

    if (input.faculty_code !== undefined) {
      setClauses.push(`faculty_code = $${paramIndex}`);
      params.push(input.faculty_code.trim());
      paramIndex++;
    }
    if (input.full_name !== undefined) {
      setClauses.push(`full_name = $${paramIndex}`);
      params.push(input.full_name.trim());
      paramIndex++;
    }
    if (input.email !== undefined) {
      setClauses.push(`email = $${paramIndex}`);
      params.push(input.email.trim().toLowerCase());
      paramIndex++;
    }
    if (input.phone !== undefined) {
      setClauses.push(`phone = $${paramIndex}`);
      params.push(input.phone ? input.phone.trim() : null);
      paramIndex++;
    }
    if (input.department_id !== undefined) {
      setClauses.push(`department_id = $${paramIndex}`);
      params.push(input.department_id);
      paramIndex++;
    }
    if (input.designation !== undefined) {
      setClauses.push(`designation = $${paramIndex}`);
      params.push(input.designation.trim());
      paramIndex++;
    }
    if (input.specialization !== undefined) {
      setClauses.push(`specialization = $${paramIndex}`);
      params.push(input.specialization ? input.specialization.trim() : null);
      paramIndex++;
    }
    if (input.max_weekly_hours !== undefined) {
      setClauses.push(`max_weekly_hours = $${paramIndex}`);
      params.push(input.max_weekly_hours);
      paramIndex++;
    }
    if (input.status !== undefined) {
      setClauses.push(`status = $${paramIndex}`);
      params.push(input.status);
      paramIndex++;
    }

    const updateSql = `
      UPDATE faculty
      SET ${setClauses.join(', ')}
      WHERE id = $1;
    `;

    await db.query(updateSql, params);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM faculty WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getStats(): Promise<{ total: number; active: number; inactive: number; onLeave: number }> {
    const query = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END)::int AS active,
        COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END)::int AS inactive,
        COUNT(CASE WHEN status = 'ON_LEAVE' THEN 1 END)::int AS on_leave
      FROM faculty;
    `;
    const result = await db.query<{ total: number; active: number; inactive: number; on_leave: number }>(query);
    const row = result.rows[0] || { total: 0, active: 0, inactive: 0, on_leave: 0 };
    return {
      total: row.total,
      active: row.active,
      inactive: row.inactive,
      onLeave: row.on_leave,
    };
  }
}

export const facultyRepository = new FacultyRepository();
