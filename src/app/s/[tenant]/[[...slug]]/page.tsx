import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteRenderer } from "@/components/site/sections";
import { getSiteData } from "@/lib/tenancy";
import { submitLead } from "../actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ tenant: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant: slug } = await params;
  const data = await getSiteData(slug).catch(() => null);
  return {
    title: data ? data.tenant.name : "Sitio no encontrado",
    description: data ? `Sitio web de ${data.tenant.name}` : undefined,
  };
}

export default async function TenantPage({ params, searchParams }: Props) {
  const { tenant: slug, slug: rest } = await params;
  if (rest && rest.length > 0) notFound();

  const data = await getSiteData(slug);
  if (!data) notFound();

  const sp = await searchParams;
  const enviado = sp.enviado === "1";

  const submitAction = submitLead.bind(null, data.tenant.id, data.tenant.slug);

  return (
    <SiteRenderer
      tenant={data.tenant}
      sections={data.sections}
      enviado={enviado}
      submitAction={submitAction}
    />
  );
}
