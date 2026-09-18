import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Lead, Membership, Post, Section, Tenant } from "@/db/schema";

let cachedAnon: SupabaseClient | null = null;

/** Cliente anónimo: solo ve lo que las políticas RLS marcan como público. */
export function sb(): SupabaseClient {
  if (!cachedAnon) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes("tu-proyecto")) {
      throw new Error("Supabase no configurado: faltan NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");
    }
    cachedAnon = createClient(url, key, { auth: { persistSession: false } });
  }
  return cachedAnon;
}

/**
 * Cliente con el JWT del usuario logueado (desde las cookies de sesión).
 * Las políticas RLS aplican por membresía. Sin sesión cae a anónimo,
 * y RLS bloquea cualquier escritura — falla segura.
 */
export async function sbUser(): Promise<SupabaseClient> {
  try {
    const store = await cookies();
    const sessionClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => store.getAll(),
          setAll: () => {},
        },
      },
    );
    const {
      data: { session },
    } = await sessionClient.auth.getSession();
    if (session?.access_token) {
      // Correcto: la API key SIEMPRE es la anon key; el token del usuario va
      // en Authorization para que PostgREST aplique RLS. (Pasar el access_token
      // como apikey rompe con "Invalid API key".)
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: { persistSession: false },
          global: {
            headers: { Authorization: `Bearer ${session.access_token}` },
          },
        },
      );
    }
  } catch {
    // sin contexto de request (build) o sin sesión
  }
  return sb();
}

type Row = Record<string, unknown>;

const iso = (v: unknown) => v as unknown as Date;

function mapTenant(r: Row): Tenant {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    status: r.status as string,
    plan: r.plan as string,
    theme: (r.theme ?? {}) as Tenant["theme"],
    design: (r.design ?? {}) as Tenant["design"],
    previousDesign: (r.previous_design ?? null) as Tenant["previousDesign"],
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

function mapSection(r: Row): Section {
  return {
    id: r.id as string,
    pageId: r.page_id as string,
    tenantId: r.tenant_id as string,
    type: r.type as string,
    position: r.position as number,
    visible: r.visible as boolean,
    content: (r.content ?? {}) as Section["content"],
  };
}

function mapLead(r: Row): Lead {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    name: r.name as string,
    email: r.email as string,
    message: (r.message ?? "") as string,
    createdAt: iso(r.created_at),
  };
}

