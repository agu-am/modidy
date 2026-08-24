import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  modules as modulesTable,
  pages,
  sections,
  tenantModules,
  tenants,
  type Section,
  type Tenant,
} from "@/db/schema";

export type SiteData = {
  tenant: Tenant;
  sections: Section[];
  activeModules: string[];
};

export async function getSiteData(slug: string): Promise<SiteData | null> {
  const db = getDb();

  const [tenant] = await db
    .select()
    .from(tenants)
    .where(and(eq(tenants.slug, slug), eq(tenants.status, "active")))
    .limit(1);

  if (!tenant) return null;

  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.tenantId, tenant.id), eq(pages.slug, "home")))
    .limit(1);

  const siteSections = page
    ? await db
        .select()
        .from(sections)
        .where(and(eq(sections.pageId, page.id), eq(sections.visible, true)))
        .orderBy(asc(sections.position))
    : [];

  const active = await db
    .select({ moduleId: tenantModules.moduleId })
    .from(tenantModules)
    .innerJoin(modulesTable, eq(modulesTable.id, tenantModules.moduleId))
    .where(and(eq(tenantModules.tenantId, tenant.id), eq(tenantModules.enabled, true)));

  return {
    tenant,
    sections: siteSections,
    activeModules: active.map((m) => m.moduleId),
  };
}
