import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTenantById,
  getTenantDesignRow,
} from "@/db/rest";
import { requireMemberOr404 } from "@/lib/auth";
import { fontLinks, PRESETS, resolveDesign } from "@/lib/designs";
import { SubmitButton } from "@/components/admin/submit-button";
import { applyPreset, applyRandom, undoDesign } from "./actions";

export const dynamic = "force-dynamic";

function Swatches({ design }: { design: ReturnType<typeof resolveDesign> }) {
  return (
    <div className="flex items-center gap-1.5">
      {[design.bg, design.surface, design.primary, design.fg].map((c, i) => (
        <span
          key={i}
          className="inline-block h-5 w-5 rounded-full border border-black/10"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export default async function DesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const tenant = await getTenantById(id);
  if (!tenant) notFound();
  await requireMemberOr404(tenant.id);

  const row = await getTenantDesignRow(tenant.id);
  const current = resolveDesign(row?.design, tenant.theme?.primary);
  const hasPrevious = !!row?.previousDesign && Object.keys(row.previousDesign).length > 0;

  return (
    <div>
      {fontLinks([current, ...PRESETS]).map((l) => (
        <link key={l.href} rel="stylesheet" href={l.href} />
      ))}

      <Link href={`/admin/tenants/${tenant.id}`} className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver a {tenant.name}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎨 Diseño</h1>
          <p className="mt-1 text-sm text-gray-500">
            Elegí el estilo de <span className="font-medium">{tenant.name}</span>. Se aplica al
            instante en <span className="font-mono text-xs">{tenant.slug}.modidy.com</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={undoDesign}>
            <input type="hidden" name="tenantId" value={tenant.id} />
            <SubmitButton
              disabled={!hasPrevious}
              title={hasPrevious ? "Volver al diseño anterior" : "No hay un diseño anterior"}
              className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ↩︎ Volver al anterior
            </SubmitButton>
          </form>
          <form action={applyRandom}>
            <input type="hidden" name="tenantId" value={tenant.id} />
            <SubmitButton className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400">
              🎲 Generar aleatorio
            </SubmitButton>
          </form>
        </div>
      </div>

      {sp.ok === "random" && (
        <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
          Diseño aleatorio aplicado. Si no te convence, usá «Volver al anterior».
        </p>
      )}
      {sp.ok === "undo" && (
        <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
          Restaurado. Podés volver a aplicar el otro diseño con el mismo botón.
        </p>
      )}

      <h2 className="mt-8 text-sm font-semibold text-gray-500">Diseño actual</h2>
      <div className="mt-2 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <Swatches design={current} />
        <div>
          <p className="font-semibold capitalize text-gray-900">{current.id}</p>
          <p className="text-xs text-gray-500">
            {current.headingFont} + {current.bodyFont} · radio {current.radius}
          </p>
        </div>
        <a
          href={`https://${tenant.slug}.modidy.com`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          Ver sitio ↗
        </a>
      </div>

      <h2 className="mt-10 text-sm font-semibold text-gray-500">Estilos elegidos por nuestro equipo de diseño</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {PRESETS.map((preset) => {
          const isActive = current.id === preset.id;
          return (
            <form action={applyPreset} key={preset.id}>
              <input type="hidden" name="tenantId" value={tenant.id} />
              <input type="hidden" name="presetId" value={preset.id} />
              <SubmitButton
                className={`block w-full overflow-hidden rounded-2xl border text-left transition ${
                  isActive
                    ? "border-sky-400 ring-2 ring-sky-100"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="relative flex h-28 items-end justify-between overflow-hidden p-4" style={{ backgroundColor: preset.bg }}>
                  {preset.id === "glass" && (
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(60% 70% at 75% 20%, rgba(139,124,247,0.45) 0%, transparent 60%), radial-gradient(50% 60% at 15% 85%, rgba(52,211,153,0.25) 0%, transparent 60%)",
                      }}
                    />
                  )}
                  {preset.scanlines && (
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-40"
                      style={{
                        background:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
                      }}
                    />
                  )}
                  <div className="relative">
                    {preset.eyebrowStyle === "mono-bracket" ? (
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: preset.primary }}>
                        [ {tenant.name} ]
                      </p>
                    ) : (
                      <span
                        className="mb-1 inline-block rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${preset.primary} 10%, ${preset.bg})`,
                          color: preset.muted,
                        }}
                      >
                        {tenant.name}
                      </span>
                    )}
                    <p
                      className={`text-xl leading-tight ${preset.uppercaseHeadings ? "uppercase" : ""}`}
                      style={{
                        color: preset.fg,
                        fontFamily: `'${preset.headingFont}', Georgia, serif`,
                        letterSpacing: preset.uppercaseHeadings ? "-0.02em" : undefined,
                      }}
                    >
                      {preset.label}
                    </p>
                  </div>
                  <span
                    className="relative px-3 py-1 text-[11px] font-semibold"
                    style={{
                      backgroundColor: preset.primary,
                      color: preset.onPrimary,
                      borderRadius:
                        preset.radius === "0px"
                          ? "2px"
                          : preset.navStyle === "floating-pill"
                            ? "9999px"
                            : `calc(${preset.radius} * 0.9)`,
                    }}
                  >
                    Botón
                  </span>
                </div>
                <div className="border-t border-inherit bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{preset.label}</h3>
                    {isActive ? (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                        actual
                      </span>
                    ) : (
                      <Swatches design={preset} />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{preset.description}</p>
                  <p className="mt-2 text-[11px] text-gray-400">
                    {preset.headingFont} + {preset.bodyFont}
                  </p>
                </div>
              </SubmitButton>
            </form>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-500">
        🎲 El diseño aleatorio combina paletas y tipografías curadas por nuestro equipo, así que
        cualquier combinación se ve bien. Y si un resultado no te gusta, «Volver al anterior» te
        devuelve exactamente al diseño que tenías.
      </p>
    </div>
  );
}
