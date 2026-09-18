"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteLeadById,
  getSectionWithTenantSlug,
  insertDefaultSections,
  insertHomePage,
  insertMembership,
  insertTenant,
  listSectionPositions,
  setModuleEnabled,
  updateSectionContent,
  updateSectionPosition,
  updateSectionVisible,
  updateTenantStatus,
} from "@/db/rest";
import { requireMemberOrRedirect } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

async function getCurrentUserSafe() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

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
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const plan = String(formData.get("plan") ?? "basic");
  const primary = String(formData.get("primary") ?? "#0ea5e9");

  if (!name || !SLUG_RE.test(slug)) {
    redirect("/admin/tenants/new?error=slug");
  }

  let tenantId: string;
  try {
    const tenant = await insertTenant({ name, slug, plan, theme: { primary } });
    tenantId = tenant.id;
  } catch {
    redirect("/admin/tenants/new?error=duplicate");
  }

  // El creador se convierte en dueño ANTES de crear página/secciones:
  // las políticas RLS de pages/sections exigen membresía vigente.
  const user = await getCurrentUserSafe();
  if (!user) redirect("/admin/login");
  await insertMembership({ userId: user.id, tenantId, role: "owner" });

  const pageId = await insertHomePage(tenantId);
  await insertDefaultSections(defaultSections(tenantId, pageId, name));

  revalidatePath("/admin");
  redirect(`/admin/tenants/${tenantId}`);
}

export async function toggleModule(
  tenantId: string,
  moduleId: string,
  enabled: boolean,
): Promise<void> {
  await requireMemberOrRedirect(tenantId);
  await setModuleEnabled(tenantId, moduleId, enabled);
  revalidatePath(`/admin/tenants/${tenantId}`);
}

export async function setTenantStatus(
  tenantId: string,
  status: "active" | "suspended",
): Promise<void> {
  await requireMemberOrRedirect(tenantId);
  await updateTenantStatus(tenantId, status);
  revalidatePath("/admin");
  revalidatePath(`/admin/tenants/${tenantId}`);
}

function buildSectionContent(type: string, fd: FormData): Record<string, unknown> {
  const g = (k: string) => String(fd.get(k) ?? "").trim();

  switch (type) {
    case "hero":
      return {
        eyebrow: g("eyebrow"),
        title: g("title"),
        subtitle: g("subtitle"),
        ctaText: g("ctaText"),
        ctaHref: g("ctaHref") || "#contacto",
      };
    case "about":
      return { title: g("title"), body: String(fd.get("body") ?? "").trim() };
    case "contact":
      return {
        title: g("title"),
        subtitle: g("subtitle"),
        email: g("email"),
        phone: g("phone"),
        address: g("address"),
      };
    case "gallery":
      return {
        title: g("title"),
        images: String(fd.get("images") ?? "")
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean),
      };
    case "services": {
      const icons = fd.getAll("itemIcon").map(String);
      const titles = fd.getAll("itemTitle").map(String);
      const descs = fd.getAll("itemDesc").map(String);
      const removes = new Set(fd.getAll("itemRemove").map((v) => Number(v)));
      const items = titles
        .map((title, i) => ({
          icon: (icons[i] ?? "").trim() || "✨",
          title: title.trim(),
          description: (descs[i] ?? "").trim(),
        }))
        .filter((item, i) => !removes.has(i) && item.title.length > 0);
      return { title: g("title"), subtitle: g("subtitle"), items };
    }
    case "footer":
      return { text: g("text") };
    default:
      return {};
  }
}

function revalidateTenant(slug: string, tenantId: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath(`/admin/tenants/${tenantId}/leads`);
  revalidatePath(`/s/${slug}`);
}

export async function updateSection(formData: FormData): Promise<void> {
  const sectionId = String(formData.get("sectionId") ?? "");
  const tenantId = String(formData.get("tenantId") ?? "");
  const type = String(formData.get("type") ?? "");

  await requireMemberOrRedirect(tenantId);
  const row = await getSectionWithTenantSlug(sectionId, tenantId);
  if (!row) redirect(`/admin/tenants/${tenantId}`);

  const content = buildSectionContent(type, formData);
  await updateSectionContent(sectionId, content);

  revalidateTenant(row.slug, tenantId);
}

export async function addServiceItem(formData: FormData): Promise<void> {
  const sectionId = String(formData.get("sectionId") ?? "");
  const tenantId = String(formData.get("tenantId") ?? "");

  await requireMemberOrRedirect(tenantId);
  const row = await getSectionWithTenantSlug(sectionId, tenantId);
  if (!row || row.section.type !== "services") redirect(`/admin/tenants/${tenantId}`);

  const content = row.section.content as Record<string, unknown>;
  const items = Array.isArray(content.items)
    ? (content.items as Record<string, unknown>[])
    : [];

  await updateSectionContent(sectionId, {
    ...content,
    items: [...items, { icon: "✨", title: "", description: "" }],
  });

  revalidateTenant(row.slug, tenantId);
}

export async function toggleSectionVisible(formData: FormData): Promise<void> {
  const sectionId = String(formData.get("sectionId") ?? "");
  const tenantId = String(formData.get("tenantId") ?? "");

  await requireMemberOrRedirect(tenantId);
  const row = await getSectionWithTenantSlug(sectionId, tenantId);
  if (!row) redirect(`/admin/tenants/${tenantId}`);

  await updateSectionVisible(sectionId, !row.section.visible);

  revalidateTenant(row.slug, tenantId);
}

export async function moveSection(formData: FormData): Promise<void> {
  const sectionId = String(formData.get("sectionId") ?? "");
  const tenantId = String(formData.get("tenantId") ?? "");
  const dir = String(formData.get("dir") ?? "up");

  await requireMemberOrRedirect(tenantId);
  const row = await getSectionWithTenantSlug(sectionId, tenantId);
  if (!row) redirect(`/admin/tenants/${tenantId}`);

  const ordered = await listSectionPositions(row.section.pageId);

  const idx = ordered.findIndex((s) => s.id === sectionId);
  const j = dir === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || j < 0 || j >= ordered.length) {
    redirect(`/admin/tenants/${tenantId}#sec-${sectionId}`);
  }

  await updateSectionPosition(ordered[idx].id, ordered[j].position);
  await updateSectionPosition(ordered[j].id, ordered[idx].position);

  revalidateTenant(row.slug, tenantId);
}

export async function deleteLead(formData: FormData): Promise<void> {
  const leadId = String(formData.get("leadId") ?? "");
  const tenantId = String(formData.get("tenantId") ?? "");

  await requireMemberOrRedirect(tenantId);
  await deleteLeadById(leadId, tenantId);

  revalidatePath("/admin/tenants/${tenantId}/leads");
}
