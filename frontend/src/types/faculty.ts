export type FacultyStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Faculty {
  id: string;
  faculty_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department_id: string;
  designation: string;
  specialization: string | null;
  max_weekly_hours: number;
  status: FacultyStatus;
  created_at: string;
  updated_at: string;
  department_code: string;
  department_name: string;
  building: string | null;
}

export interface FacultyPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FacultyListResponse {
  success: boolean;
  data: Faculty[];
  pagination: FacultyPagination;
}

export interface FacultyStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
}

export interface FacultyFilterParams {
  search?: string;
  department_id?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface FacultyFormData {
  faculty_code: string;
  full_name: string;
  email: string;
  phone?: string | null;
  department_id: string;
  designation: string;
  specialization?: string | null;
  max_weekly_hours: number;
  status: FacultyStatus;
}
