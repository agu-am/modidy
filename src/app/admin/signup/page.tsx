"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminSignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const design = useSearchParams().get("design");
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      const cookieDomain =
        typeof window !== "undefined" && /\.modidy\.com$/.test(window.location.hostname)
          ? ".modidy.com"
          : undefined;

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookieOptions: { domain: cookieDomain } }
      );

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/confirm${
            design ? `?design=${encodeURIComponent(design)}` : ""
          }`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.session) {
        setPendingConfirm(true);
        return;
      }

      // Si viene de un diseño concreto, lo creamos automáticamente
      const dest = design ? `/admin/setup?design=${encodeURIComponent(design)}` : "/admin";
      router.replace(dest);
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      setError("Error inesperado al crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  if (pendingConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl">📬</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Confirma tu correo</h1>
          <p className="mt-2 text-sm text-gray-500">
            Te enviamos un enlace de confirmación. Al confirmarlo vas a poder iniciar sesión.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900">Creá tu cuenta</h2>
        <p className="mt-2 text-sm text-gray-500">
          Registráte para crear y administrar tu sitio web.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{" "}
          <Link href="/admin/login" className="font-medium text-sky-600 hover:text-sky-500">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
