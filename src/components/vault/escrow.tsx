import { AlertButton } from "./alert-button";

const metrics = [
  { value: "$8.4M+", valueClass: "text-white", label: "Volumen Transaccionado" },
  {
    value: "100%",
    valueClass:
      "text-transparent bg-clip-text bg-gradient-to-r from-[#fe4165] to-[#fe7641]",
    label: "Cesión Legal de IP",
  },
  { value: "< 4 Horas", valueClass: "text-white", label: "Traspaso de Repositorio & DNS" },
  { value: "24/7", valueClass: "text-[#f95406]", label: "Custodia Legal Escrow" },
];

export function Escrow() {
  return (
    <>
      <section className="p-8 rounded-3xl glass-card border border-white/15 space-y-4" id="escrow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-[#fe7641] font-bold">
              Seguridad Transaccional
            </span>
            <h3 className="text-2xl font-bold font-syne text-white">
              ¿Cómo Funciona el Protocolo Escrow de Modidy?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1">
              Tu inversión se resguarda en una cuenta de depósito en garantía de
              terceros autorizada (Escrow.com / Stripe Vault). Los fondos solo se
              liberan tras tu total verificación del código y migración de DNS.
            </p>
          </div>
          <AlertButton
            message="Abriendo documento legal del Protocolo Escrow..."
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all shrink-0"
          >
            Leer Protocolo Completo
          </AlertButton>
        </div>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/15">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10"
          >
            <div
              className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight drop-shadow ${m.valueClass}`}
            >
              {m.value}
            </div>
            <div className="text-xs text-white/70 font-mono uppercase tracking-wider mt-1.5 font-semibold">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
