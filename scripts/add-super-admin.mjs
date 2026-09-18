import process from "node:process";
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {}

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

// 1. Columna role en users (default 'user')
await sql.unsafe(
  `ALTER TABLE public."users" ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'`,
);

// 2. Funciones security-definer (evitan recursion de RLS)
await sql.unsafe(`
  CREATE OR REPLACE FUNCTION public.get_app_role() RETURNS text
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT coalesce((SELECT role FROM public.users WHERE id = auth.uid()), 'user')
  $$;
`);
await sql.unsafe(`GRANT EXECUTE ON FUNCTION public.get_app_role() TO authenticated, anon;`);

await sql.unsafe(`
  CREATE OR REPLACE FUNCTION public.is_super() RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT (SELECT role FROM public.users WHERE id = auth.uid()) = 'super'
  $$;
`);
await sql.unsafe(`GRANT EXECUTE ON FUNCTION public.is_super() TO authenticated, anon;`);

await sql.unsafe(`
  CREATE OR REPLACE FUNCTION public.count_supers() RETURNS bigint
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT count(*) FROM public.users WHERE role = 'super'
  $$;
`);
await sql.unsafe(`GRANT EXECUTE ON FUNCTION public.count_supers() TO authenticated, anon;`);

// 3. Solo el primer usuario puede volverse super (bootstrap), y sin super existente
await sql.unsafe(`
  CREATE OR REPLACE FUNCTION public.make_super(p_uid uuid) RETURNS boolean
  LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
    UPDATE public.users SET role = 'super'
    WHERE id = p_uid
      AND NOT EXISTS (SELECT 1 FROM public.users WHERE role = 'super')
    RETURNING true
  $$;
`);
await sql.unsafe(`GRANT EXECUTE ON FUNCTION public.make_super(uuid) TO authenticated;`);

// 4. Reescribir políticas con soporte is_super()
const D = (table, name) => sql.unsafe(`DROP POLICY IF EXISTS "${name}" ON public."${table}"`);

const policies = [
  // tenants
  [`tenants`, `t_update_owner`, `FOR UPDATE TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = id and m.user_id = auth.uid()) or public.is_super())`],
  // pages
  [`pages`, `p_write_owner`, `FOR ALL TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = pages.tenant_id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = pages.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  // sections
  [`sections`, `s_select_public_or_owner`, `FOR SELECT TO public USING (visible = true or exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  [`sections`, `s_write_owner`, `FOR ALL TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = sections.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  // posts
  [`posts`, `po_select_public_or_owner`, `FOR SELECT TO public USING (published = true or exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  [`posts`, `po_write_owner`, `FOR ALL TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = posts.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  // leads
  [`leads`, `l_read_owner`, `FOR SELECT TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  [`leads`, `l_update_owner`, `FOR UPDATE TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  [`leads`, `l_delete_owner`, `FOR DELETE TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = leads.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  // tenant_modules
  [`tenant_modules`, `tm_insert_owner`, `FOR INSERT TO authenticated WITH CHECK (exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  [`tenant_modules`, `tm_update_owner`, `FOR UPDATE TO authenticated USING (exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid()) or public.is_super()) WITH CHECK (exists (select 1 from memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = auth.uid()) or public.is_super())`],
  // users: insert solo como 'user', update solo manteniendo el propio rol
  [`users`, `u_insert_self`, `FOR INSERT TO authenticated WITH CHECK (id = auth.uid() AND role = 'user')`],
  [`users`, `u_update_self`, `FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = public.get_app_role())`],
];

for (const [table, name, body] of policies) {
  await D(table, name);
  await sql.unsafe(`CREATE POLICY "${name}" ON public."${table}" ${body}`);
}

const count = await sql`SELECT count(*)::int AS c FROM pg_policies WHERE schemaname = 'public'`;
console.log(`Políticas actualizadas. Total de políticas en public: ${count[0].c}`);

await sql.end();
process.exit(0);
