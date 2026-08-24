import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "modidy_admin";

export function adminToken(password: string): string {
  return createHash("sha256").update(`${password}:modidy`).digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken(password);
}
