export type NavStyle = "bar" | "floating-pill";
export type HeroLayout = "gradient" | "serif-light" | "bold-block" | "split";
export type CardStyle = "flat" | "bordered" | "bezel" | "hard";
export type ShadowStyle = "none" | "diffuse-glow" | "subtle-lift";
export type EyebrowStyle = "pill" | "mono-bracket" | "none";

export type SiteDesign = {
  id: string;
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  border: string;
  primary: string;
  onPrimary: string;
  heroGradientEnd: string;
  headingFont: string;
  bodyFont: string;
  radius: string;
  heroLayout: HeroLayout;
  navStyle: NavStyle;
  cardStyle: CardStyle;
  shadowStyle: ShadowStyle;
  eyebrowStyle: EyebrowStyle;
  sectionRhythm: "standard" | "airy";
  monoMeta: boolean;
  uppercaseHeadings: boolean;
  scanlines?: boolean;
};

type Archetype = SiteDesign & { label: string; description: string };

const EDITORIAL: Archetype = {
  id: "editorial",
  label: "Editorial",
  description:
    "Monocromo cálido tipo revista: serif Newsreader, líneas de 1px, botones negros rectos. Cero ruido.",
  bg: "#FBFBFA",
  surface: "#FFFFFF",
  fg: "#111111",
  muted: "#787774",
  border: "#E9E9E7",
  primary: "#111111",
  onPrimary: "#FFFFFF",
  heroGradientEnd: "#EDEDEB",
  headingFont: "Newsreader",
  bodyFont: "Figtree",
  radius: "10px",
  heroLayout: "serif-light",
  navStyle: "bar",
  cardStyle: "bordered",
  shadowStyle: "none",
  eyebrowStyle: "pill",
  sectionRhythm: "standard",
  monoMeta: false,
  uppercaseHeadings: false,
};

const GLASS: Archetype = {
  id: "glass",
  label: "Glass",
  description:
    "OLED profundo con orbes violeta y esmeralda, tarjetas bezel translúcidas, nav píldora flotante. Tech premium.",
  bg: "#050505",
  surface: "#121218",
  fg: "#F5F5F7",
  muted: "#8E8E99",
  border: "#232330",
  primary: "#8B7CF7",
  onPrimary: "#0B0B10",
  heroGradientEnd: "#2D1B69",
  headingFont: "Space Grotesk",
  bodyFont: "Plus Jakarta Sans",
  radius: "28px",
  heroLayout: "gradient",
  navStyle: "floating-pill",
  cardStyle: "bezel",
  shadowStyle: "diffuse-glow",
  eyebrowStyle: "pill",
  sectionRhythm: "airy",
  monoMeta: false,
  uppercaseHeadings: false,
};

const SUAVE: Archetype = {
  id: "suave",
  label: "Suave Lux",
  description:
    "Crema editorial con salvia profunda, Playfair Display + Lora, sombras difusas y mucho aire. Elegancia tranquila.",
  bg: "#FDFBF7",
  surface: "#FFFFFF",
  fg: "#241C15",
  muted: "#857A6E",
  border: "#E7DECF",
  primary: "#40573F",
  onPrimary: "#FDFBF7",
  heroGradientEnd: "#E9E0CE",
  headingFont: "Playfair Display",
  bodyFont: "Lora",
  radius: "18px",
  heroLayout: "serif-light",
  navStyle: "bar",
  cardStyle: "flat",
  shadowStyle: "subtle-lift",
  eyebrowStyle: "pill",
  sectionRhythm: "airy",
  monoMeta: false,
  uppercaseHeadings: false,
};

const INDUSTRIAL: Archetype = {
  id: "industrial",
  label: "Industrial",
  description:
    "Papel mate, tinta carbón y rojo aviación como único acento. Archivo Black sangrando el viewport, cajas de 2px, radio 0.",
  bg: "#F4F4F0",
  surface: "#EAE8E3",
  fg: "#0A0A0A",
  muted: "#55554F",
  border: "#0A0A0A",
  primary: "#E61919",
  onPrimary: "#F4F4F0",
  heroGradientEnd: "#0A0A0A",
  headingFont: "Archivo Black",
  bodyFont: "Archivo",
  radius: "0px",
  heroLayout: "bold-block",
  navStyle: "bar",
  cardStyle: "hard",
  shadowStyle: "none",
  eyebrowStyle: "mono-bracket",
  sectionRhythm: "standard",
  monoMeta: true,
  uppercaseHeadings: true,
};

const TERMINAL: Archetype = {
  id: "terminal",
  label: "Terminal",
  description:
    "CRT fósforo: todo monoespaciado en mayúscula, scanlines, corchetes ASCII y verde como único indicador.",
  bg: "#0A0A0A",
  surface: "#121212",
  fg: "#EAEAEA",
  muted: "#8A8A8A",
  border: "#262626",
  primary: "#EAEAEA",
  onPrimary: "#0A0A0A",
  heroGradientEnd: "#141414",
  headingFont: "JetBrains Mono",
  bodyFont: "IBM Plex Mono",
  radius: "0px",
  heroLayout: "bold-block",
  navStyle: "bar",
  cardStyle: "bordered",
  shadowStyle: "none",
  eyebrowStyle: "mono-bracket",
  sectionRhythm: "standard",
  monoMeta: true,
  uppercaseHeadings: true,
  scanlines: true,
};

