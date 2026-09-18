"use server";

import { redirect } from "next/navigation";
import { insertLead } from "@/db/rest";

export async function submitLead(
  tenantId: string,
  tenantSlug: string,
  formData: FormData,
): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email) {
    redirect("/?error=1");
  }

  await insertLead({ tenantId, name, email, message });

  redirect("/?enviado=1");
}
