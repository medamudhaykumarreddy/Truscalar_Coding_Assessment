import { db } from '../config/database.ts';

export interface Department {
  id: string;
  code: string;
  name: string;
  building: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export class DepartmentRepository {
  async findAll(): Promise<Department[]> {
    const query = `
      SELECT 
        id, 
        code, 
        name, 
        building, 
        contact_email, 
        created_at, 
        updated_at
      FROM departments
      ORDER BY name ASC;
    `;
    const result = await db.query<Department>(query);
    return result.rows;
  }

  async findById(id: string): Promise<Department | null> {
    const query = `
      SELECT 
        id, 
        code, 
        name, 
        building, 
        contact_email, 
        created_at, 
        updated_at
      FROM departments
      WHERE id = $1;
    `;
    const result = await db.query<Department>(query, [id]);
    return result.rows[0] || null;
  }

  async findByCode(code: string): Promise<Department | null> {
    const query = `
      SELECT 
        id, 
        code, 
        name, 
        building, 
        contact_email, 
        created_at, 
        updated_at
      FROM departments
      WHERE UPPER(code) = UPPER($1);
    `;
    const result = await db.query<Department>(query, [code]);
    return result.rows[0] || null;
  }
}

export const departmentRepository = new DepartmentRepository();
