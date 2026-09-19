"use client";

import { useState } from "react";
import { LOGO_FOOTER, LOGO_HEADER, WHATSAPP_URL } from "@/data/vault";
import { VaultImg } from "./vault-img";

const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#demos", label: "Ejemplos" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#suscripciones", label: "Precios" },
];

const mobileLinks = [...navLinks];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090a0d]/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 shrink-0">
            <a
              className="flex items-center gap-2 group focus:outline-none transition-transform hover:opacity-90"
              href="#"
            >
              <VaultImg
                alt="Modidy Logo"
                className="h-7 w-auto object-contain"
                src={LOGO_HEADER}
              />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-semibold tracking-wider uppercase text-white/75 font-sans">
            {navLinks.map((l) => (
              <a
                key={l.href}
                className="hover:text-white transition-colors duration-200 py-1"
                href={l.href}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all duration-300 shadow-lg shadow-[#fe4165]/30 hover:shadow-[#fe4165]/50 active:scale-95 flex items-center gap-2 bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641] hover:brightness-105"
            >
              <span>Empezá ahora</span>
            </a>
            <button
              aria-label="Abrir Menú"
              className="md:hidden p-2 text-white/80 hover:text-white rounded-lg bg-white/[0.06] border border-white/10"
              onClick={() => setMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#090a0d]/95 backdrop-blur-3xl flex flex-col justify-between p-8 transition-all duration-300${
          menuOpen ? " opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between">
          <VaultImg alt="Modidy" className="h-8 w-auto" src={LOGO_FOOTER} />
          <button
            aria-label="Cerrar Menú"
            className="text-white p-2"
            onClick={() => setMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-6 text-center text-2xl font-bold font-syne text-white">
          {mobileLinks.map((l) => (
            <a
              key={l.href}
              className="hover:text-[#fe4165] transition-colors"
              href={l.href}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="w-full text-center py-3.5 bg-gradient-to-r from-[#fe4165] via-[#f95406] to-[#fe7641] rounded-xl text-white font-bold text-sm shadow-xl shadow-[#fe4165]/50"
          >
            Empezá ahora
          </a>
        </div>
      </div>
    </>
  );
}
