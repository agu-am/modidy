import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById, getTenantById } from "@/db/rest";
import { requireMemberOr404 } from "@/lib/auth";
import { SubmitButton } from "@/components/admin/submit-button";
import { updatePost } from "../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; postId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id, postId } = await params;
  const sp = await searchParams;

  const tenant = await getTenantById(id);
  if (!tenant) notFound();
  await requireMemberOr404(tenant.id);

  const post = await getPostById(postId, tenant.id);
  if (!post) notFound();

  const tenantId = tenant.id;
  const currentPostId = post.id;

  async function onSave(formData: FormData) {
    "use server";
    await updatePost(tenantId, currentPostId, formData);
  }

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/tenants/${tenant.id}/blog`} className="text-xs font-medium text-gray-500 hover:text-gray-800">
        ← Volver al blog
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">Editar publicación</h1>

      {sp.error === "title" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">El título es obligatorio.</p>
      )}
      {sp.error === "slug" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          Ya existe otra publicación con ese slug.
        </p>
      )}

      <form action={onSave} className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_200px_140px]">
          <input name="title" required defaultValue={post.title} placeholder="Título" className={inputClass} />
          <input name="category" defaultValue={post.category} placeholder="Categoría" className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post.published}
              className="h-4 w-4 accent-sky-600"
            />
            Publicada
          </label>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Slug (URL): /s/{tenant.slug}/blog/…
          </label>
          <input name="slug" defaultValue={post.slug} placeholder="slug-de-la-url" className={inputClass} />
        </div>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post.excerpt}
          placeholder="Resumen corto"
          className={inputClass}
        />
        <textarea
          name="body"
          rows={12}
          defaultValue={post.body}
          placeholder="Contenido. Separá los párrafos con una línea vacía."
          className={inputClass}
        />
        <SubmitButton
          className="justify-self-start rounded-full bg-sky-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Guardar cambios
        </SubmitButton>
      </form>
    </div>
  );
}
