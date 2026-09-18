import process from "node:process";
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

await sql`
  ALTER TABLE "tenants"
    ADD COLUMN IF NOT EXISTS "design" jsonb NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS "previous_design" jsonb
`;

const cols = await sql`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'tenants' AND column_name IN ('design','previous_design')
`;
console.log(
  "Columnas de diseño:",
  cols.map((c) => c.column_name).join(", "),
);

await sql.end();
process.exit(0);
