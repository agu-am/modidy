"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTenantById, setTenantDesign, swapTenantWithPrevious } from "@/db/rest";
import { requireMemberOrRedirect } from "@/lib/auth";
import { PRESETS, randomDesign } from "@/lib/designs";

async function revalidateSite(tenantId: string) {
  const tenant = await getTenantById(tenantId);
  if (tenant) {
    revalidatePath(`/s/${tenant.slug}`);
    revalidatePath(`/s/${tenant.slug}/blog`);
  }
  revalidatePath(`/admin/tenants/${tenantId}/diseno`);
  revalidatePath(`/admin/tenants/${tenantId}`);
}

export async function applyPreset(formData: FormData): Promise<void> {
  const tenantId = String(formData.get("tenantId") ?? "");
  await requireMemberOrRedirect(tenantId);

  const presetId = String(formData.get("presetId") ?? "");
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) redirect(`/admin/tenants/${tenantId}/diseno?error=preset`);

  await setTenantDesign(tenantId, preset as unknown as Record<string, unknown>);
  await revalidateSite(tenantId);
}

export async function applyRandom(formData: FormData): Promise<void> {
  const tenantId = String(formData.get("tenantId") ?? "");
  await requireMemberOrRedirect(tenantId);

  await setTenantDesign(tenantId, randomDesign() as unknown as Record<string, unknown>);
  await revalidateSite(tenantId);
}

export async function undoDesign(formData: FormData): Promise<void> {
  const tenantId = String(formData.get("tenantId") ?? "");
  await requireMemberOrRedirect(tenantId);

  const restored = await swapTenantWithPrevious(tenantId);
  if (!restored) return;

  await revalidateSite(tenantId);
}
