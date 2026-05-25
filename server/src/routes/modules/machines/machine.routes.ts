import { Router, Request, Response } from 'express';
import { TuyaService } from '../../../services/tuya.service';

const router = Router();

// GET /api/machines
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const devices = await TuyaService.getDevices();
    res.json({ success: true, data: devices });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/machines/:id/schema
router.get('/:id/schema', async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceId = req.params.id as string;
    const schema = await TuyaService.getDeviceSchema(deviceId);
    res.json({ success: true, data: schema });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/machines/:id/live
router.get('/:id/live', async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceId = req.params.id as string;
    const status = await TuyaService.getDeviceStatus(deviceId);
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/machines/:id/command
router.post('/:id/command', async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceId = req.params.id as string;
    const { commands } = req.body;
    
    if (!commands || !Array.isArray(commands)) {
      res.status(400).json({ success: false, error: "Invalid commands format" });
      return;
    }

    const result = await TuyaService.sendCommand(deviceId, commands);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
