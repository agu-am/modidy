import Link from "next/link";
import { redirect } from "next/navigation";
import {
  countLeadsByTenants,
  countSupers,
  ensureAppUser,
  getModuleStates,
  isSuperUser,
  listMembershipsForUser,
  listTenants,
  promoteFirstUserToSuper,
} from "@/db/rest";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  try {
    return await AdminHomePageInner();
  } catch (e) {
    console.error("[dash] error:", e);
    const detail =
      e instanceof Error
        ? `${e.name}: ${e.message}\n${e.stack ?? ""}`
        : JSON.stringify(e, null, 2);
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Error al cargar el dashboard:
        <pre className="mt-2 overflow-auto whitespace-pre-wrap font-mono text-xs">
          {detail}
        </pre>
      </div>
    );
  }
}

async function AdminHomePageInner() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  await ensureAppUser(user.id, user.email);

  // Bootstrap: el PRIMER usuario de la plataforma se convierte en super admin
  // (ve y gestiona todos los sitios). Los siguientes solo ven lo suyo.
  if ((await countSupers()) === 0) {
    await promoteFirstUserToSuper(user.id);
  }

  const isSuper = await isSuperUser();

  const all = await listTenants();
  let tenants = all;
  if (!isSuper) {
    const memberships = await listMembershipsForUser(user.id);
    const ownedIds = new Set(memberships.map((m) => m.tenantId));
    tenants = all.filter((t) => ownedIds.has(t.id));
  }
  const ids = tenants.map((t) => t.id);

  const [leadsCount, ...moduleStates] = await Promise.all([
    countLeadsByTenants(ids),
    ...ids.map((id) => getModuleStates(id)),
  ]);

  const rows = tenants.map((t, i) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    status: t.status,
    modules: moduleStates[i]?.length ?? 0,
    leadsCount: leadsCount[t.id] ?? 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            Sitios
            {isSuper && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                Super admin
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {rows.length} sitio{rows.length === 1 ? "" : "s"} en la plataforma.
            {isSuper && " · ves todos los sitios."}
          </p>
        </div>
        <Link
          href="/admin/tenants/new"
          className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          + Nuevo sitio
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Todavía no hay sitios. Creá el primero con “Nuevo sitio”.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Subdominio</th>
                <th className="px-5 py-3 font-medium">Módulos</th>
                <th className="px-5 py-3 font-medium">Mensajes</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{t.name}</td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`https://${t.slug}.modidy.com`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-gray-600 hover:text-sky-600 hover:underline"
                      title={`Abrir ${t.slug}.modidy.com`}
                    >
                      {t.slug} ↗
                    </a>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{t.modules}</td>
                  <td className="px-5 py-3.5">
                    {t.leadsCount > 0 ? (
                      <Link
                        href={`/admin/tenants/${t.id}/leads`}
                        className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                      >
                        {t.leadsCount}
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {t.status === "active" ? "activo" : "suspendido"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/tenants/${t.id}`}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-500"
                    >
                      Gestionar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
