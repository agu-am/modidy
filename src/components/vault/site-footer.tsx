import { LOGO_FOOTER } from "@/data/vault";
import { VaultImg } from "./vault-img";

const links = [
  { href: "#demos", label: "Catálogo Demos" },
  { href: "#reales", label: "Webs Reales" },
  { href: "#suscripciones", label: "Suscripciones" },
  { href: "#escrow", label: "Protocolo Escrow" },
  { href: "#", label: "Términos de Servicio" },
  { href: "#", label: "Política de Privacidad" },
];

export function SiteFooter() {
  return (
    <footer className="relative z-20 w-full border-t border-white/15 bg-[#08090b]/90 backdrop-blur-2xl px-6 md:px-12 lg:px-16 py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-sm">
          <VaultImg alt="Modidy" className="h-7 w-auto object-contain" src={LOGO_FOOTER} />
          <p className="text-xs text-white/60 leading-relaxed font-mono">
            La plataforma líder en intermediación y custodia legal de productos
            digitales llave en mano, prototipos MVP y activos de software
            verificados.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-xs font-mono text-white/75">
          {links.map((l) => (
            <a key={l.label} className="hover:text-[#fe4165] transition-colors" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
        <div>© 2025 Modidy Inc. Todos los derechos reservados.</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Sistemas Operativos &amp; Red Escrow Activa</span>
        </div>
      </div>
    </footer>
  );
}
