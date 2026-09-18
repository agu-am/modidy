import type { Section, Tenant } from "@/db/schema";
import { PRESETS } from "@/lib/designs";

export function demoContent(designId: string): {
  tenant: Tenant;
  sections: Section[];
} {
  const preset = PRESETS.find((p) => p.id === designId);
  const name = preset?.label ?? "Tu negocio";
  const slug = designId;

  const tenant: Tenant = {
    id: designId,
    slug,
    name,
    status: "active",
    plan: "pro",
    theme: { primary: preset?.primary ?? "#0EA5E9", footerText: "Hecho con Modidy" },
    design: preset as unknown as Record<string, unknown>,
    previousDesign: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sections: Section[] = [
    {
      id: "hero-1",
      pageId: "demo",
      tenantId: slug,
      type: "hero",
      position: 0,
      visible: true,
      content: {
        eyebrow: "Novedad",
        title: name,
        subtitle: "Una plataforma creada con Modidy. Lista para crecer con módulos.",
        ctaText: "Comenzá gratis",
        ctaHref: `/admin/signup?design=${designId}`,
      },
    },
    {
      id: "services-1",
      pageId: "demo",
      tenantId: slug,
      type: "services",
      position: 1,
      visible: true,
      content: {
        title: "Servicios",
        subtitle: "Todo lo que tu negocio necesita",
        items: [
          {
            icon: "✨",
            title: "Diseño premium",
            description: "Tu sitio con tipografía, colores y estilo únicos. Sin plantillas genéricas.",
          },
          {
            icon: "📝",
            title: "Blog profesional",
            description: "Publicá novedades, guías y anuncios. Sin límites, sin complicaciones.",
          },
          {
            icon: "📬",
            title: "Contacto inteligente",
            description: "Formulario que llega directo a tu bandeja. Nunca perdés un cliente.",
          },
        ],
      },
    },
    {
      id: "about-1",
      pageId: "demo",
      tenantId: slug,
      type: "about",
      position: 2,
      visible: true,
      content: {
        title: "Sobre nosotros",
        body: "Creamos sitios web que se ven bien desde el día uno. Sin plantillas genéricas, sin código, sin vueltas.\n\nElegís un diseño, personalizás los textos y tu sitio queda online en minutos. Después, cuando tu negocio crece, activás módulos nuevos con un clic.",
      },
    },
    {
      id: "contact-1",
      pageId: "demo",
      tenantId: slug,
      type: "contact",
      position: 3,
      visible: true,
      content: {
        title: "Contacto",
        subtitle: "Escribinos y te respondemos a la brevedad.",
      },
    },
    {
      id: "footer-1",
      pageId: "demo",
      tenantId: slug,
      type: "footer",
      position: 4,
      visible: true,
      content: {
        text: "© 2026 Tu negocio. Todos los derechos reservados.",
      },
    },
  ];

  return { tenant: tenant as Tenant, sections };
}