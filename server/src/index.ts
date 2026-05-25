import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // TODO: restrict in production
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

import { TuyaService } from './services/tuya.service';
import { TelemetryService } from './services/telemetry.service';

// WebSockets & Tuya Event-Driven Polling Engine
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  let pollInterval: NodeJS.Timeout;

  socket.on('subscribe_machine', async (deviceId: string) => {
    console.log(`Client ${socket.id} subscribed to machine: ${deviceId}`);
    
    const fetchAndBroadcast = async () => {
       try {
         const rawStatus = await TuyaService.getDeviceStatus(deviceId);
         // The crucial Normalization step!
         const normalizedData = TelemetryService.normalize(rawStatus as any[], true);
         socket.emit('machine_status', normalizedData);
       } catch (error) {
         console.error("Polling error for", deviceId, error);
         // Broadcast offline state if Tuya API fails
         socket.emit('machine_status', TelemetryService.normalize([], false));
       }
    };

    // Initial fetch
    await fetchAndBroadcast();

    // Start polling every 5 seconds. 
    // Architecture Note: This is an abstraction layer. When Tuya Pulsar (Push) 
    // is integrated, we simply replace this setInterval with the Pulsar event listener.
    pollInterval = setInterval(fetchAndBroadcast, 5000);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (pollInterval) clearInterval(pollInterval);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Elenza Backend running on port ${PORT}`);
});
