import {
  getActiveTenantBySlug,
  getHomePageId,
  getModuleStates,
  listSections,
} from "@/db/rest";
import type { Section, Tenant } from "@/db/schema";

export type SiteData = {
  tenant: Tenant;
  sections: Section[];
  activeModules: string[];
};

export async function getSiteData(slug: string): Promise<SiteData | null> {
  const tenant = await getActiveTenantBySlug(slug);
  if (!tenant) return null;

  const pageId = await getHomePageId(tenant.id);

  const siteSections = pageId ? await listSections(pageId, true) : [];

  const states = await getModuleStates(tenant.id);

  return {
    tenant,
    sections: siteSections,
    activeModules: states.filter((m) => m.enabled).map((m) => m.moduleId),
  };
}

export async function isModuleActive(tenantId: string, moduleId: string): Promise<boolean> {
  const states = await getModuleStates(tenantId);
  return states.some((m) => m.moduleId === moduleId && m.enabled);
}
