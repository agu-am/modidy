import Link from "next/link";
import type { Section, Tenant } from "@/db/schema";
import { fontLinks, resolveDesign, type SiteDesign } from "@/lib/designs";
import {
  SiteButton,
  SiteCard,
  SiteEyebrow,
  SiteInput,
  SiteTextarea,
  SectionHeading,
} from "@/components/site/ui";
import { Reveal } from "@/components/site/reveal";

type Content = Record<string, unknown>;

function str(content: Content, key: string, fallback = ""): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function list<T>(content: Content, key: string): T[] {
  const v = content[key];
  return Array.isArray(v) ? (v as T[]) : [];
}

function cssVars(d: SiteDesign): Record<string, string> {
  return {
    "--site-primary": d.primary,
    "--d-bg": d.bg,
    "--d-surface": d.surface,
    "--d-fg": d.fg,
    "--d-muted": d.muted,
    "--d-border": d.border,
    "--d-onprimary": d.onPrimary,
    "--d-hero-end": d.heroGradientEnd,
    "--d-radius": d.radius,
    "--d-font-head": `'${d.headingFont}', Georgia, serif`,
    "--d-font-body": `'${d.bodyFont}', system-ui, sans-serif`,
    "--d-upper": d.uppercaseHeadings ? "uppercase" : "none",
  };
}

const rhythmCls = (d: SiteDesign) => (d.sectionRhythm === "airy" ? "py-28 sm:py-36" : "py-20");
const HEAD = "[font-family:var(--d-font-head)]";
const UPPER = "[text-transform:var(--d-upper)] tracking-tight";

function metaLabel(design: SiteDesign, text: string): string {
  if (!design.monoMeta) return text.toUpperCase();
  return `[ ${text.toUpperCase()} ]`;
}

/* ------------------------------- Header ---------------------------- */

function Header({ tenant, design }: { tenant: Tenant; design: SiteDesign }) {
  if (design.navStyle === "floating-pill") {
    return (
      <div className="sticky top-0 z-40 flex justify-center px-4 pt-5">
        <nav className="flex w-max items-center gap-8 rounded-full border border-white/10 bg-[color-mix(in_srgb,var(--d-bg)_70%,transparent)] px-6 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[var(--d-fg)]">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: "var(--site-primary)", color: "var(--d-onprimary)" }}
            >
              {tenant.name.charAt(0).toUpperCase()}
            </span>
            {tenant.name}
          </Link>
          <div className="hidden gap-5 text-sm text-[var(--d-muted)] sm:flex">
            <a href="#inicio" className="transition-colors hover:text-[var(--d-fg)]">Inicio</a>
            <a href="#servicios" className="transition-colors hover:text-[var(--d-fg)]">Servicios</a>
            <a href="#nosotros" className="transition-colors hover:text-[var(--d-fg)]">Nosotros</a>
            <a href="#contacto" className="transition-colors hover:text-[var(--d-fg)]">Contacto</a>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur ${
        design.cardStyle === "hard"
          ? "border-b-2 border-[var(--d-border)] bg-[var(--d-bg)]"
          : "border-b border-[var(--d-border)] bg-[color-mix(in_srgb,var(--d-bg)_85%,transparent)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--d-fg)]">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              backgroundColor: design.cardStyle === "hard" ? "transparent" : "var(--site-primary)",
              border: design.cardStyle === "hard" ? "2px solid var(--d-border)" : "none",
              color: design.cardStyle === "hard" ? "var(--d-fg)" : "var(--d-onprimary)",
              borderRadius: "calc(var(--d-radius) * 0.6)",
            }}
          >
            {tenant.name.charAt(0).toUpperCase()}
          </span>
          <span className={design.monoMeta ? "font-mono uppercase tracking-wide" : ""}>
            {tenant.name}
          </span>
        </Link>
        <nav
          className={`hidden gap-6 text-sm text-[var(--d-muted)] sm:flex ${
            design.monoMeta ? "font-mono text-xs uppercase tracking-[0.1em]" : ""
          }`}
        >
          <a href="#inicio" className="transition-colors hover:text-[var(--d-fg)]">Inicio</a>
          <a href="#servicios" className="transition-colors hover:text-[var(--d-fg)]">Servicios</a>
          <a href="#nosotros" className="transition-colors hover:text-[var(--d-fg)]">Nosotros</a>
          <a href="#contacto" className="transition-colors hover:text-[var(--d-fg)]">Contacto</a>
        </nav>
      </div>
    </header>
  );
}

