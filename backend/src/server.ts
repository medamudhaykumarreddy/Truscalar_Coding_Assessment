import { app } from './app.ts';
import { ENV } from './config/env.ts';
import { runMigrations } from './database/migrate.ts';
import { runSeeds } from './database/seed.ts';
import { db } from './config/database.ts';

const PORT = ENV.PORT;

async function startServer() {
  try {
    console.log('[Server] Initializing database...');
    await runMigrations();
    await runSeeds();

    const server = app.listen(PORT, () => {
      console.log(`[Server] Smart Timetable Backend running on http://localhost:${PORT}`);
      console.log(`[Server] Health Check available at http://localhost:${PORT}/api/health`);
      console.log(`[Server] Database Engine: ${db.getEngineType()}`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(async () => {
        await db.end();
        console.log('[Server] Connections closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startServer();
}

export { startServer };
