import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              store.set(name, value, {
                ...options,
                // Sesión compartida entre modidy.com y *.modidy.com (solo prod;
                // COOKIE_DOMAIN se define en wrangler.jsonc vars).
                ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
              })
            );
          } catch {
            // Llamado desde un Server Component: el cliente refresca la sesión.
          }
        },
      },
    }
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return !!data.user;
  } catch {
    return false;
  }
}
