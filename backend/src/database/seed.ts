import fs from 'fs';
import path from 'path';
import { db } from '../config/database.ts';
import { runMigrations } from './migrate.ts';

export async function runSeeds(): Promise<void> {
  console.log('[Seed] Ensuring migrations have run...');
  await runMigrations();

  console.log('[Seed] Seeding initial database records...');
  const seedPath = path.resolve(process.cwd(), 'backend/database/seeds/001_seed_data.sql');

  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found at ${seedPath}`);
  }

  const sqlContent = fs.readFileSync(seedPath, 'utf8');

  try {
    await db.exec(sqlContent);
    console.log('[Seed] Successfully executed 001_seed_data.sql');
  } catch (err: any) {
    console.error('[Seed Error]:', err);
    throw err;
  }
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeeds()
    .then(() => {
      console.log('[Seed] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Failed:', err);
      process.exit(1);
    });
}
