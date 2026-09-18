import { redirect } from "next/navigation";
import {
  ensureAppUser,
  insertDefaultSections,
  insertHomePage,
  insertMembership,
  insertTenant,
  setTenantDesign,
} from "@/db/rest";
import { getCurrentUser } from "@/lib/auth";
import { PRESETS } from "@/lib/designs";

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { design } = await searchParams;
  if (typeof design !== "string" || !design) redirect("/admin");

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  await ensureAppUser(user.id, user.email);

  const preset = PRESETS.find((p) => p.id === design);
  const name = preset?.label ?? "Mi sitio";
  const slug = slugify(name) + "-" + Date.now().toString(36);
  const primaryColor = preset?.primary ?? "#0ea5e9";

  const tenant = await insertTenant({
    name,
    slug,
    plan: "basic",
    theme: { primary: primaryColor, footerText: "Hecho con Modidy" },
  });

  await insertMembership({ userId: user.id, tenantId: tenant.id, role: "owner" });

  const pageId = await insertHomePage(tenant.id);
  await insertDefaultSections(defaultSections(tenant.id, pageId, name));
  await setTenantDesign(tenant.id, preset as unknown as Record<string, unknown>);

  redirect(`/admin/tenants/${tenant.id}`);
}
