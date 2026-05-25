import { Router } from 'express';
import machineRoutes from './modules/machines/machine.routes';

const router = Router();

router.use('/machines', machineRoutes);

export default router;
