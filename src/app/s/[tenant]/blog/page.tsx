import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveTenantBySlug, isModuleEnabled, listPublishedPosts } from "@/db/rest";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tenant: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant: slug } = await params;
  const tenant = await getActiveTenantBySlug(slug).catch(() => null);
  return { title: tenant ? `Blog — ${tenant.name}` : "Blog" };
}

export default async function BlogListPage({ params }: Props) {
  const { tenant: slug } = await params;

  const tenant = await getActiveTenantBySlug(slug);
  if (!tenant) notFound();

  if (!(await isModuleEnabled(tenant.id, "blog"))) notFound();

  const rows = await listPublishedPosts(tenant.id);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-black/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {tenant.name}
          </Link>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${tenant.theme?.primary ?? "#0ea5e9"}1a` }}
          >
            Blog
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Blog y novedades</h1>
        <p className="mt-3 max-w-xl text-gray-600">
          Enterate de las últimas noticias de {tenant.name}.
        </p>

        {rows.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
            Todavía no hay publicaciones.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {post.category && (
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                    {post.category}
                  </span>
                )}
                <h2 className="mt-3 text-lg font-semibold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-sky-700">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {post.excerpt || post.body.slice(0, 140)}
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-black/5 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-gray-500">
          <span className="font-bold text-gray-900">{tenant.name}</span>
          <span>{tenant.theme?.footerText ?? ""}</span>
        </div>
      </footer>
    </div>
  );
}
