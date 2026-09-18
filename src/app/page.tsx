import Link from "next/link";
import { MODULE_CATALOG } from "@/modules/registry";

const steps = [
  {
    n: "1",
    title: "Contanos tu idea",
    text: "Nos reunimos, definimos el objetivo y diseñamos tu landing a medida.",
  },
  {
    n: "2",
    title: "Lanzamos tu web",
    text: "Tu sitio queda online en tu propio subdominio: tuempresa.modidy.com.",
  },
  {
    n: "3",
    title: "Sumás módulos",
    text: "Cuando lo necesites activamos blog, tienda, reservas, fidelización y más.",
  },
];

export default function MarketingPage() {
  return (
    <div className="flex-1 bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight">
            modidy<span className="text-sky-500">.</span>
          </span>
          <nav className="hidden gap-6 text-sm text-gray-600 sm:flex">
            <a href="#modulos" className="hover:text-gray-900">Módulos</a>
            <a href="#como-funciona" className="hover:text-gray-900">Cómo funciona</a>
            <Link href="/templates" className="hover:text-gray-900">Templates</Link>
          </nav>
          <a
            href="/admin/login"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-gray-900 sm:block"
          >
            Iniciar sesión
          </a>
          <Link
            href="/admin/signup"
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Empezar gratis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 20%, rgba(14,165,233,.5) 0%, transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(99,102,241,.35) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
          <p className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-sky-300">
            Tu web, lista para crecer
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Tu empresa online con{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              subdominio propio
            </span>{" "}
            desde el día uno
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Diseñamos y lanzamos tu landing page profesional. Después sumás módulos a tu
            ritmo: blog, tienda con pagos, reservas, fidelización y más.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/admin/signup"
              className="rounded-full bg-sky-500 px-7 py-3.5 text-sm font-semibold shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
            >
              Crear mi web gratis
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Ver cómo funciona
            </a>
          </div>
          <p className="mt-8 font-mono text-sm text-white/40">
            tuempresa<span className="text-sky-400">.modidy.com</span> → online en días, no meses
          </p>
        </div>
      </section>

      {/* Módulos */}
      <section id="modulos" className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Arrancás con una landing. Crecés con módulos.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
          Cada módulo se activa cuando tu negocio lo necesita. Sin reinstalar nada, sin
          empezar de cero.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULE_CATALOG.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl">
                {m.icon}
              </div>
              <h3 className="mt-4 font-semibold">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Cómo funciona
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-white p-8 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + registro */}
      <section id="contacto" className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ¿Listo para lanzar tu web?
        </h2>
        <p className="mt-4 text-gray-600">
          Registrate gratis, elegí un diseño y tu sitio queda online en{" "}
          <span className="font-mono text-sm">tunombre.modidy.com</span> en minutos. Después
          sumás módulos cuando quieras.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/admin/signup"
            className="w-full rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 sm:w-auto"
          >
            Crear mi cuenta gratis
          </Link>
          <Link
            href="/admin/login"
            className="w-full rounded-full border border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Ya tengo cuenta
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          ¿Preferís que lo hagamos por vos? Escribinos a{" "}
          <a href="mailto:hola@modidy.com" className="underline hover:text-gray-600">
            hola@modidy.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-500 sm:flex-row">
          <span className="font-bold text-gray-900">
            modidy<span className="text-sky-500">.</span>
          </span>
          <Link href="/admin" className="text-xs hover:text-gray-800">
            Panel de administración
          </Link>
          <span>© {new Date().getFullYear()} Modidy</span>
        </div>
      </footer>
    </div>
  );
}
