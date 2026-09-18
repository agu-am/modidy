"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/admin-auth";

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=1");
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}
