import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import apiRouter from './backend/src/routes/index.ts';
import { errorHandler } from './backend/src/middleware/errorHandler.ts';
import { runMigrations } from './backend/src/database/migrate.ts';
import { runSeeds } from './backend/src/database/seed.ts';
import { db } from './backend/src/config/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Initialize PostgreSQL database schema & idempotent seed records
  try {
    console.log('[Applet] Verifying PostgreSQL database readiness...');
    await runMigrations();
    await runSeeds();
    console.log(`[Applet] Database ready using ${db.getEngineType()}`);
  } catch (dbErr) {
    console.error('[Applet] Database initialization warning:', dbErr);
  }

  // Mount Backend API Routes
  app.use('/api', apiRouter);

  // Development: Vite middlewares
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Applet] Full-stack Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[Applet] API Health endpoint: http://0.0.0.0:${PORT}/api/health`);
    console.log(`[Applet] Faculty API: http://0.0.0.0:${PORT}/api/faculty`);
  });

  const handleClose = async () => {
    console.log('[Applet] Closing server...');
    server.close(async () => {
      await db.end();
      process.exit(0);
    });
  };

  process.on('SIGINT', handleClose);
  process.on('SIGTERM', handleClose);
}

bootstrap().catch((err) => {
  console.error('[Applet] Fatal bootstrap failure:', err);
  process.exit(1);
});
