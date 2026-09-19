import { WHATSAPP_URL, plans } from "@/data/vault";
import { ArsPrice } from "./ars-price";

export function Pricing() {
  return (
    <section className="space-y-10 pt-10 border-t border-white/15" id="suscripciones">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#fe4165]/50 text-[#fe7641] font-mono text-xs uppercase tracking-wider backdrop-blur-md shadow-md">
          <span className="material-symbols-outlined text-sm">credit_card</span>
          <span className="font-bold">Membresías Flexibles Sin Compromiso</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-syne text-white tracking-tight drop-shadow-lg text-balance break-words">
          Planes de Suscripción Mensual &amp; Mantenimiento Continuo
        </h2>
        <p className="text-sm sm:text-base text-white/80 drop-shadow max-w-2xl mx-auto">
          Mantenimiento mensual para que tu web ande, venda y crezca. Precio
          cerrado, sin sorpresas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => {
          const popular = plan.id === "crece";
          return (
            <div
              key={plan.id}
              className={`glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative${
                popular
                  ? " border-2 border-[#fe4165] bg-[#120e14]/95 shadow-[0_0_50px_rgba(254,65,101,0.25)] transform lg:-translate-y-2"
                  : " border border-white/15 hover:border-white/30"
              }`}
            >
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#fe4165] to-[#f95406] text-white font-mono text-[11px] font-extrabold tracking-widest uppercase shadow-lg">
                  MÁS POPULAR
                </div>
              )}
              <div className="space-y-5">
                <div className={`flex items-center justify-between${popular ? " pt-1" : ""}`}>
                  <span className={`text-xs font-mono font-bold tracking-wider ${plan.tagClass}`}>
                    {plan.tag}
                  </span>
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${plan.cornerPillClass}`}>
                    {plan.cornerPill}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-syne text-white">{plan.name}</h3>
                  <p
                    className={`text-xs mt-1 leading-relaxed${
                      popular ? " text-white/80" : " text-white/70"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-2xl border${
                    popular
                      ? " bg-black/70 border-[#fe4165]/40 shadow-inner"
                      : " bg-black/60 border-white/10"
                  }`}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-extrabold font-mono${
                        popular
                          ? " text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb59c] to-[#fe7641]"
                          : " text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-mono font-bold${
                        popular ? " text-[#fe4165]" : " text-[#fe7641]"
                      }`}
                    >
                      USD/mes
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono block mt-0.5${
                      popular ? " text-white/60" : " text-white/50"
                    }`}
                  >
                    {plan.priceNote}
                  </span>
                  <ArsPrice usd={plan.usd} />
                </div>
                <div className="space-y-3 pt-2">
                  <div
                    className={`text-xs font-mono uppercase tracking-wider font-bold${
                      popular ? " text-[#fe7641]" : " text-white/70"
                    }`}
                  >
                    {plan.benefitsTitle}
                  </div>
                  <ul
                    className={`space-y-2.5 text-xs font-mono${
                      popular ? " text-white/95" : " text-white/85"
                    }`}
                  >
                    {plan.benefits.map((b) => (
                      <li key={b.text} className={`flex items-start gap-2.5${b.included ? "" : " text-white/40"}`}>
                        <span
                          className={`material-symbols-outlined text-base shrink-0${
                            b.included ? " text-emerald-400" : " text-white/30"
                          }`}
                        >
                          {b.included ? "check_circle" : "cancel"}
                        </span>
                        <span>{b.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white transition-all shadow-md active:scale-95 text-center${
                  popular ? " py-3.5" : ""
                } ${plan.ctaClass}`}
              >
                Quiero este plan
              </a>
            </div>
          );
        })}
      </div>
      <p className="text-center text-[11px] font-mono text-white/40 max-w-2xl mx-auto">
        Regla de oro: ningún plan incluye rediseño completo ni web nueva. Eso se
        cotiza aparte.
      </p>
    </section>
  );
}
