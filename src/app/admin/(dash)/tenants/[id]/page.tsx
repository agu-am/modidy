import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionEditor } from "@/components/admin/section-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  countLeadsByTenant,
  getHomePageId,
  getModuleStates,
  getTenantById,
  listSections,
} from "@/db/rest";
import { MODULE_CATALOG } from "@/modules/registry";
import { requireMemberOr404 } from "@/lib/auth";
import { setTenantStatus, toggleModule } from "../actions";

export const dynamic = "force-dynamic";

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tenant = await getTenantById(id);
  if (!tenant) notFound();
  await requireMemberOr404(tenant.id);

  const stateByModule = new Map(
    (await getModuleStates(tenant.id)).map((s) => [s.moduleId, s.enabled]),
  );

  const leadsCount = await countLeadsByTenant(tenant.id);

  const homePageId = await getHomePageId(tenant.id);
  const siteSections = homePageId ? await listSections(homePageId, false) : [];

  const tenantId = tenant.id;

  async function onToggle(formData: FormData) {
    "use server";
    const moduleId = String(formData.get("moduleId"));
    const enabled = String(formData.get("enabled")) === "true";
    await toggleModule(tenantId, moduleId, enabled);
  }

  async function onStatus(formData: FormData) {
    "use server";
    const status = String(formData.get("status")) as "active" | "suspended";
    await setTenantStatus(tenantId, status);
  }

  return (
    <div>
      <Link href="/admin" className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver a sitios
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: tenant.theme?.primary ?? "#0ea5e9" }}
          >
            {tenant.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="font-mono text-xs text-gray-500">
              {tenant.slug}.modidy.com · plan {tenant.plan}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/tenants/${tenant.id}/leads`}
            className="rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            ✉️ Mensajes ({leadsCount})
          </Link>
          <Link
            href={`/admin/tenants/${tenant.id}/diseno`}
            className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            🎨 Diseño
          </Link>
          <Link
            href={`/admin/tenants/${tenant.id}/blog`}
            className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            📝 Blog
          </Link>
          <form action={onStatus}>
            <input type="hidden" name="status" value={tenant.status === "active" ? "suspended" : "active"} />
            <SubmitButton
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                tenant.status === "active"
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {tenant.status === "active" ? "Suspender sitio" : "Reactivar sitio"}
            </SubmitButton>
          </form>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-gray-900">Módulos</h2>
      <p className="mt-1 text-sm text-gray-500">
        Activá o desactivá funcionalidades para este sitio.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_CATALOG.map((m) => {
          const enabled = stateByModule.get(m.id) ?? false;
          return (
            <form action={onToggle} key={m.id}>
              <input type="hidden" name="moduleId" value={m.id} />
              <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
              <SubmitButton
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  enabled
                    ? "border-sky-200 bg-sky-50/60 hover:bg-sky-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xl">{m.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      enabled ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {enabled ? "activo" : "inactivo"}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{m.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{m.description}</p>
              </SubmitButton>
            </form>
          );
        })}
      </div>

      <h2 className="mt-12 text-lg font-semibold text-gray-900">Contenido del sitio</h2>
      <p className="mt-1 text-sm text-gray-500">
        Editá los textos y el orden de cada sección. Los cambios se ven al instante en{" "}
        <a
          href={`https://${tenant.slug}.modidy.com`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-sky-600 hover:underline"
        >
          {tenant.slug}.modidy.com
        </a>
        .
      </p>

      {siteSections.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Este sitio todavía no tiene secciones. Se crean automáticamente al generar la página de
          inicio.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {siteSections.map((section) => (
            <SectionEditor key={section.id} section={section} tenantId={tenant.id} />
          ))}
        </div>
      )}
      <p className="mt-8 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
        Vista previa local:{" "}
        <span className="font-mono">http://{tenant.slug}.localhost:3000</span> (agregá el slug a tu
        archivo hosts si tu navegador no resuelve *.localhost).
      </p>

    </div>
  );
}
