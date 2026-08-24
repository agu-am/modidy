"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { pages, sections, tenantModules, tenants } from "@/db/schema";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function defaultSections(tenantId: string, pageId: string, name: string) {
  return [
    {
      tenantId,
      pageId,
      type: "hero",
      position: 0,
      content: {
        eyebrow: "Bienvenido",
        title: name,
        subtitle: "Tu nuevo sitio web, listo para crecer.",
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
      type: "contact",
      position: 3,
      content: {
        title: "Contacto",
        subtitle: "Escribinos y te respondemos a la brevedad.",
      },
    },
    {
      tenantId,
      pageId,
      type: "footer",
      position: 4,
      content: { text: `© ${new Date().getFullYear()} ${name}. Todos los derechos reservados.` },
    },
  ];
}

export async function createTenant(formData: FormData): Promise<void> {
  const db = getDb();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const plan = String(formData.get("plan") ?? "basic");
  const primary = String(formData.get("primary") ?? "#0ea5e9");

  if (!name || !SLUG_RE.test(slug)) {
    redirect("/admin/tenants/new?error=slug");
  }

  const existing = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);
  if (existing.length > 0) {
    redirect("/admin/tenants/new?error=duplicate");
  }

  const [tenant] = await db
    .insert(tenants)
    .values({ name, slug, plan, theme: { primary } })
    .returning({ id: tenants.id });

  if (!tenant) redirect("/admin/tenants/new?error=unknown");

  const [page] = await db
    .insert(pages)
    .values({ tenantId: tenant.id, slug: "home", title: "Inicio" })
    .returning({ id: pages.id });

  await db.insert(sections).values(defaultSections(tenant.id, page.id, name));

  revalidatePath("/admin");
  redirect(`/admin/tenants/${tenant.id}`);
}

export async function toggleModule(
  tenantId: string,
  moduleId: string,
  enabled: boolean,
): Promise<void> {
  const db = getDb();

  const existing = await db
    .select({ id: tenantModules.id })
    .from(tenantModules)
    .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleId, moduleId)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(tenantModules).set({ enabled }).where(eq(tenantModules.id, existing[0].id));
  } else {
    await db.insert(tenantModules).values({ tenantId, moduleId, enabled });
  }

  revalidatePath(`/admin/tenants/${tenantId}`);
}

export async function setTenantStatus(
  tenantId: string,
  status: "active" | "suspended",
): Promise<void> {
  const db = getDb();
  await db
    .update(tenants)
    .set({ status, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId));
  revalidatePath("/admin");
  revalidatePath(`/admin/tenants/${tenantId}`);
}
