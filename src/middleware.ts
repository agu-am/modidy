import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "modidy.com";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname } = request.nextUrl;

  // Producción: subdominio.modidy.com
  const suffix = `.${ROOT_DOMAIN}`;
  let subdomain: string | null = null;

  if (host.endsWith(suffix)) {
    const labels = host.slice(0, -suffix.length).split(".");
    const candidate = labels[labels.length - 1];
    if (candidate !== "www" && candidate !== "") subdomain = candidate;
  }

  // Desarrollo local: sub.localhost:3000
  const local = host.match(/^([^.:]+)\.(?:localhost|127\.0\.0\.1)(?::\d+)?$/);
  if (!subdomain && local && local[1] !== "www") {
    subdomain = local[1];
  }

  // Rutas de la plataforma (panel/API) se sirven igual en apex y subdominios,
  // sin rewrite al sitio del tenant.
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!subdomain || pathname.startsWith(`/s/${subdomain}`)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
