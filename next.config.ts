import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // postgres.js debe ejecutarse sin bundling para que su detección de workerd
  // (import dinamico de cloudflare:sockets) funcione en Cloudflare Workers.
  serverExternalPackages: ["postgres", "cloudflare:sockets"],
};

export default nextConfig;
