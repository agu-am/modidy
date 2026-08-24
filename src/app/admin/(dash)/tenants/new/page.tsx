import Link from "next/link";
import { createTenant } from "../actions";

export default function NewTenantPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <NewTenantForm searchParams={searchParams} />;
}

async function NewTenantForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/admin" className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver a sitios
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Nuevo sitio</h1>

      {error === "slug" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          El subdominio solo puede contener letras minúsculas, números y guiones.
        </p>
      )}
      {error === "duplicate" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          Ese subdominio ya está en uso.
        </p>
      )}

      <form action={createTenant} className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre del negocio
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Restaurante Luna"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">
            Subdominio
          </label>
          <div className="mt-1.5 flex items-center gap-0 rounded-xl border border-gray-200 focus-within:border-sky-500">
            <input
              id="slug"
              name="slug"
              required
              placeholder="restaurante-luna"
              className="w-full rounded-l-xl px-4 py-2.5 font-mono text-sm outline-none"
            />
            <span className="rounded-r-xl bg-gray-50 px-3 py-2.5 font-mono text-xs text-gray-400">
              .modidy.com
            </span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="plan" className="text-sm font-medium text-gray-700">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              <option value="basic">Básico</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label htmlFor="primary" className="text-sm font-medium text-gray-700">
              Color principal
            </label>
            <input
              id="primary"
              name="primary"
              type="color"
              defaultValue="#0ea5e9"
              className="mt-1.5 h-[42px] w-full cursor-pointer rounded-xl border border-gray-200 px-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
        >
          Crear sitio
        </button>
      </form>
    </div>
  );
}
