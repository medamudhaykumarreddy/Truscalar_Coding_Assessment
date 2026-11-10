import { Router } from 'express';
import { departmentController } from '../controllers/department.controller.ts';

const router = Router();

router.get('/', (req, res, next) => departmentController.listDepartments(req, res, next));
router.get('/:id', (req, res, next) => departmentController.getDepartment(req, res, next));

export default router;
