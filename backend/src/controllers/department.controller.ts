import { Request, Response, NextFunction } from 'express';
import { departmentService } from '../services/department.service.ts';

export class DepartmentController {
  async listDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await departmentService.getAllDepartments();
      res.status(200).json({
        success: true,
        data: departments,
        count: departments.length,
      });
    } catch (err) {
      next(err);
    }
  }

  async getDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dept = await departmentService.getDepartmentById(id);
      if (!dept) {
        return res.status(404).json({
          success: false,
          error: `Department with ID '${id}' not found.`,
        });
      }
      res.status(200).json({
        success: true,
        data: dept,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const departmentController = new DepartmentController();
