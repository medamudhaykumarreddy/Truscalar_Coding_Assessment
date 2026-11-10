import { z } from 'zod';

export const createFacultySchema = z.object({
  faculty_code: z
    .string()
    .trim()
    .min(2, 'Faculty code must be at least 2 characters')
    .max(50, 'Faculty code cannot exceed 50 characters')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Faculty code can only contain letters, numbers, hyphens, and underscores'),
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(150, 'Full name cannot exceed 150 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .max(150, 'Email cannot exceed 150 characters'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone cannot exceed 30 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  department_id: z
    .string()
    .uuid('Department ID must be a valid UUID format'),
  designation: z
    .string()
    .trim()
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation cannot exceed 100 characters'),
  specialization: z
    .string()
    .trim()
    .max(150, 'Specialization cannot exceed 150 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  max_weekly_hours: z
    .coerce
    .number()
    .int('Max weekly hours must be an integer')
    .min(1, 'Max weekly hours must be at least 1')
    .max(40, 'Max weekly hours cannot exceed 40'),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE'])
    .default('ACTIVE')
});

export const updateFacultySchema = createFacultySchema.partial();

export const facultyQuerySchema = z.object({
  search: z.string().optional(),
  department_id: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['full_name', 'faculty_code', 'email', 'department_name', 'max_weekly_hours', 'status', 'created_at']).default('created_at'),
  sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).default('DESC')
});

export type CreateFacultyDto = z.infer<typeof createFacultySchema>;
export type UpdateFacultyDto = z.infer<typeof updateFacultySchema>;
export type FacultyQueryDto = z.infer<typeof facultyQuerySchema>;
