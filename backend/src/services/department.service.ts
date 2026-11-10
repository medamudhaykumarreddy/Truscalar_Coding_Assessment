import { departmentRepository } from '../repositories/department.repository.ts';

export class DepartmentService {
  async getAllDepartments() {
    return await departmentRepository.findAll();
  }

  async getDepartmentById(id: string) {
    return await departmentRepository.findById(id);
  }
}

export const departmentService = new DepartmentService();
