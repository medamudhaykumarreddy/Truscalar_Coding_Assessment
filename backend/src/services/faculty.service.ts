import { facultyRepository, FacultyFilter, CreateFacultyInput, UpdateFacultyInput } from '../repositories/faculty.repository.ts';
import { departmentRepository } from '../repositories/department.repository.ts';

export class AppError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class FacultyService {
  async getFacultyList(filter: FacultyFilter) {
    return await facultyRepository.findAll(filter);
  }

  async getFacultyById(id: string) {
    this.validateUUID(id);
    const faculty = await facultyRepository.findById(id);
    if (!faculty) {
      throw new AppError(`Faculty member with ID '${id}' not found`, 404);
    }
    return faculty;
  }

  async createFaculty(input: CreateFacultyInput) {
    // 1. Verify Department exists
    const department = await departmentRepository.findById(input.department_id);
    if (!department) {
      throw new AppError(`Selected Department ID '${input.department_id}' does not exist`, 400);
    }

    // 2. Validate uniqueness of faculty_code
    const existingCode = await facultyRepository.findByCode(input.faculty_code);
    if (existingCode) {
      throw new AppError(`Faculty Code '${input.faculty_code}' is already registered`, 409, { field: 'faculty_code' });
    }

    // 3. Validate uniqueness of email
    const existingEmail = await facultyRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new AppError(`Email address '${input.email}' is already in use by another faculty member`, 409, { field: 'email' });
    }

    // 4. Create in PostgreSQL
    return await facultyRepository.create(input);
  }

  async updateFaculty(id: string, input: UpdateFacultyInput) {
    this.validateUUID(id);

    // 1. Ensure record exists
    const existing = await facultyRepository.findById(id);
    if (!existing) {
      throw new AppError(`Faculty member with ID '${id}' not found`, 404);
    }

    // 2. If department_id is being updated, verify department exists
    if (input.department_id) {
      const department = await departmentRepository.findById(input.department_id);
      if (!department) {
        throw new AppError(`Selected Department ID '${input.department_id}' does not exist`, 400);
      }
    }

    // 3. If faculty_code is being updated, verify uniqueness
    if (input.faculty_code && input.faculty_code.toUpperCase() !== existing.faculty_code.toUpperCase()) {
      const existingCode = await facultyRepository.findByCode(input.faculty_code, id);
      if (existingCode) {
        throw new AppError(`Faculty Code '${input.faculty_code}' is already registered to another faculty member`, 409, { field: 'faculty_code' });
      }
    }

    // 4. If email is being updated, verify uniqueness
    if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
      const existingEmail = await facultyRepository.findByEmail(input.email, id);
      if (existingEmail) {
        throw new AppError(`Email address '${input.email}' is already in use by another faculty member`, 409, { field: 'email' });
      }
    }

    // 5. Update record
    const updated = await facultyRepository.update(id, input);
    if (!updated) {
      throw new AppError(`Failed to update faculty member with ID '${id}'`, 500);
    }
    return updated;
  }

  async deleteFaculty(id: string) {
    this.validateUUID(id);

    const existing = await facultyRepository.findById(id);
    if (!existing) {
      throw new AppError(`Faculty member with ID '${id}' not found`, 404);
    }

    const deleted = await facultyRepository.delete(id);
    if (!deleted) {
      throw new AppError(`Could not delete faculty member with ID '${id}'`, 500);
    }

    return { success: true, message: `Faculty member '${existing.full_name}' deleted successfully.` };
  }

  async getFacultyStats() {
    return await facultyRepository.getStats();
  }

  private validateUUID(id: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new AppError(`Invalid UUID identifier format: '${id}'`, 400);
    }
  }
}

export const facultyService = new FacultyService();
