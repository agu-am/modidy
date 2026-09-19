// Contenido del vault, transcripto del diseño original (diseno/code.html).

// TODO: reemplazá las X por tu número real de WhatsApp (código país + área + número, sin + ni espacios)
export const WHATSAPP_URL =
  "https://wa.me/549XXXXXXXXXX?text=Hola%20modidy%2C%20quiero%20mi%20primera%20web%20para%20mi%20negocio.%20%C2%BFMe%20pas%C3%A1s%20info%3F";

export const LOGO_HEADER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDwZ-aasDTG4IiS0RPemQ27jwV_CUSH2zAoO7ARKXHZ05fVrON4NrxHIgA7YCvXC34QWGlbTF_fENJNLsj8bb7a39sEdBhyAxYxxaT3FyoB-SN53gqWIl8p2wAw-1N_DyH2VUzw0BMYE0o6gwWd7Ac2q95cB1aU3sS_P_GZa5VxAQiTuO3f-hBv4G2gyIi3o-UJEXW4mQgmP3B_PxI3IOG3DuKpcLdumNsCe8S6s65ovpcjUD2WoGOpoPbOAyYZxlIMFlNqD0bb24e3_w";

export const LOGO_FOOTER =
  "https://lh3.googleusercontent.com/aida/AEtjO1VNIJUpOIfe5FeNa9DUjdxMmptxWsLzc5naoxuSCSfBoIGTHHHLQ6MABnjMFD7hRwJ2peKggkjfky18naWFyMjfSeTK99s3SlOQDhab-bwk_4fHwUlYIPjcvDZgkY63U8TU5l5ArLxUrsGG-UF9ptwsLxqMgrWEXnW17rSBuD9L_pJ6icia65xh9NXWRfg-A4O74FKSUdAvMm1pL2W_vvhsAe_h8rhrrnNsQnh1VX8";

export type DemoProduct = {
  id: string;
  category: string;
  img: string;
  imgAlt: string;
  price: string;
  kicker: string;
  kickerAccent: string;
  kickerAccentClass: string;
  title: string;
  description: string;
  stack: string[];
  modalDesc: string;
  demoAlert: string;
};

const IMG_PULSE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqrHCLHEXHdHN7I4ylbXQsBGr_N3I34rovN0gByQeQKiQozV1T9fe1ezBK-NJHeUHHIfjwGr_qBvL2d4iQfKpXeBhEFSzwVgx6dnoJKkFGO5IhhfOpK-IcoFAgeCSPu8fBJ5__O23lpSWxziZ4HGAo05q4TpzLhluS1BaWPzDmrm5IEEtxqOA3_lpHAcJec82TCPw-wiuO7hc3L2BbrXjWZLc8GOe4P8RF59MYuIM";

const IMG_KROMA =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB_I72ekRIowIP9nAQW1vSsh9gEgpW65imfH2j1ngpRsWr5jLT214ZyJNori-qvf-yD2rvkCfZ_2p8qRkd3r7s0NoxwBIiSQnGzvfnxjGfAADmHvY_wdj2Gv8NxS_XQTA3mYwpMShxJltvgv242PTQ8pb4w3a2p8lOKkpZADDdYLF3miN9fdf7gHHnsY4rDEezIV1bwhcshZtVtzUM1FRh07cYd12oEbHX5c7jr0SXSO_yB7-e4pUbMA7Ld3VU3KXZuBXD64o0Z-F2jPw";

