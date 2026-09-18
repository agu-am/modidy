import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenantById, listPostsByTenant } from "@/db/rest";
import { requireMemberOr404 } from "@/lib/auth";
import { SubmitButton } from "@/components/admin/submit-button";
import { createPost, deletePost, togglePublish } from "./actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500";

export default async function TenantBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const tenant = await getTenantById(id);
  if (!tenant) notFound();
  await requireMemberOr404(tenant.id);

  const rows = await listPostsByTenant(tenant.id);

  const tenantId = tenant.id;

  async function onCreate(formData: FormData) {
    "use server";
    await createPost(tenantId, formData);
  }

  async function onDelete(formData: FormData) {
    "use server";
    await deletePost(tenantId, String(formData.get("postId")));
  }

  async function onToggle(formData: FormData) {
    "use server";
    await togglePublish(
      tenantId,
      String(formData.get("postId")),
      String(formData.get("published")) === "true",
    );
  }

  return (
    <div>
      <Link href={`/admin/tenants/${tenant.id}`} className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver a {tenant.name}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">📝 Blog</h1>
        <Link
          href={`https://${tenant.slug}.modidy.com/blog`}
          target="_blank"
          className="rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          Ver blog público →
        </Link>
      </div>

      {(sp.error === "title" || sp.error === "slug") && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {sp.error === "title"
            ? "El título es obligatorio."
            : "Ya existe una publicación con ese slug."}
        </p>
      )}

      <h2 className="mt-8 text-sm font-semibold text-gray-900">Nueva publicación</h2>
      <form action={onCreate} className="mt-3 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_200px_140px]">
          <input name="title" required placeholder="Título" className={inputClass} />
          <input name="category" placeholder="Categoría (opcional)" className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-sky-600" />
            Publicar ya
          </label>
        </div>
        <textarea name="excerpt" rows={2} placeholder="Resumen corto (se muestra en el listado)" className={inputClass} />
        <textarea name="body" rows={6} required placeholder="Contenido. Separá los párrafos con una línea vacía." className={inputClass} />
        <SubmitButton
          className="justify-self-start rounded-full bg-sky-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Crear publicación
        </SubmitButton>
      </form>

      <h2 className="mt-10 text-sm font-semibold text-gray-900">
        Publicaciones ({rows.length})
      </h2>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Todavía no hay publicaciones.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {post.published ? "publicada" : "borrador"}
                  </span>
                  {post.category && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                      {post.category}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">{post.title}</h3>
                <p className="font-mono text-[11px] text-gray-400">{tenant.slug}.modidy.com/blog/{post.slug}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/tenants/${tenant.id}/blog/${post.id}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Editar
                </Link>
                <form action={onToggle}>
                  <input type="hidden" name="postId" value={post.id} />
                  <input type="hidden" name="published" value={post.published ? "false" : "true"} />
                  <SubmitButton className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">
                    {post.published ? "Despublicar" : "Publicar"}
                  </SubmitButton>
                </form>
                <form action={onDelete}>
                  <input type="hidden" name="postId" value={post.id} />
                  <SubmitButton
                    title="Eliminar publicación"
                    className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Eliminar
                  </SubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
