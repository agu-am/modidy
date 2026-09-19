import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Modidy — Bóveda de Activos Digitales & Matriz de Traspaso Escrow",
  description:
    "Modidy cura MVPs listos para producción, plataformas SaaS autónomas y código probado con traspaso legal inmediato de IP.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jakarta.variable} ${syne.variable} ${grotesk.variable} antialiased`}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* Icon font: next/font no soporta Material Symbols, se carga por link */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      <body className="bg-[#090a0d] text-white min-h-screen relative overflow-x-hidden font-sans selection:bg-[#fe4165] selection:text-white">
        {children}
      </body>
    </html>
  );
}