export const demoProducts: DemoProduct[] = [
  {
    id: "pulseai",
    category: "saas fullstack",
    img: IMG_PULSE,
    imgAlt: "PulseAI Preview",
    price: "$3,200 USD",
    kicker: "IA AUTÓNOMA // 01",
    kickerAccent: "Stack Moderno",
    kickerAccentClass: "text-emerald-400 font-bold",
    title: "PulseAI – Analítica Predictiva",
    description:
      "Motor predictivo multi-inquilino con modelos LLM afinados, cobros automatizados con Stripe y enrutador Next.js 15.",
    stack: ["Next.js 15", "OpenAI API", "Tailwind", "Postgres"],
    modalDesc:
      "Plataforma predictiva completa multi-tenant, Next.js 15 de producción, API de búsqueda vectorial, suscripciones con Stripe, contenedores Docker y cesión total de derechos de autor.",
    demoAlert: "Abriendo entorno Live Demo interactivo de PulseAI...",
  },
  {
    id: "kroma",
    category: "saas budget",
    img: IMG_KROMA,
    imgAlt: "Kroma Preview",
    price: "$1,400 USD",
    kicker: "PROTOCOLO FINTECH // 02",
    kickerAccent: "Supabase Ready",
    kickerAccentClass: "text-emerald-400 font-bold",
    title: "Kroma – Suite FinTech",
    description:
      "Libro contable multidivisa, despachador de Webhooks, facturación PDF automatizada y portal de cobro a clientes en tiempo real.",
    stack: ["React 19", "Supabase", "Tailwind", "TypeScript"],
    modalDesc:
      "Esquema contable de doble partida, políticas RLS en Supabase, listeners webhook para Stripe y Plaid, e interfaz de tesorería institucional.",
    demoAlert: "Iniciando demo en vivo de Kroma FinTech...",
  },
  {
    id: "solaria",
    category: "fullstack",
    img: IMG_PULSE,
    imgAlt: "Solaria Preview",
    price: "$2,800 USD",
    kicker: "ERP HOSPITALIDAD // 03",
    kickerAccent: "Alta Demanda",
    kickerAccentClass: "text-[#fe7641] font-bold",
    title: "Solaria – Motor de Reservas",
    description:
      "Sistema automatizado de reservas, sincronización bidireccional con Google Calendar e iCal, comisiones y notificaciones SMS.",
    stack: ["Node.js", "PostgreSQL", "Redis", "Next.js"],
    modalDesc:
      "Arquitectura SaaS multilocales con esquemas PostgreSQL, cuentas custom Stripe Connect, reportes fiscales automáticos y panel de control.",
    demoAlert: "Abriendo staging de Solaria en vivo...",
  },
  {
    id: "aura",
    category: "budget mobile",
    img: IMG_PULSE,
    imgAlt: "Aura Spatial Preview",
    price: "$750 USD",
    kicker: "ESPACIAL & MOBILE // 04",
    kickerAccent: "Swift 6 Listo",
    kickerAccentClass: "text-blue-400 font-bold",
    title: "Aura – Sistema Espacial 3D",
    description:
      "Más de 80 componentes de diseño vidriado táctil, código SwiftUI nativo, shaders con Three.js y escenas RealityKit.",
    stack: ["SwiftUI", "VisionOS", "Three.js", "Figma 100%"],
    modalDesc:
      "Sistema de diseño multiplataforma Vision Pro e iOS. Incluye paquetes Swift listos para compilar, efectos GLSL en Shaders y variables Figma.",
    demoAlert: "Ejecutando simulador espacial WebGL...",
  },
  {
    id: "orbitflow",
    category: "saas fullstack",
    img: IMG_PULSE,
    imgAlt: "OrbitFlow Preview",
    price: "$3,900 USD",
    kicker: "INFRAESTRUCTURA CLOUD // 05",
    kickerAccent: "Producción Directa",
    kickerAccentClass: "text-amber-400 font-bold",
    title: "OrbitFlow – Agente DevOps",
    description:
      "Agente autónomo de auto-reparación para clústeres Kubernetes, bots de telemetría y optimización continua de costos AWS/GCP.",
    stack: ["Golang", "Kubernetes", "GraphQL", "Terraform"],
    modalDesc:
      "Binario distribuido de agente Go, colector de métricas OpenTelemetry, controladores personalizados de Kubernetes y dashboard React.",
    demoAlert: "Simulando entorno activo de clúster OrbitFlow...",
  },
  {
    id: "zenpulse",
    category: "mobile budget",
    img: IMG_PULSE,
    imgAlt: "ZenPulse Preview",
    price: "$1,200 USD",
    kicker: "MOBILE NATIVO // 06",
    kickerAccent: "iOS & Android",
    kickerAccentClass: "text-pink-400 font-bold",
    title: "ZenPulse – Tracker de Hábitos",
    description:
      "Generación de audio binaural para enfoque, gamificación circadiana, sincronización SQLite offline y conexión Apple HealthKit.",
    stack: ["React Native", "Expo SDK 52", "HealthKit", "RevenueCat"],
    modalDesc:
      "Código React Native y Expo con suscripciones configuradas en RevenueCat, integración con Apple HealthKit y diseño vectorizado en Figma.",
    demoAlert: "Lanzando vista previa móvil interactiva...",
  },
];

