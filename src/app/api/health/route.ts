import { sb } from "@/db/rest";

export const dynamic = "force-dynamic";

export async function GET() {
  const t0 = Date.now();
  try {
    const { error } = await sb().from("tenants").select("id").limit(1);
    if (error) throw new Error(error.message);
    return Response.json({ ok: true, via: "rest", ms: Date.now() - t0 });
  } catch (e) {
    return Response.json(
      { ok: false, error: String(e).slice(0, 180), ms: Date.now() - t0 },
      { status: 500 },
    );
  }
}
