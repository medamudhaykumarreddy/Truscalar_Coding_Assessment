import { Router } from 'express';
import { facultyController } from '../controllers/faculty.controller.ts';
import { validateBody, validateQuery } from '../middleware/validate.ts';
import {
  createFacultySchema,
  updateFacultySchema,
  facultyQuerySchema,
} from '../validators/faculty.validator.ts';

const router = Router();

// Stats endpoint (placed before :id route)
router.get('/stats', (req, res, next) => facultyController.getStats(req, res, next));

// GET /api/faculty
router.get('/', validateQuery(facultyQuerySchema), (req, res, next) =>
  facultyController.listFaculty(req, res, next)
);

// GET /api/faculty/:id
router.get('/:id', (req, res, next) =>
  facultyController.getFaculty(req, res, next)
);

// POST /api/faculty
router.post('/', validateBody(createFacultySchema), (req, res, next) =>
  facultyController.createFaculty(req, res, next)
);

// PUT /api/faculty/:id
router.put('/:id', validateBody(updateFacultySchema), (req, res, next) =>
  facultyController.updateFaculty(req, res, next)
);

// DELETE /api/faculty/:id
router.delete('/:id', (req, res, next) =>
  facultyController.deleteFaculty(req, res, next)
);

export default router;
