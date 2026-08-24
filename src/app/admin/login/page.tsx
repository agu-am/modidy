import { login } from "../actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <AdminLoginForm searchParams={searchParams} />;
}

async function AdminLoginForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = sp.error === "1";
  const configured = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Modidy · Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Acceso restringido.</p>

        {!configured && (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            Define ADMIN_PASSWORD en tu archivo .env.local para poder ingresar.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            Contraseña incorrecta.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            placeholder="Contraseña"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