function mapPost(r: Row): Post {
  return {
    id: r.id as string,
    tenantId: r.tenant_id as string,
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt ?? "") as string,
    body: (r.body ?? "") as string,
    category: (r.category ?? "") as string,
    published: r.published as boolean,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

/* ------------------------------ tenants ------------------------------ */

export async function getActiveTenantBySlug(slug: string): Promise<Tenant | null> {
  const { data, error } = await sb()
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  return data ? mapTenant(data) : null;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const { data, error } = await sb().from("tenants").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapTenant(data) : null;
}

export async function listTenants(): Promise<Tenant[]> {
  const { data, error } = await sb().from("tenants").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map(mapTenant);
}

export async function insertTenant(input: {
  name: string;
  slug: string;
  plan: string;
  theme: Tenant["theme"];
}): Promise<Tenant> {
  const { data, error } = await (await sbUser())
    .from("tenants")
    .insert({ name: input.name, slug: input.slug, plan: input.plan, theme: input.theme })
    .select("*")
    .single();
  if (error) throw error;
  return mapTenant(data);
}

export async function updateTenantStatus(
  id: string,
  status: "active" | "suspended",
): Promise<void> {
  const { error } = await (await sbUser())
    .from("tenants")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/* ------------------------------- pages ------------------------------- */

export async function getHomePagesByTenant(tenantIds: string[]): Promise<Record<string, string>> {
  if (tenantIds.length === 0) return {};
  const { data, error } = await sb()
    .from("pages")
    .select("id,tenant_id")
    .in("tenant_id", tenantIds)
    .eq("slug", "home");
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.tenant_id as string] = row.id as string;
  return map;
}

export async function getHomePageId(tenantId: string): Promise<string | null> {
  const { data, error } = await sb()
    .from("pages")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("slug", "home")
    .maybeSingle();
  if (error) throw error;
  return (data?.id as string) ?? null;
}

export async function insertHomePage(tenantId: string): Promise<string> {
  const { data, error } = await (await sbUser())
    .from("pages")
    .insert({ tenant_id: tenantId, slug: "home", title: "Inicio" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/* ------------------------------ sections ----------------------------- */

/**
 - Con sesión (panel): devuelve también las ocultas.
 - Anónimo (sitio público): RLS filtra a visibles automáticamente.
 */
export async function listSections(pageId: string, visibleOnly: boolean): Promise<Section[]> {
  const client = visibleOnly ? sb() : (await sbUser());
  let q = client.from("sections").select("*").eq("page_id", pageId);
  if (visibleOnly) q = q.eq("visible", true);
  const { data, error } = await q.order("position");
  if (error) throw error;
  return (data ?? []).map(mapSection);
}

export async function insertDefaultSections(
  rows: Array<{
    tenantId: string;
    pageId: string;
    type: string;
    position: number;
    content: Record<string, unknown>;
  }>,
): Promise<void> {
  const { error } = await (await sbUser()).from("sections").insert(
    rows.map((r) => ({
      tenant_id: r.tenantId,
      page_id: r.pageId,
      type: r.type,
      position: r.position,
      content: r.content,
    })),
  );
  if (error) throw error;
}

export async function updateSectionContent(
  sectionId: string,
  content: Record<string, unknown>,
): Promise<void> {
  const { error } = await (await sbUser()).from("sections").update({ content }).eq("id", sectionId);
  if (error) throw error;
}

export async function updateSectionVisible(sectionId: string, visible: boolean): Promise<void> {
  const { error } = await (await sbUser()).from("sections").update({ visible }).eq("id", sectionId);
  if (error) throw error;
}

export async function updateSectionPosition(sectionId: string, position: number): Promise<void> {
  const { error } = await (await sbUser()).from("sections").update({ position }).eq("id", sectionId);
  if (error) throw error;
}

export async function getSectionWithTenantSlug(
  sectionId: string,
  tenantId: string,
): Promise<{ section: Section; slug: string } | null> {
  const tenant = await getTenantById(tenantId);
  if (!tenant) return null;
  const { data, error } = await (await sbUser())
    .from("sections")
    .select("*")
    .eq("id", sectionId)
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (error) throw error;
  return data ? { section: mapSection(data), slug: tenant.slug } : null;
}

export async function listSectionPositions(
  pageId: string,
): Promise<Array<{ id: string; position: number }>> {
  const { data, error } = await (await sbUser())
    .from("sections")
    .select("id,position")
    .eq("page_id", pageId)
    .order("position");
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.id as string, position: r.position as number }));
}

/* --------------------------- tenant modules -------------------------- */

export async function getModuleStates(
  tenantId: string,
): Promise<Array<{ moduleId: string; enabled: boolean }>> {
  const { data, error } = await sb()
    .from("tenant_modules")
    .select("module_id,enabled")
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    moduleId: r.module_id as string,
    enabled: r.enabled as boolean,
  }));
}

export async function isModuleEnabled(tenantId: string, moduleId: string): Promise<boolean> {
  const states = await getModuleStates(tenantId);
  return states.some((m) => m.moduleId === moduleId && m.enabled);
}

