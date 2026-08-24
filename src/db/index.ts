import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __modidyDb: ReturnType<typeof createDb> | undefined;
}

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL no está definida. Configura tu conexión a Supabase en .env.local",
    );
  }
  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}

export function getDb() {
  if (!globalThis.__modidyDb) {
    globalThis.__modidyDb = createDb();
  }
  return globalThis.__modidyDb;
}

export type Db = ReturnType<typeof getDb>;
