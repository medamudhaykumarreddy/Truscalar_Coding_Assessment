import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';
import { ENV } from './env.ts';

const { Pool } = pg;

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query<T = any>(sqlText: string, params?: any[]): Promise<QueryResult<T>>;
  release(): void;
}

export interface DatabasePool {
  query<T = any>(sqlText: string, params?: any[]): Promise<QueryResult<T>>;
  exec(sqlText: string): Promise<void>;
  connect(): Promise<DbClient>;
  getEngineType(): 'native_pg' | 'embedded_pglite';
  isConfigured(): boolean;
  end(): Promise<void>;
}

class PostgresConnectionPool implements DatabasePool {
  private pgPool: pg.Pool | null = null;
  private pgliteInstance: PGlite | null = null;
  private pgliteInitPromise: Promise<PGlite> | null = null;
  private engineType: 'native_pg' | 'embedded_pglite' = 'native_pg';
  private initialized = false;

  constructor() {
    this.setupNativePool();
  }

  private setupNativePool() {
    const hasPgConfig = Boolean(ENV.DATABASE_URL || (process.env.PGHOST && process.env.PGPASSWORD));

    if (hasPgConfig) {
      try {
        const poolConfig: pg.PoolConfig = ENV.DATABASE_URL
          ? { connectionString: ENV.DATABASE_URL }
          : {
              host: ENV.PGHOST,
              user: ENV.PGUSER,
              password: ENV.PGPASSWORD,
              database: ENV.PGDATABASE,
              port: ENV.PGPORT,
              max: 20,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 5000,
            };

        this.pgPool = new Pool(poolConfig);
        this.engineType = 'native_pg';

        this.pgPool.on('error', (err) => {
          console.error('[PostgreSQL Pool Error]: Unexpected error on idle client', err);
        });

        console.log(`[Database] Initialized PostgreSQL connection pool targeting ${ENV.DATABASE_URL ? 'DATABASE_URL' : `${ENV.PGHOST}:${ENV.PGPORT}/${ENV.PGDATABASE}`}`);
        this.initialized = true;
      } catch (err) {
        console.warn('[Database] Failed to initialize native PostgreSQL pool, activating embedded engine fallback:', err);
        this.pgPool = null;
      }
    }
  }

  private async getPGlite(): Promise<PGlite> {
    if (this.pgliteInstance) {
      return this.pgliteInstance;
    }

    if (this.pgliteInitPromise) {
      return this.pgliteInitPromise;
    }

    this.pgliteInitPromise = (async () => {
      this.engineType = 'embedded_pglite';
      const storageDir = ENV.DATA_DIR;

      try {
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        } else {
          // Remove stale lock file if left by a previously killed process
          const pidFile = path.join(storageDir, 'postmaster.pid');
          if (fs.existsSync(pidFile)) {
            try {
              fs.unlinkSync(pidFile);
              console.log('[Database] Cleared stale postmaster.pid lock file.');
            } catch {
              // ignore
            }
          }
        }

        const instance = new PGlite(storageDir);
        await instance.waitReady;
        this.pgliteInstance = instance;
        this.initialized = true;
        console.log(`[Database] Initialized persistent embedded PostgreSQL engine at: ${storageDir}`);
        return instance;
      } catch (dirErr: any) {
        console.warn(`[Database] Directory storage initialization failed (${dirErr.message}), falling back to fresh in-memory PostgreSQL engine.`);
        // Fallback to in-memory instance
        const inMemoryInstance = new PGlite();
        await inMemoryInstance.waitReady;
        this.pgliteInstance = inMemoryInstance;
        this.initialized = true;
        return inMemoryInstance;
      }
    })();

    return this.pgliteInitPromise;
  }

  public getEngineType(): 'native_pg' | 'embedded_pglite' {
    return this.engineType;
  }

  public isConfigured(): boolean {
    return this.initialized;
  }

  public async query<T = any>(sqlText: string, params: any[] = []): Promise<QueryResult<T>> {
    if (this.pgPool) {
      try {
        const result = await this.pgPool.query<any>(sqlText, params);
        return {
          rows: result.rows as T[],
          rowCount: result.rowCount ?? result.rows.length,
        };
      } catch (err: any) {
        console.warn(`[Database] Native PG query failed (${err.message}). Activating persistent engine fallback.`);
        this.pgPool = null;
      }
    }

    const pglite = await this.getPGlite();
    const res = await pglite.query<any>(sqlText, params);
    return {
      rows: res.rows as T[],
      rowCount: res.affectedRows ?? res.rows.length,
    };
  }

  public async exec(sqlText: string): Promise<void> {
    if (this.pgPool) {
      try {
        await this.pgPool.query(sqlText);
        return;
      } catch (err: any) {
        console.warn(`[Database] Native PG exec failed (${err.message}). Falling back to embedded engine.`);
        this.pgPool = null;
      }
    }

    const pglite = await this.getPGlite();
    await pglite.exec(sqlText);
  }

  public async connect(): Promise<DbClient> {
    if (this.pgPool) {
      try {
        const client = await this.pgPool.connect();
        return {
          query: async <T = any>(sqlText: string, params: any[] = []) => {
            const res = await client.query<any>(sqlText, params);
            return {
              rows: res.rows as T[],
              rowCount: res.rowCount ?? res.rows.length,
            };
          },
          release: () => client.release(),
        };
      } catch {
        this.pgPool = null;
      }
    }

    const pglite = await this.getPGlite();
    return {
      query: async <T = any>(sqlText: string, params: any[] = []) => {
        const res = await pglite.query<any>(sqlText, params);
        return {
          rows: res.rows as T[],
          rowCount: res.affectedRows ?? res.rows.length,
        };
      },
      release: () => {},
    };
  }

  public async end(): Promise<void> {
    if (this.pgPool) {
      await this.pgPool.end();
    }
    if (this.pgliteInstance) {
      try {
        await this.pgliteInstance.close();
      } catch {
        // ignore
      }
    }
  }
}

export const db: DatabasePool = new PostgresConnectionPool();
