"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

export async function submitLead(
  tenantId: string,
  tenantSlug: string,
  formData: FormData,
): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email) {
    redirect(`/s/${tenantSlug}/?error=1`);
  }

  const db = getDb();
  await db.insert(leads).values({ tenantId, name, email, message });

  redirect(`/s/${tenantSlug}/?enviado=1`);
}
