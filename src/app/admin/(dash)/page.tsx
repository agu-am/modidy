import { asc, count, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { tenantModules, tenants } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const db = getDb();

  const rows = await db
    .select({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
      plan: tenants.plan,
      createdAt: tenants.createdAt,
      modules: count(tenantModules.id),
    })
    .from(tenants)
    .leftJoin(
      tenantModules,
      eq(tenantModules.tenantId, tenants.id),
    )
    .groupBy(tenants.id)
    .orderBy(asc(tenants.name));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sitios</h1>
          <p className="mt-1 text-sm text-gray-500">
            {rows.length} sitio{rows.length === 1 ? "" : "s"} en la plataforma.
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
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{t.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-600">{t.slug}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{t.modules}</td>
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
