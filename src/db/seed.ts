import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { memberships, modules, pages, sections, tenantModules, tenants, users } from "@/db/schema";
import { MODULE_CATALOG } from "@/modules/registry";

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local opcional si DATABASE_URL ya viene por entorno
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL no está definida. Revisá tu .env.local");
    process.exit(1);
  }

  const db = getDb();

  // 1. Catálogo de módulos disponibles en la plataforma
  await db
    .insert(modules)
    .values(
      MODULE_CATALOG.map((m, i) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        icon: m.icon,
        sortOrder: i,
      })),
    )
    .onConflictDoUpdate({
      target: modules.id,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        icon: sql`excluded.icon`,
        sortOrder: sql`excluded.sort_order`,
      },
    });
  console.log(`✔ ${MODULE_CATALOG.length} módulos del catálogo sincronizados`);

  // 2. Tenant demo
  const [demo] = await db
    .insert(tenants)
    .values({
      slug: "demo",
      name: "Demo Store",
      plan: "pro",
      theme: { primary: "#0ea5e9", footerText: "Hecho con Modidy" },
    })
    .onConflictDoNothing({ target: tenants.slug })
    .returning({ id: tenants.id });

  const tenantId =
    demo?.id ??
    (await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, "demo")).limit(1))[0]
      ?.id;

  if (!tenantId) throw new Error("No se pudo crear/obtener el tenant demo");

  // 3. Página home del tenant demo
  const [home] = await db
    .insert(pages)
    .values({ tenantId, slug: "home", title: "Inicio" })
    .onConflictDoNothing()
    .returning({ id: pages.id });

  const pageId =
    home?.id ??
    (
      await db
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.slug, "home"))
        .limit(1)
    )[0]?.id;

  // 4. Secciones por defecto (solo si la página todavía no tiene contenido)
  const existingSections = await db
    .select({ id: sections.id })
    .from(sections)
    .where(eq(sections.pageId, pageId));

  if (existingSections.length === 0) {
    await db.insert(sections).values([
      {
        tenantId,
        pageId,
        type: "hero",
        position: 0,
        content: {
          eyebrow: "Bienvenido",
          title: "Demo Store",
          subtitle: "Un sitio de ejemplo creado con el seed de Modidy.",
          ctaText: "Contáctanos",
          ctaHref: "#contacto",
        },
      },
      {
        tenantId,
        pageId,
        type: "services",
        position: 1,
        content: {
          title: "Nuestros servicios",
          subtitle: "Lo que hacemos para vos",
          items: [
            { icon: "✨", title: "Servicio uno", description: "Descripción de tu primer servicio." },
            { icon: "🚀", title: "Servicio dos", description: "Descripción de tu segundo servicio." },
            { icon: "💬", title: "Servicio tres", description: "Descripción de tu tercer servicio." },
          ],
        },
      },
      {
        tenantId,
        pageId,
        type: "about",
        position: 2,
        content: {
          title: "Sobre nosotros",
          body: "Contá aquí la historia de tu negocio, tu equipo y qué te diferencia.",
        },
      },
      {
        tenantId,
        pageId,
        type: "gallery",
        position: 3,
        content: {
          title: "Galería",
          subtitle: "Algunos trabajos recientes",
        },
      },
      {
        tenantId,
        pageId,
        type: "contact",
        position: 4,
        content: {
          title: "Contacto",
          subtitle: "Escribinos y te respondemos a la brevedad.",
        },
      },
      {
        tenantId,
        pageId,
        type: "footer",
        position: 5,
        content: { text: `© ${new Date().getFullYear()} Demo Store. Todos los derechos reservados.` },
      },
    ]);
    console.log("✔ 6 secciones creadas para /s/demo (hero → footer)");
  } else {
    console.log("• La página home ya tiene secciones, se omiten");
  }

  // 5. Módulos activados para el tenant demo
  await db
    .insert(tenantModules)
    .values([
      { tenantId, moduleId: "contact" },
      { tenantId, moduleId: "loyalty" },
    ])
    .onConflictDoNothing();
  console.log("✔ Módulos activados para demo: contact, loyalty");

  // 6. Usuario owner del tenant demo
  const [owner] = await db
    .insert(users)
    .values({ email: "owner@demo.modidy.com", name: "Owner Demo" })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  const userId =
    owner?.id ??
    (
      await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, "owner@demo.modidy.com"))
        .limit(1)
    )[0]?.id;

  await db.insert(memberships).values({ userId, tenantId, role: "owner" }).onConflictDoNothing();
  console.log("✔ Usuario owner@demo.modidy.com con membership owner");

  console.log("\nSeed completado. Sitio demo disponible en /s/demo (o demo.localhost:3000).");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error en el seed:", err);
  process.exit(1);
});
