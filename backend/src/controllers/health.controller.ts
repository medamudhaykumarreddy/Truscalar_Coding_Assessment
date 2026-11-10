import { Request, Response } from 'express';
import { db } from '../config/database.ts';

export class HealthController {
  async checkHealth(req: Request, res: Response) {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let latencyMs = 0;
    let engine = db.getEngineType();

    try {
      await db.query('SELECT 1 AS healthcheck;');
      latencyMs = Date.now() - startTime;
      dbStatus = 'connected';
    } catch (err: any) {
      dbStatus = `error: ${err.message}`;
    }

    const isHealthy = dbStatus === 'connected';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'smart-timetable-backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        engine,
        status: dbStatus,
        latencyMs,
      },
    });
  }
}

export const healthController = new HealthController();
