import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteLead } from "../../actions";
import { getTenantById, listLeadsByTenant } from "@/db/rest";
import { requireMemberOr404 } from "@/lib/auth";
import { SubmitButton } from "@/components/admin/submit-button";

export const dynamic = "force-dynamic";

export default async function TenantLeadsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tenant = await getTenantById(id);
  if (!tenant) notFound();
  await requireMemberOr404(tenant.id);

  const rows = await listLeadsByTenant(tenant.id);

  return (
    <div>
      <Link href={`/admin/tenants/${tenant.id}`} className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver a {tenant.name}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensajes recibidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Formularios de contacto enviados desde{" "}
            <span className="font-mono text-xs">{tenant.slug}.modidy.com</span>
          </p>
        </div>
        <span className="rounded-full bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700">
          {rows.length} mensaje{rows.length === 1 ? "" : "s"}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          Todavía no hay mensajes. Cuando alguien complete el formulario de contacto del sitio,
          va a aparecer acá.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm text-sky-600 hover:text-sky-500"
                  >
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-gray-400">
                    {new Date(lead.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                  <form action={deleteLead}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <input type="hidden" name="tenantId" value={tenant.id} />
                    <SubmitButton
                      title="Eliminar mensaje"
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </SubmitButton>
                  </form>
                </div>
              </div>
              {lead.message && (
                <p className="mt-3 whitespace-pre-line rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                  {lead.message}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
