import { notFound, redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/admin-auth";
import { hasMembership, isSuperUser } from "@/db/rest";

export type AuthUser = { id: string; email: string };

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return { id: user.id, email: user.email ?? "" };
  } catch {
    return null;
  }
}

async function isMemberOrSuper(tenantId: string, userId: string): Promise<boolean> {
  if (await isSuperUser()) return true;
  return hasMembership(userId, tenantId);
}

/** Para páginas: 404 si no es dueño ni super (no revela que el sitio existe). */
export async function requireMemberOr404(tenantId: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!(await isMemberOrSuper(tenantId, user.id))) notFound();
  return user;
}

/** Para server actions: redirige al login si no es dueño ni super. */
export async function requireMemberOrRedirect(tenantId: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!(await isMemberOrSuper(tenantId, user.id))) redirect("/admin");
  return user;
}
