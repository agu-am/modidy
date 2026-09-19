import { WHATSAPP_URL } from "@/data/vault";

// Botón flotante de WhatsApp, solo mobile, siempre visible.
export function WhatsappFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="md:hidden fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/40 transition hover:brightness-110 active:scale-95"
    >
      <span className="material-symbols-outlined text-[28px]">chat</span>
    </a>
  );
}
