import { apiClient } from './api.ts';
import {
  Faculty,
  FacultyListResponse,
  FacultyFilterParams,
  FacultyFormData,
  FacultyStats,
} from '../types/faculty.ts';

export const facultyService = {
  async getList(params: FacultyFilterParams = {}): Promise<FacultyListResponse> {
    const response = await apiClient.get<FacultyListResponse>('/faculty', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Faculty> {
    const response = await apiClient.get<{ success: boolean; data: Faculty }>(`/faculty/${id}`);
    return response.data.data;
  },

  async create(data: FacultyFormData): Promise<Faculty> {
    const response = await apiClient.post<{ success: boolean; data: Faculty; message: string }>('/faculty', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<FacultyFormData>): Promise<Faculty> {
    const response = await apiClient.put<{ success: boolean; data: Faculty; message: string }>(`/faculty/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/faculty/${id}`);
    return response.data;
  },

  async getStats(): Promise<FacultyStats> {
    const response = await apiClient.get<{ success: boolean; data: FacultyStats }>('/faculty/stats');
    return response.data.data;
  },
};