export async function setModuleEnabled(
  tenantId: string,
  moduleId: string,
  enabled: boolean,
): Promise<void> {
  const client = await sbUser();
  const { data: existing } = await client
    .from("tenant_modules")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (existing) {
    const { error } = await client
      .from("tenant_modules")
      .update({ enabled })
      .eq("id", existing.id as string);
    if (error) throw error;
  } else {
    const { error } = await client
      .from("tenant_modules")
      .insert({ tenant_id: tenantId, module_id: moduleId, enabled });
    if (error) throw error;
  }
}

/* -------------------------------- leads ------------------------------ */

// Formulario público del sitio: insert anónimo permitido por política.
export async function insertLead(input: {
  tenantId: string;
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const { error } = await sb().from("leads").insert({
    tenant_id: input.tenantId,
    name: input.name,
    email: input.email,
    message: input.message,
  });
  if (error) throw error;
}

// Bandeja del panel: requiere sesión dueña (RLS filtra).
export async function listLeadsByTenant(tenantId: string): Promise<Lead[]> {
  const { data, error } = await (await sbUser())
    .from("leads")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapLead);
}

export async function countLeadsByTenant(tenantId: string): Promise<number> {
  const { count, error } = await (await sbUser())
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return count ?? 0;
}

export async function countLeadsByTenants(tenantIds: string[]): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  if (tenantIds.length === 0) return out;
  const { data, error } = await (await sbUser()).from("leads").select("tenant_id");
  if (error) throw error;
  for (const row of data ?? []) {
    const tid = row.tenant_id as string;
    out[tid] = (out[tid] ?? 0) + 1;
  }
  return out;
}

export async function deleteLeadById(leadId: string, tenantId: string): Promise<void> {
  const { error } = await (await sbUser())
    .from("leads")
    .delete()
    .eq("id", leadId)
    .eq("tenant_id", tenantId);
  if (error) throw error;
}

/* -------------------------------- posts ------------------------------ */

// Público: solo publicadas (RLS también lo garantiza).
export async function listPublishedPosts(tenantId: string): Promise<Post[]> {
  const { data, error } = await sb()
    .from("posts")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getPublishedPost(tenantId: string, slug: string): Promise<Post | null> {
  const { data, error } = await sb()
    .from("posts")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data) : null;
}

// Panel: incluye borradores (requiere sesión dueña).
export async function listPostsByTenant(tenantId: string): Promise<Post[]> {
  const { data, error } = await (await sbUser())
    .from("posts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function getPostById(postId: string, tenantId: string): Promise<Post | null> {
  const { data, error } = await (await sbUser())
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data) : null;
}

export async function postSlugExists(tenantId: string, slug: string): Promise<boolean> {
  const { data } = await (await sbUser())
    .from("posts")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .maybeSingle();
  return !!data;
}

export async function insertPost(input: {
  tenantId: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  published: boolean;
}): Promise<void> {
  const { error } = await (await sbUser()).from("posts").insert({
    tenant_id: input.tenantId,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    category: input.category,
    published: input.published,
  });
  if (error) throw error;
}

export async function updatePostById(
  postId: string,
  tenantId: string,
  patch: {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    category: string;
    published: boolean;
  },
): Promise<void> {
  const { error } = await (await sbUser())
    .from("posts")
    .update({
      slug: patch.slug,
      title: patch.title,
      excerpt: patch.excerpt,
      body: patch.body,
      category: patch.category,
      published: patch.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("tenant_id", tenantId);
  if (error) throw error;
}

export async function setPostPublished(
  postId: string,
  tenantId: string,
  published: boolean,
): Promise<void> {
  const { error } = await (await sbUser())
    .from("posts")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("tenant_id", tenantId);
  if (error) throw error;
}

export async function deletePostById(postId: string, tenantId: string): Promise<void> {
  const { error } = await (await sbUser())
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("tenant_id", tenantId);
  if (error) throw error;
}

/* ------------------- memberships / ownership ------------------------ */

export async function ensureAppUser(userId: string, email: string): Promise<void> {
  const client = await sbUser();
  // SELECT primero (RLS permite leer la fila propia). Evitamos upsert porque la
  // política de INSERT exige role='user' y rompería para super admin existente.
  const { data: existing } = await client
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (existing) return;

  const { error } = await client
    .from("users")
    .insert({ id: userId, email, role: "user" });
  if (error) throw error;
}

export async function listMembershipsForUser(
  userId: string,
): Promise<Array<{ tenantId: string; role: string }>> {
  const { data, error } = await (await sbUser())
    .from("memberships")
    .select("tenant_id,role")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    tenantId: r.tenant_id as string,
    role: r.role as string,
  }));
}

