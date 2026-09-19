# Modidy — Bóveda de Activos Digitales

Landing del vault/escrow de Modidy: catálogo de demos, webs reales en operación,
planes de suscripción y protocolo escrow. Diseño portado de `diseno/code.html`
(sistema "Vibrant Bubbly Neo-Grotesque" en `diseno/DESIGN.md`).

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4. Deploy en Cloudflare Workers vía OpenNext.

## Desarrollo

```bash
npm install
npm run dev
```

## Contenido

Todo el contenido vive en [`src/data/vault.ts`](src/data/vault.ts): productos demo,
filtros, proyectos reales y planes. Los componentes están en
[`src/components/vault/`](src/components/vault/).

## Deploy

```bash
npm run build
npx wrangler deploy
```

## Historia

Este repo fue antes un portfolio de desarrollador y antes la plataforma SaaS
multi-tenant "Modidy". Ese trabajo quedó resguardado en la rama
`archive/modidy-saas`.
