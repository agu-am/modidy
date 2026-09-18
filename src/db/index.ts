import { drizzle } from "drizzle-orm/postgres-js";
import postgresNode from "postgres";
// @ts-expect-error entrada especifica de postgres para workerd (usa cloudflare:sockets)
import postgresWorkerd from "postgres/cf/src/index.js";
import { getCloudflareContext, getDeploymentId } from "@opennextjs/cloudflare";
import * as schema from "./schema";

type DbClient = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __modidyDbCache: Record<string, DbClient> | undefined;
  var __modidyDbHost: string | undefined;
}

function isWorkers(): boolean {
  return (
    typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
  );
}

function resolveConnectionString(): string {
  const fallback = process.env.DATABASE_URL;

  // EXPERIMENTO: probar driver node + SSL directo contra Supabase en el edge.
  // Si funciona, Hyperdrive queda como opcion y no necesidad.
  void isWorkers;

  if (!fallback) {
    throw new Error(
      "DATABASE_URL no está definida. Configura tu conexión a Supabase en .env.local",
    );
  }
  return fallback;
}

function createDb(): DbClient {
  const url = resolveConnectionString();
  try {
    globalThis.__modidyDbHost = new URL(url).host;
  } catch {}
  // Driver Node en ambos runtimes. En Workers via nodejs_compat:
  // SSL explicito contra Supabase pooler (el shim de TLS del edge es confiable;
  // la emulacion local de workerd en Windows no lo es).
  const client = postgresNode(url, {
    prepare: false,
    ssl: isWorkers() ? "require" : false,
    max: 1,
    connect_timeout: 8,
    idle_timeout: 10,
  });

  return drizzle(client, { schema });
}

// La cache se indexa por deployment para que un deploy nuevo nunca
// reutilize clientes creados por codigo viejo en isolates tibios.
export function getDb(): DbClient {
  const key = `${isWorkers() ? "cf" : "node"}:${safeDeploymentId()}`;
  const g = globalThis as unknown as { __modidyDbCache?: Record<string, DbClient> };
  if (!g.__modidyDbCache) g.__modidyDbCache = {};
  if (!g.__modidyDbCache[key]) {
    g.__modidyDbCache[key] = createDb();
  }
  return g.__modidyDbCache[key];
}

function safeDeploymentId(): string {
  try {
    return getDeploymentId() ?? "sin-deployment";
  } catch {
    return "sin-contexto";
  }
}

export type Db = DbClient;