export async function hasMembership(userId: string, tenantId: string): Promise<boolean> {
  const { data, error } = await (await sbUser())
    .from("memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function anyOwnerExists(): Promise<boolean> {
  const { data, error } = await (await sbUser())
    .from("memberships")
    .select("id")
    .eq("role", "owner")
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function claimAllTenantsAsOwner(userId: string, email: string): Promise<void> {
  await ensureAppUser(userId, email);
  const tenants = await listTenants();
  if (tenants.length === 0) return;
  const rows = tenants.map((t) => ({
    user_id: userId,
    tenant_id: t.id,
    role: "owner",
  }));
  const { error } = await (await sbUser())
    .from("memberships")
    .upsert(rows, { onConflict: "user_id,tenant_id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function insertMembership(input: {
  userId: string;
  tenantId: string;
  role?: string;
}): Promise<void> {
  const { error } = await (await sbUser())
    .from("memberships")
    .upsert(
      {
        user_id: input.userId,
        tenant_id: input.tenantId,
        role: input.role ?? "owner",
      },
      { onConflict: "user_id,tenant_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}

/* ------------------------------- design ------------------------------ */

export async function getTenantDesignRow(
  tenantId: string,
): Promise<{
  design: Record<string, unknown>;
  previousDesign: Record<string, unknown> | null;
} | null> {
  const { data, error } = await (await sbUser())
    .from("tenants")
    .select("design,previous_design")
    .eq("id", tenantId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    design: (data.design ?? {}) as Record<string, unknown>,
    previousDesign: (data.previous_design ?? null) as Record<string, unknown> | null,
  };
}

/** Aplica un nuevo diseño guardando el actual como anterior (undo de 1 nivel). */
export async function setTenantDesign(
  tenantId: string,
  next: Record<string, unknown>,
): Promise<void> {
  const current = await getTenantDesignRow(tenantId);
  const { error } = await (await sbUser())
    .from("tenants")
    .update({
      design: next,
      previous_design: current?.design ?? {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);
  if (error) throw error;
}

/** Intercambia diseño actual <-> anterior. Devuelve false si no hay anterior. */
export async function swapTenantWithPrevious(tenantId: string): Promise<boolean> {
  const row = await getTenantDesignRow(tenantId);
  if (!row?.previousDesign || Object.keys(row.previousDesign).length === 0) return false;
  const { error } = await (await sbUser())
    .from("tenants")
    .update({
      design: row.previousDesign,
      previous_design: row.design,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);
  if (error) throw error;
  return true;
}

/* -------------------------------- roles ----------------------------- */

/** El usuario logueado es super admin (ve/gestiona todo). */
export async function isSuperUser(): Promise<boolean> {
  try {
    const { data, error } = await (await sbUser()).rpc("is_super");
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

/** Cuenta cuántos super admins existen (bootstrap del primer usuario). */
export async function countSupers(): Promise<number> {
  try {
    const { data, error } = await (await sbUser()).rpc("count_supers");
    if (error) return 0;
    return Number(data ?? 0);
  } catch {
    return 0;
  }
}

/** Promueve al primer usuario a super admin. No-op si ya existe uno. */
export async function promoteFirstUserToSuper(userId: string): Promise<boolean> {
  try {
    const { data, error } = await (await sbUser()).rpc("make_super", { p_uid: userId });
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}
