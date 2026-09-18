"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") ?? "").trim();

      const cookieDomain =
        typeof window !== "undefined" && /\.modidy\.com$/.test(window.location.hostname)
          ? ".modidy.com"
          : undefined;

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookieOptions: { domain: cookieDomain } }
      );

      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Error inesperado. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-3xl">📬</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Revisá tu correo</h1>
          <p className="mt-2 text-sm text-gray-500">
            Si existe una cuenta con ese email, te enviamos un enlace para crear una contraseña
            nueva.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Volver a iniciar sesión
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
        <h2 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h2>
        <p className="mt-2 text-sm text-gray-500">
          Ingresá tu email y te enviaremos un enlace para crear una nueva.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/admin/login" className="font-medium text-sky-600 hover:text-sky-500">
            ← Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