/* -------------------------------- Hero ----------------------------- */

function Hero({ content, design }: { content: Content; design: SiteDesign }) {
  const eyebrowText = str(content, "eyebrow");

  /* ---- serif-light (Editorial / Suave Lux) ---- */
  if (design.heroLayout === "serif-light") {
    return (
      <section id="inicio" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 72% 18%, color-mix(in srgb, var(--site-primary) 9%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-5xl px-4 py-28 sm:py-36">
          {eyebrowText && (
            <SiteEyebrow design={design}>{eyebrowText}</SiteEyebrow>
          )}
          <Reveal>
            <h1
              className={`max-w-3xl text-5xl leading-[1.05] text-[var(--d-fg)] sm:text-7xl ${HEAD}`}
              style={{ letterSpacing: "-0.02em", fontWeight: 500 }}
            >
              {str(content, "title", "Bienvenido a nuestro sitio")}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--d-muted)]">
              {str(content, "subtitle", "Todo lo que necesitas, en un solo lugar.")}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10">
              <SiteButton design={design} href={str(content, "ctaHref", "#contacto")} arrow>
                {str(content, "ctaText", "Contáctanos")}
              </SiteButton>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  /* ---- bold-block (Industrial / Terminal / Glass alternativo) ---- */
  if (design.heroLayout === "bold-block") {
    return (
      <section
        id="inicio"
        className="relative overflow-hidden"
        style={{
          backgroundColor:
            design.id === "terminal" || design.scanlines
              ? "var(--d-bg)"
              : "var(--site-primary)",
        }}
      >
        {/* Scanlines solo para arquetipo CRT */}
        {design.scanlines && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
            }}
          />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
          {eyebrowText && (
            <SiteEyebrow design={design}>{eyebrowText}</SiteEyebrow>
          )}
          <Reveal>
            <h1
              className={`max-w-5xl font-black uppercase leading-[0.95] sm:text-8xl ${HEAD}`}
              style={{
                letterSpacing: "-0.03em",
                color:
                  design.scanlines || design.primary === "#EAEAEA"
                    ? "var(--d-fg)"
                    : "var(--d-onprimary)",
                fontSize: "clamp(3rem, 9vw, 7rem)",
              }}
            >
              {str(content, "title", "Bienvenido a nuestro sitio")}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p
              className={`mt-6 max-w-xl text-xl ${
                design.monoMeta ? "font-mono text-sm uppercase tracking-[0.12em]" : ""
              }`}
              style={{
                color: design.scanlines ? "var(--d-muted)" : "color-mix(in srgb, var(--d-onprimary) 82%, transparent)",
              }}
            >
              {design.scanlines ? ">>> " : ""}
              {str(content, "subtitle", "Todo lo que necesitas, en un solo lugar.")}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10">
              <SiteButton
                design={design}
                variant={design.scanlines ? "primary" : "inverse"}
                href={str(content, "ctaHref", "#contacto")}
              >
                {str(content, "ctaText", "Contáctanos")}
              </SiteButton>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  /* ---- split (Editorial Split del skill soft) ---- */
  if (design.heroLayout === "split") {
    const services = list<{ title?: string }>(
      // el hero no tiene acceso a las secciones; usamos bloques decorativos
      {},
      "items",
    );
    void services;

    return (
      <section id="inicio" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 80% 25%, color-mix(in srgb, var(--site-primary) 14%, transparent) 0%, transparent 65%), radial-gradient(40% 40% at 15% 85%, color-mix(in srgb, var(--d-hero-end) 30%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-28 sm:py-32 lg:grid-cols-2 lg:gap-16">
          <div>
            {eyebrowText && <SiteEyebrow design={design}>{eyebrowText}</SiteEyebrow>}
            <Reveal>
              <h1
                className={`text-5xl leading-[1.05] text-[var(--d-fg)] sm:text-6xl ${HEAD}`}
                style={{ letterSpacing: "-0.02em", fontWeight: 500 }}
              >
                {str(content, "title", "Bienvenido a nuestro sitio")}
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--d-muted)]">
                {str(content, "subtitle", "Todo lo que necesitas, en un solo lugar.")}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10">
                <SiteButton design={design} href={str(content, "ctaHref", "#contacto")} arrow>
                  {str(content, "ctaText", "Contáctanos")}
                </SiteButton>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center gap-4">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={200 + i * 120}>
                <SiteCard design={design} className="!p-0">
                  <div className="flex items-center gap-4 p-5">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--site-primary) 14%, var(--d-surface))",
                        color: "var(--site-primary)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="h-2 w-full max-w-[220px] rounded-full bg-[color-mix(in_srgb,var(--d-fg)_10%,transparent)]" />
                  </div>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---- gradient (clásico / Glass mesh) ---- */
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            design.id === "glass" || design.scanlines
              ? `radial-gradient(50% 60% at 75% 20%, color-mix(in srgb, var(--site-primary) 38%, transparent) 0%, transparent 60%), radial-gradient(45% 55% at 20% 80%, color-mix(in srgb, var(--d-hero-end) 90%, transparent) 0%, transparent 65%), var(--d-bg)`
              : `linear-gradient(135deg, var(--site-primary) 0%, var(--d-hero-end) 100%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        {eyebrowText && (
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90">
            {eyebrowText}
          </p>
        )}
        <Reveal>
          <h1 className={`max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl ${HEAD}`}>
            {str(content, "title", "Bienvenido a nuestro sitio")}
          </h1>
        </Reveal>
        <Reveal delay={130}>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            {str(content, "subtitle", "Todo lo que necesitas, en un solo lugar.")}
          </p>
        </Reveal>
        <Reveal delay={230}>
          <div className="mt-8 flex flex-wrap gap-3">
            <SiteButton
              design={design}
              variant="inverse"
              href={str(content, "ctaHref", "#contacto")}
            >
              {str(content, "ctaText", "Contáctanos")}
            </SiteButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Services --------------------------- */

type ServiceItem = { icon?: string; title?: string; description?: string };

function Services({ content, design }: { content: Content; design: SiteDesign }) {
  const items = list<ServiceItem>(content, "items");
  if (items.length === 0) return null;

  const bento = design.cardStyle === "bezel";

  return (
    <section id="servicios" className={`mx-auto max-w-6xl px-4 ${rhythmCls(design)}`}>
      {str(content, "title") && (
        <SectionHeading design={design}>{str(content, "title", "Nuestros servicios")}</SectionHeading>
      )}
      {str(content, "subtitle") && (
        <p className="mt-2 text-center text-[var(--d-muted)]">{str(content, "subtitle")}</p>
      )}
      <div className={`mt-10 grid gap-6 sm:grid-cols-2 ${bento ? "lg:grid-cols-3" : "lg:grid-cols-3"}`}>
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 90} className={bento && i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
            <SiteCard design={design} className="h-full">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--site-primary) 12%, var(--d-surface))",
                  borderRadius: design.radius === "0px" ? "0px" : "calc(var(--d-radius) * 0.6)",
                }}
              >
                {item.icon ?? "✦"}
              </div>
              <h3
                className={`mt-4 font-semibold text-[var(--d-fg)] ${HEAD} ${
                  design.monoMeta ? "font-mono uppercase tracking-wide" : ""
                }`}
              >
                {item.title ?? "Servicio"}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--d-muted)]">
                {item.description ?? ""}
              </p>
            </SiteCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- About ----------------------------- */

function About({ content, design }: { content: Content; design: SiteDesign }) {
  return (
    <section id="nosotros" className="border-y border-[var(--d-border)] bg-[var(--d-bg)]">
      <div className={`mx-auto max-w-4xl px-4 text-center ${rhythmCls(design)}`}>
        <Reveal>
          <SectionHeading design={design}>
            {str(content, "title", "Sobre nosotros")}
          </SectionHeading>
        </Reveal>
        <Reveal delay={130}>
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-[var(--d-muted)]">
            {str(content, "body", "Conoce más sobre nuestra historia y nuestro equipo.")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Gallery ---------------------------- */

function Gallery({ content, design }: { content: Content; design: SiteDesign }) {
  const images = list<string>(content, "images");
  if (images.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading design={design}>{str(content, "title", "Galería")}</SectionHeading>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Imagen ${i + 1}`}
            className="aspect-[4/3] w-full border border-[var(--d-border)] object-cover"
            style={{ borderRadius: design.radius === "0px" ? "0px" : "calc(var(--d-radius) * 0.75)" }}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Contact ---------------------------- */

function Contact({
  content,
  enviado,
  submitAction,
  design,
}: {
  content: Content;
  enviado: boolean;
  submitAction: (formData: FormData) => Promise<void>;
  design: SiteDesign;
}) {
  return (
    <section id="contacto" className="border-y border-[var(--d-border)] bg-[var(--d-surface)]">
      <div className={`mx-auto max-w-2xl px-4 ${rhythmCls(design)}`}>
        <SectionHeading design={design}>{str(content, "title", "Contacto")}</SectionHeading>
        {str(content, "subtitle") && (
          <p className="mt-2 text-center text-[var(--d-muted)]">{str(content, "subtitle")}</p>
        )}

        {(str(content, "email") || str(content, "phone")) && (
          <div
            className={`mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[var(--d-muted)] ${
              design.monoMeta ? "font-mono text-xs uppercase tracking-[0.08em]" : ""
            }`}
          >
            {str(content, "email") && <span>{str(content, "email")}</span>}
            {str(content, "phone") && <span>{str(content, "phone")}</span>}
            {str(content, "address") && <span>{str(content, "address")}</span>}
          </div>
        )}

        {enviado ? (
          <div
            className="mt-8 border p-6 text-center"
            style={{
              borderColor: "var(--site-primary)",
              borderRadius: "var(--d-radius)",
              backgroundColor: "color-mix(in srgb, var(--site-primary) 8%, var(--d-bg))",
              color: "var(--d-fg)",
            }}
          >
            ¡Gracias! Tu mensaje fue enviado correctamente.
          </div>
        ) : (
          <form action={submitAction} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SiteInput name="name" required placeholder="Tu nombre" />
              <SiteInput name="email" type="email" required placeholder="Tu email" />
            </div>
            <SiteTextarea name="message" rows={4} placeholder="Escribinos tu mensaje..." />
            <SiteButton design={design} className="w-full !justify-center">
              Enviar mensaje
            </SiteButton>
          </form>
        )}
      </div>
    </section>
  );
}

/* ------------------------------- Footer ---------------------------- */

function Footer({ tenant, content, design }: { tenant: Tenant; content: Content; design: SiteDesign }) {
  return (
    <footer className="border-t border-[var(--d-border)] bg-[var(--d-bg)] py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-[var(--d-muted)]">
        <p className={`font-medium text-[var(--d-fg)] ${HEAD}`}>{tenant.name}</p>
        <p className="mt-1">{str(content, "text", "© Todos los derechos reservados.")}</p>
        <p className="mt-4 text-xs opacity-70">
          Sitio creado con{" "}
          <Link
            href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "modidy.com"}`}
            className="underline hover:opacity-100"
          >
            Modidy
          </Link>
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------- SiteRenderer ------------------------- */

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
  const design = resolveDesign(tenant.design, tenant.theme?.primary);
  const footerSection = sections.find((s) => s.type === "footer");

  return (
    <div
      className={`flex min-h-screen flex-col antialiased ${
        design.sectionRhythm === "airy" ? "[letter-spacing:-0.01em]" : ""
      }`}
      style={{
        ...cssVarsSafe(design),
        backgroundColor: "var(--d-bg)",
        color: "var(--d-fg)",
        fontFamily: "var(--d-font-body)",
      }}
    >
      {fontLinks([design]).map((l) => (
        <link key={l.href} rel="stylesheet" href={l.href} />
      ))}
      <Header tenant={tenant} design={design} />
      <main className="flex-1">
        {sections
          .filter((s) => s.type !== "footer")
          .map((section) => {
            switch (section.type) {
              case "hero":
                return <Hero key={section.id} content={section.content} design={design} />;
              case "services":
                return <Services key={section.id} content={section.content} design={design} />;
              case "about":
                return <About key={section.id} content={section.content} design={design} />;
              case "gallery":
                return <Gallery key={section.id} content={section.content} design={design} />;
              case "contact":
                return (
                  <Contact
                    key={section.id}
                    content={section.content}
                    enviado={enviado}
                    submitAction={submitAction}
                    design={design}
                  />
                );
              default:
                return null;
            }
          })}
      </main>
      <Footer tenant={tenant} content={footerSection?.content ?? {}} design={design} />
    </div>
  );
}

function cssVarsSafe(d: SiteDesign): Record<string, string> {
  return {
    "--site-primary": d.primary,
    "--d-bg": d.bg,
    "--d-surface": d.surface,
    "--d-fg": d.fg,
    "--d-muted": d.muted,
    "--d-border": d.border,
    "--d-onprimary": d.onPrimary,
    "--d-hero-end": d.heroGradientEnd,
    "--d-radius": d.radius,
    "--d-font-head": `'${d.headingFont}', Georgia, serif`,
    "--d-font-body": `'${d.bodyFont}', system-ui, sans-serif`,
    "--d-upper": d.uppercaseHeadings ? "uppercase" : "none",
  };
}