export type Filter = { id: string; label: string };

export const demoFilters: Filter[] = [
  { id: "all", label: "TODOS LOS ACTIVOS" },
  { id: "budget", label: "< $1,500 USD" },
  { id: "saas", label: "SAAS" },
  { id: "mobile", label: "MOBILE" },
  { id: "fullstack", label: "FULL STACK" },
];

export type RealProject = {
  id: string;
  icon: string;
  iconClass: string;
  cardBorderClass: string;
  title: string;
  badge: string;
  badgeClass: string;
  subtitle: string;
  mrr: string;
  mrrClass: string;
  stats: { label: string; value: string; valueClass: string }[];
  barLabel: string;
  barValue: string;
  barWidthClass: string;
  barGradientClass: string;
  auditAlert: string;
  liveAlert: string;
};

export const realProjects: RealProject[] = [
  {
    id: "novapay",
    icon: "account_balance_wallet",
    iconClass: "text-emerald-400 text-2xl",
    cardBorderClass: "border-emerald-500/30",
    title: "NovaPay Global Ltd.",
    badge: "OPERANDO EN VIVO",
    badgeClass:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    subtitle: "Pasarela B2B de Pagos Transfronterizos LATAM / USA",
    mrr: "$7,200 USD",
    mrrClass: "bg-gradient-to-r from-emerald-400 to-[#fe7641]",
    stats: [
      { label: "Clientes B2B", value: "48 Activos", valueClass: "text-white" },
      { label: "Uptime Servidor", value: "99.98%", valueClass: "text-emerald-400" },
      { label: "Margen Neto", value: "82.4%", valueClass: "text-white" },
      { label: "Crecimiento MoM", value: "+18.6%", valueClass: "text-[#fe7641]" },
    ],
    barLabel: "Capacidad Operativa & Retención de Cohorte",
    barValue: "94.2% Satisfacción",
    barWidthClass: "w-[94%]",
    barGradientClass: "bg-gradient-to-r from-emerald-400 via-[#fe7641] to-[#fe4165]",
    auditAlert:
      "Descargando informe forense y estado de resultados auditado por Stripe...",
    liveAlert: "Redirigiendo a entorno de producción en vivo...",
  },
  {
    id: "talentsync",
    icon: "psychology",
    iconClass: "text-[#fe4165] text-2xl",
    cardBorderClass: "border-[#fe7641]/40",
    title: "TalentSync AI Platform",
    badge: "FACTURANDO",
    badgeClass: "bg-[#fe4165]/20 text-[#fe7641] border-[#fe4165]/40",
    subtitle: "Screening Automatizado de Talento Tech con IA",
    mrr: "$4,850 USD",
    mrrClass: "bg-gradient-to-r from-[#ffffff] to-[#fe7641]",
    stats: [
      { label: "Candidatos Evaluados", value: "12,400+", valueClass: "text-white" },
      { label: "Uptime Servidor", value: "99.95%", valueClass: "text-emerald-400" },
      { label: "Margen Neto", value: "76.8%", valueClass: "text-white" },
      { label: "Crecimiento MoM", value: "+22.4%", valueClass: "text-[#fe7641]" },
    ],
    barLabel: "Conversión de Leads a Suscripción Anual",
    barValue: "88.5% Eficiencia",
    barWidthClass: "w-[88%]",
    barGradientClass: "bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641]",
    auditAlert:
      "Abriendo métricas de retención y métricas de Stripe de TalentSync...",
    liveAlert: "Accediendo a la plataforma activa en producción...",
  },
];

