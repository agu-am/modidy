import process from "node:process";
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

// RLS en todas las tablas. El acceso del backend usa el JWT del usuario
// (rest.ts -> sbUser()), y el sitio público lee solo lo público vía políticas
// de lectura. Sin service_role en el cliente.

const TABLES = ["tenants","pages","sections","posts","leads","users","memberships","modules","tenant_modules"];

for (const t of TABLES) {
  await sql.unsafe(`ALTER TABLE public."${t}" ENABLE ROW LEVEL SECURITY`);
  await sql.unsafe(`ALTER TABLE public."${t}" FORCE ROW LEVEL SECURITY`);
}

const P = [
  // ---- tenants ----
  [`tenants`, `t_select_public`, `select`, `true`],
  [`tenants`, `t_insert_authed`, `insert`, `auth.uid() is not null`, `auth.uid() is not null`],
  [`tenants`, `t_update_owner`, `update`,
    `exists (select 1 from memberships m where m.tenant_id = id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = id and m.user_id = auth.uid())`],

  // ---- pages ----
  [`pages`, `p_select_public`, `select`, `true`],
  [`pages`, `p_write_owner`, `all`,
    `exists (select 1 from memberships m where m.tenant_id = pages.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = pages.tenant_id and m.user_id = auth.uid())`],

  // ---- sections ----
  [`sections`, `s_select_public_or_owner`, `select`,
    `visible = true or exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid())`],
  [`sections`, `s_write_owner`, `all`,
    `exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid())`],

  // ---- posts ----
  [`posts`, `po_select_public_or_owner`, `select`,
    `published = true or exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid())`],
  [`posts`, `po_write_owner`, `all`,
    `exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid())`],

  // ---- leads: formulario público inserta; solo el dueño lee/gestiona ----
  [`leads`, `l_insert_public`, `insert`, `true`, `true`],
  [`leads`, `l_read_owner`, `select`,
    `exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid())`],
  [`leads`, `l_update_owner`, `update`,
    `exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid())`],
  [`leads`, `l_delete_owner`, `delete`,
    `exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid())`],

  // ---- users (fila propia) ----
  [`users`, `u_select_self`, `select`, `id = auth.uid()`],
  [`users`, `u_insert_self`, `insert`, `id = auth.uid()`, `id = auth.uid()`],
  [`users`, `u_update_self`, `update`, `id = auth.uid()`, `id = auth.uid()`],

  // ---- memberships: solo propias; un usuario se agrega a sí mismo ----
  [`memberships`, `m_select_own`, `select`, `user_id = auth.uid()`],
  [`memberships`, `m_insert_self`, `insert`, `user_id = auth.uid()`, `user_id = auth.uid()`],

  // ---- catálogo de módulos: lectura pública ----
  [`modules`, `mod_select_public`, `select`, `true`],

  // ---- tenant_modules: estado legible (gating público), escritura por dueño ----
  [`tenant_modules`, `tm_select_public`, `select`, `true`],
  [`tenant_modules`, `tm_insert_owner`, `insert`,
    `exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid())`],
  [`tenant_modules`, `tm_update_owner`, `update`,
    `exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid())`,
    `exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid())`],
];

let created = 0;
for (const [table, name, cmd, using, withCheck] of P) {
  await sql.unsafe(`DROP POLICY IF EXISTS "${name}" ON public."${table}"`);
  let stmt = "";
  if (cmd === "all") {
    stmt = `CREATE POLICY "${name}" ON public."${table}" FOR ALL TO authenticated USING (${using}) WITH CHECK (${withCheck ?? using})`;
  } else {
    stmt = `CREATE POLICY "${name}" ON public."${table}" FOR ${cmd.toUpperCase()} TO ${
      cmd === "insert" || cmd.includes("owner") ? "authenticated" : "public"
    }${cmd === "insert" ? ` WITH CHECK (${withCheck})` : cmd !== "delete" ? ` USING (${using})` : ""}`;
    if (cmd === "delete") stmt = `CREATE POLICY "${name}" ON public."${table}" FOR DELETE TO authenticated USING (${using})`;
    if (cmd === "update" && !stmt.includes("TO authenticated")) {
      stmt = `CREATE POLICY "${name}" ON public."${table}" FOR UPDATE TO authenticated USING (${using}) WITH CHECK (${withCheck ?? using})`;
    }
  }
  await sql.unsafe(stmt);
  created++;
}

const audit = await sql`
  SELECT c.relname AS table_name, c.relrowsecurity AS rls
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
`;
console.log("RLS:", audit.map((a) => `${a.table_name}=${a.rls}`).join(" | "));
console.log(`Políticas creadas: ${created}`);

await sql.end();
process.exit(0);
