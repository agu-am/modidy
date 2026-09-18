import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActiveTenantBySlug,
  getPublishedPost,
  isModuleEnabled,
} from "@/db/rest";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ tenant: string; postSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params;
  return { title: `Publicación — ${postSlug}` };
}

export default async function BlogPostPage({ params }: Props) {
  const { tenant: slug, postSlug } = await params;

  const tenant = await getActiveTenantBySlug(slug);
  if (!tenant) notFound();

  if (!(await isModuleEnabled(tenant.id, "blog"))) notFound();

  const post = await getPublishedPost(tenant.id, postSlug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);
  const date = new Date(post.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-black/5">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {tenant.name}
          </Link>
          <Link href="/blog" className="text-sm text-sky-600 hover:text-sky-700">
            ← Volver al blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16">
        {post.category && (
          <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {post.category}
          </span>
        )}
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-gray-400">{date}</p>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-gray-700">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </main>

      <footer className="border-t border-black/5 py-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 text-sm text-gray-500">
          <span className="font-bold text-gray-900">{tenant.name}</span>
          <span>{tenant.theme?.footerText ?? ""}</span>
        </div>
      </footer>
    </div>
  );
}
