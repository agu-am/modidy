export const dynamic = "force-dynamic";

async function fromDolarApi(): Promise<number | null> {
  try {
    const r = await fetch("https://dolarapi.com/v1/dolares/blue", {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return typeof d?.venta === "number" ? d.venta : null;
  } catch {
    return null;
  }
}

async function fromBluelytics(): Promise<number | null> {
  try {
    const r = await fetch("https://api.bluelytics.com.ar/v2/latest", {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return typeof d?.blue?.value_sell === "number" ? d.blue.value_sell : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const rate = (await fromDolarApi()) ?? (await fromBluelytics());
  if (rate === null) {
    return Response.json({ rate: null }, { status: 502 });
  }
  return Response.json({ rate });
}
