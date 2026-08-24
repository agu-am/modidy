import Link from "next/link";

export default function TenantNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center text-white">
      <p className="text-6xl font-bold">404</p>
      <h1 className="mt-4 text-xl font-semibold">Sitio no encontrado</h1>
      <p className="mt-2 max-w-md text-sm text-white/60">
        El sitio que buscás no existe o fue suspendido. Si creés que esto es un error,
        contactate con soporte.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
      >
        Ir a Modidy
      </Link>
    </div>
  );
}
