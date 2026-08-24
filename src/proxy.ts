import { NextResponse, type NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "modidy.com";
const ADMIN_COOKIE = "modidy_admin";

function getSubdomain(host: string): string | null {
  const hostname = host.split(":")[0]!.toLowerCase();

  if (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".workers.dev") ||
    hostname.endsWith(".vercel.app")
  ) {
    return null;
  }

  // cliente.modidy.com
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = hostname.slice(0, -(ROOT_DOMAIN.length + 1));
    if (sub && !sub.includes(".") && sub !== "www") return sub;
    return null;
  }

  // cliente.localhost (desarrollo)
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    if (sub && !sub.includes(".")) return sub;
  }

  return null;
}

async function expectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const data = new TextEncoder().encode(`${password}:modidy`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // Protección básica de /admin hasta implementar Supabase Auth (Fase 2)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await expectedAdminToken();
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || cookie !== token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const subdomain = getSubdomain(host);
  if (subdomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
