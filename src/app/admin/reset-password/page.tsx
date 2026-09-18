"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function ResetPasswordPage() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // El link del email llega con #access_token=...&type=recovery;
  // createBrowserClient detecta y guarda la sesión automáticamente.
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
    setClient(supabase);

    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        setHasSession(!!data.session);
        setChecking(false);
      });
    }, 600); // deja tiempo a que se procese el hash del recovery

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!client) return;

      const formData = new FormData(e.currentTarget);
      const password = String(formData.get("password") ?? "");
      const confirm = String(formData.get("confirm") ?? "");

      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (password !== confirm) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const { error: authError } = await client.auth.updateUser({ password });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------- Estados --------------------------- */

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="animate-pulse text-sm text-gray-500">Verificando enlace...</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl">🔗</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Enlace inválido o vencido</h1>
          <p className="mt-2 text-sm text-gray-500">
            Los enlaces de recuperación tienen un tiempo limitado. Pedí uno nuevo.
          </p>
          <Link
            href="/admin/forgot-password"
            className="mt-6 inline-block rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl">✅</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Contraseña actualizada</h1>
          <p className="mt-2 text-sm text-gray-500">
            Ya podés entrar con tu nueva contraseña.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/admin"
              className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Ir al dashboard
            </Link>
            <Link
              href="/admin/login"
              className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- Formulario ------------------------- */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900">Nueva contraseña</h2>
        <p className="mt-2 text-sm text-gray-500">
          Elegí una contraseña nueva para tu cuenta.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Nueva contraseña
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
          <div>
            <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              required
              minLength={8}
              placeholder="Repetí la contraseña"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
