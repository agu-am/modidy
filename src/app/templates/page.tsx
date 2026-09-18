import type { Metadata } from "next";
import Link from "next/link";
import { PRESETS, fontLinks } from "@/lib/designs";

export const metadata: Metadata = {
  title: "Templates — Modidy",
  description: "Elegí el diseño de tu sitio web. 5 estilos únicos, todos premium.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            modidy<span className="text-sky-500">.</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-gray-600 sm:flex">
            <Link href="/" className="hover:text-gray-900">Inicio</Link>
            <span className="font-semibold text-gray-900">Templates</span>
          </nav>
          <Link
            href="/admin/signup"
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Crear mi web
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Diseños hechos con <span className="text-sky-500">buen gusto</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Cada diseño fue creado siguiendo reglas de tipografía, color y espacio de
            estudios de diseño reales. Elegí el que más va con tu negocio.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <article
              key={preset.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Mini preview */}
              <div className="relative flex h-48 items-end overflow-hidden p-5" style={{ backgroundColor: preset.bg }}>
                {preset.id === "glass" && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(60% 70% at 75% 20%, rgba(139,124,247,0.4) 0%, transparent 60%), radial-gradient(50% 60% at 15% 85%, rgba(52,211,153,0.2) 0%, transparent 60%)",
                    }}
                  />
                )}
                {preset.scanlines && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
                    }}
                  />
                )}
                <div className="relative">
                  <p
                    className={`text-2xl font-bold leading-tight ${
                      preset.uppercaseHeadings ? "uppercase" : ""
                    }`}
                    style={{
                      color: preset.fg,
                      fontFamily: `'${preset.headingFont}', Georgia, serif`,
                    }}
                  >
                    {preset.label}
                  </p>
                  <p
                    className="mt-1 max-w-[200px] text-xs leading-relaxed opacity-80"
                    style={{ color: preset.muted }}
                  >
                    {preset.description.slice(0, 80)}…
                  </p>
                </div>
                <span
                  className="relative ml-auto shrink-0 px-3 py-1 text-[11px] font-semibold"
                  style={{
                    backgroundColor: preset.primary,
                    color: preset.onPrimary,
                    borderRadius: preset.radius === "0px" ? "2px" : "9999px",
                  }}
                >
                  Botón
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{preset.headingFont}</span>
                  <span>+</span>
                  <span>{preset.bodyFont}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{preset.description}</p>

                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href={`/templates/${preset.id}`}
                    className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Ver demo ↗
                  </Link>
                  <Link
                    href={`/admin/signup?design=${preset.id}`}
                    className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                  >
                    Usar este diseño
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="border-t border-black/5 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-gray-500">
          <span className="font-bold text-gray-900">modidy<span className="text-sky-500">.</span></span>
          <span>© {new Date().getFullYear()} Modidy</span>
        </div>
      </footer>
    </div>
  );
}