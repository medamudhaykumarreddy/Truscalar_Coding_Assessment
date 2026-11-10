import { apiClient } from './api.ts';
import { Department } from '../types/department.ts';

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const response = await apiClient.get<{ success: boolean; data: Department[] }>('/departments');
    return response.data.data;
  },

  async getById(id: string): Promise<Department> {
    const response = await apiClient.get<{ success: boolean; data: Department }>(`/departments/${id}`);
    return response.data.data;
  },
};
