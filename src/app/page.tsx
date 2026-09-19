import { Background } from "@/components/vault/background";
import { Catalog } from "@/components/vault/catalog";
import { Escrow } from "@/components/vault/escrow";
import { Pricing } from "@/components/vault/pricing";
import { Reales } from "@/components/vault/reales";
import { SiteFooter } from "@/components/vault/site-footer";
import { SiteHeader } from "@/components/vault/site-header";
import { WhatsappFloat } from "@/components/vault/whatsapp-float";

export default function VaultPage() {
  return (
    <>
      <Background />
      <SiteHeader />
      <main className="relative z-10 w-full px-6 md:px-12 lg:px-16 pt-8 pb-16 space-y-20">
        <Catalog />
        <Reales />
        <Pricing />
        <Escrow />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  );
}
