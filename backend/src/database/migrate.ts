import fs from 'fs';
import path from 'path';
import { db } from '../config/database.ts';

export async function runMigrations(): Promise<void> {
  console.log('[Migration] Starting database migration...');
  const migrationPath = path.resolve(process.cwd(), 'backend/database/migrations/001_initial_schema.sql');
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found at ${migrationPath}`);
  }

  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  // Execute migration in a single batch
  try {
    await db.exec(sqlContent);
    console.log('[Migration] Successfully executed 001_initial_schema.sql');
  } catch (err: any) {
    console.error('[Migration Error]:', err);
    throw err;
  }
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  runMigrations()
    .then(() => {
      console.log('[Migration] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migration] Failed:', err);
      process.exit(1);
    });
}
