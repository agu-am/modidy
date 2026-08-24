import Link from "next/link";
import type { Section, Tenant } from "@/db/schema";

type Content = Record<string, unknown>;

function str(content: Content, key: string, fallback = ""): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function list<T>(content: Content, key: string): T[] {
  const v = content[key];
  return Array.isArray(v) ? (v as T[]) : [];
}

type SiteTheme = { primary: string };

function Header({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            {tenant.name.charAt(0).toUpperCase()}
          </span>
          {tenant.name}
        </Link>
        <nav className="hidden gap-6 text-sm text-gray-600 sm:flex">
          <a href="#inicio" className="hover:text-gray-900">Inicio</a>
          <a href="#servicios" className="hover:text-gray-900">Servicios</a>
          <a href="#nosotros" className="hover:text-gray-900">Nosotros</a>
          <a href="#contacto" className="hover:text-gray-900">Contacto</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ content }: { content: Content }) {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, var(--site-primary) 0%, #0f172a 100%)`,
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
        {str(content, "eyebrow") && (
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
            {str(content, "eyebrow")}
          </p>
        )}
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {str(content, "title", "Bienvenido a nuestro sitio")}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          {str(content, "subtitle", "Todo lo que necesitas, en un solo lugar.")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={str(content, "ctaHref", "#contacto")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow transition hover:bg-white/90"
          >
            {str(content, "ctaText", "Contáctanos")}
          </a>
        </div>
      </div>
    </section>
  );
}

type ServiceItem = { icon?: string; title?: string; description?: string };

function Services({ content }: { content: Content }) {
  const items = list<ServiceItem>(content, "items");
  if (items.length === 0) return null;
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        {str(content, "title", "Nuestros servicios")}
      </h2>
      {str(content, "subtitle") && (
        <p className="mt-2 text-center text-gray-600">{str(content, "subtitle")}</p>
      )}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 12%, white)" }}
            >
              {item.icon ?? "✨"}
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{item.title ?? "Servicio"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {item.description ?? ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ content }: { content: Content }) {
  return (
    <section id="nosotros" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {str(content, "title", "Sobre nosotros")}
        </h2>
        <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-gray-600">
          {str(content, "body", "Conoce más sobre nuestra historia y nuestro equipo.")}
        </p>
      </div>
    </section>
  );
}

function Gallery({ content }: { content: Content }) {
  const images = list<string>(content, "images");
  if (images.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        {str(content, "title", "Galería")}
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Imagen ${i + 1}`}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        ))}
      </div>
    </section>
  );
}

function Contact({
  content,
  enviado,
  submitAction,
}: {
  content: Content;
  enviado: boolean;
  submitAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <section id="contacto" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {str(content, "title", "Contacto")}
        </h2>
        {str(content, "subtitle") && (
          <p className="mt-2 text-center text-gray-600">{str(content, "subtitle")}</p>
        )}

        {(str(content, "email") || str(content, "phone")) && (
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
            {str(content, "email") && <span>📧 {str(content, "email")}</span>}
            {str(content, "phone") && <span>📞 {str(content, "phone")}</span>}
            {str(content, "address") && <span>📍 {str(content, "address")}</span>}
          </div>
        )}

        {enviado ? (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
            ¡Gracias! Tu mensaje fue enviado correctamente.
          </div>
        ) : (
          <form action={submitAction} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--site-primary)]"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Tu email"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--site-primary)]"
              />
            </div>
            <textarea
              name="message"
              rows={4}
              placeholder="Escribinos tu mensaje..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--site-primary)]"
            />
            <button
              type="submit"
              className="w-full rounded-full py-3 text-sm font-semibold text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer({ tenant, content }: { tenant: Tenant; content: Content }) {
  return (
    <footer className="border-t border-black/5 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">{tenant.name}</p>
        <p className="mt-1">{str(content, "text", "© Todos los derechos reservados.")}</p>
        <p className="mt-4 text-xs text-gray-400">
          Sitio creado con{" "}
          <Link href="/" className="underline hover:text-gray-600">
            Modidy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function SiteRenderer({
  tenant,
  sections,
  enviado,
  submitAction,
}: {
  tenant: Tenant;
  sections: Section[];
  enviado: boolean;
  submitAction: (formData: FormData) => Promise<void>;
}) {
  const theme: SiteTheme = {
    primary: tenant.theme?.primary ?? "#0ea5e9",
  };
  const footerSection = sections.find((s) => s.type === "footer");

  return (
    <div
      className="flex min-h-screen flex-col bg-white text-gray-900 antialiased"
      style={{ ["--site-primary" as string]: theme.primary }}
    >
      <Header tenant={tenant} />
      <main className="flex-1">
        {sections
          .filter((s) => s.type !== "footer")
          .map((section) => {
            switch (section.type) {
              case "hero":
                return <Hero key={section.id} content={section.content} />;
              case "services":
                return <Services key={section.id} content={section.content} />;
              case "about":
                return <About key={section.id} content={section.content} />;
              case "gallery":
                return <Gallery key={section.id} content={section.content} />;
              case "contact":
                return (
                  <Contact
                    key={section.id}
                    content={section.content}
                    enviado={enviado}
                    submitAction={submitAction}
                  />
                );
              default:
                return null;
            }
          })}
      </main>
      <Footer tenant={tenant} content={footerSection?.content ?? {}} />
    </div>
  );
}
