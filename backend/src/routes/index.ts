import { Router } from 'express';
import healthRoutes from './health.routes.ts';
import departmentRoutes from './department.routes.ts';
import facultyRoutes from './faculty.routes.ts';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/departments', departmentRoutes);
apiRouter.use('/faculty', facultyRoutes);

export default apiRouter;