/** Los 5 arquetipos completos — cada uno fiel a su skill fuente. */
export const PRESETS: Array<SiteDesign & { label: string; description: string }> = [
  EDITORIAL,
  GLASS,
  SUAVE,
  INDUSTRIAL,
  TERMINAL,
];

/** Acentos compatibles por arquetipo para variar sin romper coherencia. */
const ACCENTS: Record<string, string[]> = {
  editorial: ["#111111", "#1F6C9F", "#346538", "#9F2F2D"],
  glass: ["#8B7CF7", "#34D399", "#60A5FA"],
  suave: ["#40573F", "#A15C48", "#7C2D12"],
  industrial: ["#E61919", "#FF2A2A", "#0A0A0A"],
  terminal: ["#4AF626", "#EAEAEA", "#FF2A2A"],
};

const RADII: Record<string, string[]> = {
  editorial: ["8px", "10px", "12px"],
  glass: ["22px", "28px", "32px"],
  suave: ["16px", "18px", "22px"],
  industrial: ["0px"],
  terminal: ["0px"],
};

const HEROES: Record<string, HeroLayout[]> = {
  editorial: ["serif-light", "split"],
  glass: ["gradient", "split", "bold-block"],
  suave: ["serif-light", "gradient"],
  industrial: ["bold-block"],
  terminal: ["bold-block"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Aleatorio v2: elige un arquetipo completo (estructura coherente garantizada)
 * y le aplica variaciones menores permitidas por su propio skill.
 */
export function randomDesign(): SiteDesign {
  const base = pick(PRESETS);
  const accent = pick(ACCENTS[base.id] ?? [base.primary]);
  const heroLayout = pick(HEROES[base.id] ?? [base.heroLayout]);

  return {
    ...base,
    id: `random-${base.id}`,
    primary: accent,
    onPrimary: base.bg,
    heroLayout,
    heroGradientEnd:
      heroLayout === "gradient"
        ? pick([base.muted, base.border, base.heroGradientEnd])
        : base.heroGradientEnd,
    uppercaseHeadings: base.uppercaseHeadings || heroLayout === "bold-block",
  };
}

/** Compatibilidad con sitios creados antes del sistema de diseños. */
export function classicDesign(primary?: string): SiteDesign {
  return {
    id: "clasico",
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    fg: "#111827",
    muted: "#4B5563",
    border: "#F3F4F6",
    primary: primary || "#0EA5E9",
    onPrimary: "#FFFFFF",
    heroGradientEnd: "#0F172A",
    headingFont: "Archivo",
    bodyFont: "Figtree",
    radius: "16px",
    heroLayout: "gradient",
    navStyle: "bar",
    cardStyle: "bordered",
    shadowStyle: "subtle-lift",
    eyebrowStyle: "pill",
    sectionRhythm: "standard",
    monoMeta: false,
    uppercaseHeadings: false,
  };
}

type RawDesign = Record<string, unknown> | null | undefined;

/** Normaliza lo guardado en DB (formato v1 o v2) a un SiteDesign completo. */
export function resolveDesign(design: RawDesign, legacyPrimary?: string): SiteDesign {
  const classic = classicDesign(legacyPrimary);
  if (!design || typeof design !== "object") return classic;

  const d = design as Partial<SiteDesign> & { heroStyle?: HeroLayout };
  if (!d.primary || !d.bg) return classic;

  // Compat v1: heroStyle -> heroLayout
  const heroLayout: HeroLayout =
    d.heroLayout ?? d.heroStyle ?? classic.heroLayout;

  return {
    id: typeof d.id === "string" ? d.id : "custom",
    bg: d.bg ?? classic.bg,
    surface: d.surface ?? classic.surface,
    fg: d.fg ?? classic.fg,
    muted: d.muted ?? classic.muted,
    border: d.border ?? classic.border,
    primary: d.primary,
    onPrimary: d.onPrimary ?? "#FFFFFF",
    heroGradientEnd: d.heroGradientEnd ?? classic.heroGradientEnd,
    headingFont: d.headingFont ?? classic.headingFont,
    bodyFont: d.bodyFont ?? classic.bodyFont,
    radius: d.radius ?? classic.radius,
    heroLayout,
    navStyle: d.navStyle ?? "bar",
    cardStyle: d.cardStyle ?? (d.radius === "0px" ? "hard" : "bordered"),
    shadowStyle: d.shadowStyle ?? "none",
    eyebrowStyle: d.eyebrowStyle ?? "pill",
    sectionRhythm: d.sectionRhythm ?? "standard",
    monoMeta: !!d.monoMeta,
    uppercaseHeadings: !!d.uppercaseHeadings || heroLayout === "bold-block",
    scanlines: !!d.scanlines,
  };
}

/** Tags <link> para cargar las familias desde Google Fonts. */
export function fontLinks(designs: SiteDesign[]): Array<{ href: string }> {
  const families = new Set<string>();
  for (const d of designs) {
    families.add(d.headingFont);
    families.add(d.bodyFont);
  }
  const q = [...families]
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;900`)
    .join("&");
  return [{ href: `https://fonts.googleapis.com/css2?${q}&display=swap` }];
}
