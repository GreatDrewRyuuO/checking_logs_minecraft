import mysql from "mysql2/promise";

const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "3306", 10),
  database: process.env.DB_NAME ?? "ultimatelogger",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  supportBigNumbers: true,
  bigNumberStrings: false,
};

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export async function query<T>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(
      sql,
      (params ?? []) as (string | number | boolean | null)[]
    );
    return rows as T[];
  } finally {
    connection.release();
  }
}

export async function queryOne<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
