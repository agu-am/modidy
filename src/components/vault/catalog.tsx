"use client";

import { useState } from "react";
import {
  demoFilters,
  demoProducts,
  WHATSAPP_URL,
  type DemoProduct,
} from "@/data/vault";
import { AlertButton } from "./alert-button";
import { VaultImg } from "./vault-img";

const ACTIVE_PILL =
  "filter-pill active px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 bg-gradient-to-r from-[#fe4165] to-[#f95406] text-white shadow-lg shadow-[#fe4165]/40 border border-white/20";
const INACTIVE_PILL =
  "filter-pill px-3.5 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-200 bg-black/60 backdrop-blur-md text-white/85 hover:text-white hover:bg-black/80 border border-white/15 shadow-sm";

function ProductCard({
  product,
  onDetails,
}: {
  product: DemoProduct;
  onDetails: (p: DemoProduct) => void;
}) {
  return (
    <div
      className="product-item glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative group"
      data-category={product.category}
    >
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/15 bg-black/70 group-hover:border-[#fe4165]/70 transition-colors">
          <VaultImg
            alt={product.imgAlt}
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
            src={product.img}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#fe4165]/50 text-[11px] font-mono font-bold text-[#fe7641] flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe4165] animate-pulse" />
              CÓDIGO VERIFICADO
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-xl bg-black/90 backdrop-blur-md border border-[#fe4165]/40 text-sm font-mono font-bold text-white shadow-xl">
              {product.price}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-white/60 mb-1">
            <span>{product.kicker}</span>
            <span className={product.kickerAccentClass}>{product.kickerAccent}</span>
          </div>
          <h3 className="text-xl font-bold font-syne text-white group-hover:text-[#fe7641] transition-colors drop-shadow">
            {product.title}
          </h3>
          <p className="text-xs text-white/75 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.stack.map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded bg-white/[0.08] text-[10px] font-mono text-white/90 border border-white/[0.12]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-5 mt-4 border-t border-white/10">
        <button
          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 hover:border-white/25 text-xs font-mono font-semibold text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
          onClick={() => onDetails(product)}
        >
          <span className="material-symbols-outlined text-sm text-[#fe7641]">info</span>
          <span>Detalles</span>
        </button>
        <AlertButton
          message={product.demoAlert}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641] hover:brightness-110 text-xs font-mono font-bold text-white transition-all shadow-lg shadow-[#fe4165]/35 flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          <span>Live Demo</span>
        </AlertButton>
      </div>
    </div>
  );
}

export function Catalog() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<DemoProduct | null>(null);

  const visible =
    filter === "all"
      ? demoProducts
      : demoProducts.filter((p) => p.category.includes(filter));

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-white/15 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-[#fe4165]/60 mb-4 backdrop-blur-2xl shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe4165] shadow-[0_0_10px_#fe4165] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-white font-bold">
              Páginas para negocios que recién empiezan
            </span>
          </div>
          <h1 className="headline-brutal text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.95] uppercase font-extrabold text-white tracking-tight drop-shadow-2xl">
            Tu primera página en días,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#ffb59c] to-[#fe7641] drop-shadow-[0_4px_16px_rgba(254,65,101,0.5)]">
              sin vueltas.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-md">
            Vos traés la idea, nosotros la ponemos online: moderna, rápida y
            lista para vender.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#fe4165]/30 transition hover:brightness-110 active:scale-95"
            >
              Quiero mi página
            </a>
            <a
              href="#demos"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 active:scale-95"
            >
              Ver ejemplos
            </a>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-white/60">
            Respondemos hoy <span className="text-[#fe7641]">•</span> Sin
            tecnicismos <span className="text-[#fe7641]">•</span> Precio cerrado
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-white/80 font-bold mr-1 drop-shadow">
            FILTROS RÁPIDOS:
          </span>
          {demoFilters.map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? ACTIVE_PILL : INACTIVE_PILL}
              data-filter={f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-6" id="demos">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#fe7641] uppercase tracking-wider font-bold drop-shadow">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              <span>Compra Directa • Full Codebase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-syne text-white tracking-tight mt-1 drop-shadow-lg">
              Laboratorio de Demos &amp; Prototipos Llave en Mano
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-1">
              Plantillas arquitectónicas y prototipos funcionales con precio de
              compra fija inmediata y traspaso total de repositorio.
            </p>
          </div>
          <span className="text-xs font-mono text-white/80 font-medium hidden sm:inline-block bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            6 Proyectos Verificados • Pago Único Sin Regalías
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="productsGrid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onDetails={setSelected} />
          ))}
        </div>
      </section>

      <div
        className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300${
          selected
            ? " opacity-100 pointer-events-auto"
            : " opacity-0 pointer-events-none"
        }`}
      >
        <div className="glass-card bg-[#0b0d12] border border-[#fe4165]/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono text-[#fe7641] uppercase tracking-wider block font-bold">
                Especificación Técnica del Activo
              </span>
              <h3 className="text-2xl font-bold font-syne text-white mt-1">
                {selected?.title ?? "Título del Proyecto"}
              </h3>
            </div>
            <button
              className="p-2 text-white/70 hover:text-white rounded-lg bg-white/[0.08]"
              onClick={() => setSelected(null)}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <div className="space-y-3 text-sm text-white/85">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/50 border border-white/15 font-mono text-xs">
              <span className="text-white/70">Precio Fijo de Compra:</span>
              <span className="font-bold text-white text-sm">
                {selected?.price ?? "$0 USD"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {selected?.modalDesc}
            </p>
            <div className="pt-2">
              <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-2 font-bold">
                Lista de Verificación Escrow Incluida:
              </div>
              <ul className="space-y-2 text-xs font-mono text-white/90">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">
                    check_circle
                  </span>
                  <span>Auditoría de propiedad intelectual y licencias libres de reclamos</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">
                    check_circle
                  </span>
                  <span>Script automatizado de traspaso de propiedad en GitHub</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">
                    check_circle
                  </span>
                  <span>Depósito en custodia protegido vía Escrow.com / Stripe</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-3 border-t border-white/15 flex items-center justify-end gap-3">
            <button
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white transition-all"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>
            <AlertButton
              message="Iniciando contrato de traspaso seguro en Escrow..."
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#fe4165] to-[#f95406] text-white text-xs font-mono font-bold transition-all shadow-lg shadow-[#fe4165]/35 hover:brightness-110"
            >
              Reclamar Derechos de Código
            </AlertButton>
          </div>
        </div>
      </div>
    </>
  );
}
