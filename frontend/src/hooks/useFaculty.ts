import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService } from '../services/faculty.service.ts';
import { departmentService } from '../services/department.service.ts';
import { FacultyFilterParams, FacultyFormData } from '../types/faculty.ts';

export const FACULTY_QUERY_KEY = 'faculty';
export const FACULTY_STATS_KEY = 'faculty_stats';
export const DEPARTMENTS_QUERY_KEY = 'departments';

export function useFacultyList(params: FacultyFilterParams) {
  return useQuery({
    queryKey: [FACULTY_QUERY_KEY, params],
    queryFn: () => facultyService.getList(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useFacultyStats() {
  return useQuery({
    queryKey: [FACULTY_STATS_KEY],
    queryFn: () => facultyService.getStats(),
    staleTime: 1000 * 30,
  });
}

export function useFacultyDetail(id: string | null) {
  return useQuery({
    queryKey: [FACULTY_QUERY_KEY, id],
    queryFn: () => (id ? facultyService.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY],
    queryFn: () => departmentService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacultyFormData) => facultyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FACULTY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FACULTY_STATS_KEY] });
    },
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FacultyFormData> }) =>
      facultyService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [FACULTY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FACULTY_STATS_KEY] });
      queryClient.invalidateQueries({ queryKey: [FACULTY_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facultyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FACULTY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FACULTY_STATS_KEY] });
    },
  });
}
