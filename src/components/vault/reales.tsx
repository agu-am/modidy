import { realProjects } from "@/data/vault";
import { AlertButton } from "./alert-button";

export function Reales() {
  return (
    <section className="space-y-6 pt-10 border-t border-white/15" id="reales">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Métricas Auditadas en Tiempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne text-white tracking-tight mt-2 drop-shadow-lg">
            Ecosistema de Plataformas Reales en Operación
          </h2>
          <p className="text-sm text-white/80 max-w-2xl mt-1">
            Negocios consolidados con usuarios activos, contratos B2B vigentes y
            facturación mensual verificada listos para cambio de titularidad
            societaria.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#fe7641] bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
            <strong className="text-white">Auditoría Stripe:</strong> 100% Sin Deuda
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realProjects.map((p) => (
          <div
            key={p.id}
            className={`glass-card rounded-3xl p-6 sm:p-7 border ${p.cardBorderClass} bg-[#0c0f14]/90 space-y-6 relative overflow-hidden`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-[#fe7641] p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-[#090a0d] rounded-[14px] flex items-center justify-center">
                    <span className={`material-symbols-outlined ${p.iconClass}`}>
                      {p.icon}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-syne text-white">{p.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${p.badgeClass}`}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 font-mono">{p.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-white/60 uppercase">MRR Auditado</div>
                <div
                  className={`text-2xl font-mono font-extrabold text-transparent bg-clip-text ${p.mrrClass}`}
                >
                  {p.mrr}
                  <span className="text-xs text-white/70">/mes</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 text-center">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <span className="text-[10px] font-mono text-white/60 uppercase block">
                    {s.label}
                  </span>
                  <span className={`text-lg font-mono font-bold ${s.valueClass}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-white/70">
                <span>{p.barLabel}</span>
                <span className="text-white font-bold">{p.barValue}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.barGradientClass} ${p.barWidthClass}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <AlertButton
                message={p.auditAlert}
                className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm text-emerald-400">
                  description
                </span>
                <span>Informe de Auditoría</span>
              </AlertButton>
              <AlertButton
                message={p.liveAlert}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#fe4165] to-[#f95406] hover:brightness-110 text-xs font-mono font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#fe4165]/30"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Explorar en Vivo</span>
              </AlertButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
