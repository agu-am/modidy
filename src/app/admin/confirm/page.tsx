"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Página destino del enlace de confirmación de email.
 * Supabase vuelve acá con la sesión (PKCE code/hash); acá la detectamos
 * y continuamos el flujo (setup del diseño elegido o dashboard).
 */
export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const router = useRouter();
  const design = useSearchParams().get("design");
  const [status, setStatus] = useState<"checking" | "redirecting" | "done">("checking");

  useEffect(() => {
    const cookieDomain =
      typeof window !== "undefined" && /\.modidy\.com$/.test(window.location.hostname)
        ? ".modidy.com"
        : undefined;

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookieOptions: { domain: cookieDomain } }
    );

    // Dejamos que el cliente procese el code/hash del email
    const timer = setTimeout(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Sin sesión: el usuario quizá ya confirmó antes o el link no aplicó
          setStatus("done");
          return;
        }

        setStatus("redirecting");
        const dest = design ? `/admin/setup?design=${encodeURIComponent(design)}` : "/admin";
        router.replace(dest);
        router.refresh();
      } catch {
        setStatus("done");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [router, design]);

  if (status === "checking" || status === "redirecting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="animate-pulse text-sm text-gray-500">
            {status === "redirecting" ? "Configurando tu cuenta..." : "Verificando tu cuenta..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-3xl">✅</p>
        <h1 className="mt-3 text-xl font-bold text-gray-900">Cuenta verificada</h1>
        <p className="mt-2 text-sm text-gray-500">
          Ya podés iniciar sesión con tu correo y contraseña.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
