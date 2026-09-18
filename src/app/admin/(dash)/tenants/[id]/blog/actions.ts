"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deletePostById,
  getTenantById,
  insertPost,
  postSlugExists,
  setPostPublished,
  updatePostById,
} from "@/db/rest";
import { requireMemberOrRedirect } from "@/lib/auth";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function revalidateBlog(tenantId: string) {
  const tenant = await getTenantById(tenantId);
  if (tenant) {
    revalidatePath(`/s/${tenant.slug}/blog`);
  }
  revalidatePath(`/admin/tenants/${tenantId}/blog`);
}

export async function createPost(tenantId: string, formData: FormData): Promise<void> {
  await requireMemberOrRedirect(tenantId);

  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect(`/admin/tenants/${tenantId}/blog?error=title`);

  const slug = slugify(String(formData.get("slug") ?? "") || title) || `post-${Date.now()}`;
  const published = String(formData.get("published")) === "on";

  if (await postSlugExists(tenantId, slug)) {
    redirect(`/admin/tenants/${tenantId}/blog?error=slug`);
  }

  await insertPost({
    tenantId,
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? ""),
    published,
  });

  await revalidateBlog(tenantId);
}

export async function updatePost(
  tenantId: string,
  postId: string,
  formData: FormData,
): Promise<void> {
  await requireMemberOrRedirect(tenantId);

  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect(`/admin/tenants/${tenantId}/blog/${postId}?error=title`);

  const slug = slugify(String(formData.get("slug") ?? "") || title) || `post-${Date.now()}`;

  if (await postSlugExists(tenantId, slug)) {
    const current = await import("@/db/rest").then((m) => m.getPostById(postId, tenantId));
    if (!current || current.slug !== slug) {
      redirect(`/admin/tenants/${tenantId}/blog/${postId}?error=slug`);
    }
  }

  await updatePostById(postId, tenantId, {
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? ""),
    published: String(formData.get("published")) === "on",
  });

  await revalidateBlog(tenantId);
}

export async function togglePublish(
  tenantId: string,
  postId: string,
  published: boolean,
): Promise<void> {
  await requireMemberOrRedirect(tenantId);
  await setPostPublished(postId, tenantId, published);
  await revalidateBlog(tenantId);
}

export async function deletePost(tenantId: string, postId: string): Promise<void> {
  await requireMemberOrRedirect(tenantId);
  await deletePostById(postId, tenantId);
  await revalidateBlog(tenantId);
}
