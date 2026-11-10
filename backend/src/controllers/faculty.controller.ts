import { Request, Response, NextFunction } from 'express';
import { facultyService } from '../services/faculty.service.ts';
import { FacultyQueryDto } from '../validators/faculty.validator.ts';

export class FacultyController {
  async listFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as FacultyQueryDto;
      const result = await facultyService.getFacultyList({
        search: query.search,
        department_id: query.department_id,
        status: query.status,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder as 'ASC' | 'DESC',
      });

      const page = Math.max(1, query.page || 1);
      const limit = Math.max(1, query.limit || 10);
      const totalPages = Math.ceil(result.total / limit) || 1;

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const faculty = await facultyService.getFacultyById(id);
      res.status(200).json({
        success: true,
        data: faculty,
      });
    } catch (err) {
      next(err);
    }
  }

  async createFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await facultyService.createFaculty(req.body);
      res.status(201).json({
        success: true,
        message: 'Faculty member created successfully in PostgreSQL.',
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await facultyService.updateFaculty(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Faculty member updated successfully in PostgreSQL.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await facultyService.deleteFaculty(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await facultyService.getFacultyStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const facultyController = new FacultyController();
