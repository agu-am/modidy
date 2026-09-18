import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRESETS } from "@/lib/designs";
import { demoContent } from "@/lib/demo-content";
import { SiteRenderer } from "@/components/site/sections";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) return { title: "Diseño no encontrado" };
  return {
    title: `${preset.label} — Templates Modidy`,
    description: `Vista previa del diseño ${preset.label}: ${preset.description}`,
  };
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { id } = await params;

  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) notFound();

  const { tenant, sections } = demoContent(id);

  // submitAction mock: redirige al registro
  async function submitAction() {
    "use server";
    // En la preview el formulario redirige al registro
    const { redirect } = await import("next/navigation");
    redirect("/admin/signup");
  }

  return (
    <SiteRenderer
      tenant={tenant}
      sections={sections}
      enviado={false}
      submitAction={submitAction}
    />
  );
}