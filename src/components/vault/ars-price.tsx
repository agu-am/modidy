"use client";

import { useEffect, useState } from "react";

let ratePromise: Promise<number | null> | null = null;

// La cotización se pide a nuestra propia API (/api/dolar-blue) para evitar
// bloqueos del navegador a dominios de terceros. El servidor consulta el
// blue con respaldo entre dos fuentes. Se cachea: una sola request.
function getBlueRate(): Promise<number | null> {
  if (!ratePromise) {
    ratePromise = fetch("/api/dolar-blue", {
      signal: AbortSignal.timeout(10000),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (typeof d?.rate === "number" ? d.rate : null))
      .catch(() => null);
  }
  return ratePromise;
}

const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function ArsPrice({ usd }: { usd: number }) {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    getBlueRate().then(setRate);
  }, []);

  if (rate === null) {
    return (
      <span className="text-[11px] font-mono text-white/30 block mt-1 animate-pulse">
        ≈ consultando blue…
      </span>
    );
  }

  return (
    <span className="text-[11px] font-mono text-white/50 block mt-1">
      ≈ ${fmt.format(Math.round(usd * rate))} ARS{" "}
      <span className="text-white/30">(blue ${fmt.format(rate)})</span>
    </span>
  );
}
