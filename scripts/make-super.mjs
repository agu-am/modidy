import process from "node:process";
import postgres from "postgres";

process.loadEnvFile(".env.local");
const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/make-super.mjs <email>");
  process.exit(1);
}

const [user] = await sql`select id from users where email = ${email}`;
if (!user) {
  console.error(`No existe usuario con email ${email}`);
  process.exit(1);
}

await sql`update users set role = 'super' where id = ${user.id}`;
console.log(`✔ ${email} ahora es super admin`);

const rows = await sql`select email, role from users order by created_at`;
console.table(rows);

await sql.end();