export type PlanBenefit = { text: string; included: boolean };

export type Plan = {
  id: string;
  tag: string;
  tagClass: string;
  cornerPill: string;
  cornerPillClass: string;
  name: string;
  description: string;
  price: string;
  usd: number;
  priceNote: string;
  benefitsTitle: string;
  benefits: PlanBenefit[];
  ctaClass: string;
};

export const plans: Plan[] = [
  {
    id: "base",
    tag: "PLAN 01",
    tagClass: "text-white/60",
    cornerPill: "BASE",
    cornerPillClass: "text-white/50 bg-white/[0.06]",
    name: "Base",
    description: "Quedate online. Para el que solo quiere que ande.",
    price: "$17",
    usd: 17,
    priceNote: "USD/mes · Facturación mensual",
    benefitsTitle: "Beneficios incluidos:",
    benefits: [
      { text: "Hosting + dominio monitoreados, SSL activo", included: true },
      { text: "Backup mensual + updates de seguridad", included: true },
      { text: "1 cambio chico por mes (texto, foto, precio)", included: true },
      { text: "Soporte por WhatsApp 48hs", included: true },
    ],
    ctaClass: "bg-white/10 hover:bg-white/20 border border-white/15",
  },
  {
    id: "crece",
    tag: "PLAN 02",
    tagClass: "text-[#fe7641]",
    cornerPill: "RECOMENDADO",
    cornerPillClass:
      "text-[#fe4165] bg-[#fe4165]/20 border border-[#fe4165]/30 font-bold",
    name: "Crecé",
    description: "Para el que quiere vender más, no solo existir.",
    price: "$39",
    usd: 39,
    priceNote: "USD/mes · Facturación mensual",
    benefitsTitle: "Beneficios específicos incluidos:",
    benefits: [
      { text: "Todo lo del Base", included: true },
      { text: "Backup semanal + monitoreo uptime", included: true },
      {
        text: "Hasta 4 cambios por mes + 1 sección nueva chica por trimestre",
        included: true,
      },
      { text: "Velocidad + SEO básico revisados cada mes", included: true },
      {
        text: "Reporte simple por WhatsApp: visitas y qué mejorar",
        included: true,
      },
      { text: "Soporte prioritario 24hs", included: true },
    ],
    ctaClass:
      "bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641] hover:brightness-110 shadow-xl shadow-[#fe4165]/40",
  },
  {
    id: "total",
    tag: "PLAN 03",
    tagClass: "text-white/60",
    cornerPill: "TOTAL",
    cornerPillClass: "text-amber-400 bg-amber-400/10 border border-amber-400/20",
    name: "Total",
    description: "Despegá. Para el que te deriva todo y no toca nada.",
    price: "$89",
    usd: 89,
    priceNote: "USD/mes · Facturación mensual",
    benefitsTitle: "Beneficios incluidos:",
    benefits: [
      { text: "Todo lo del Crecé", included: true },
      { text: "Cambios ilimitados razonables (tope 8hs/mes)", included: true },
      { text: "1 landing o promo nueva por mes", included: true },
      { text: "Copy y diseño de promos incluido", included: true },
      { text: "Respuesta mismo día", included: true },
    ],
    ctaClass:
      "bg-white/10 hover:bg-[#fe4165]/30 hover:text-[#fe7641] border border-white/15",
  },
];
