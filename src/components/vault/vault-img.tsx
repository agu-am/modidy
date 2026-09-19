type VaultImgProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

// Imagen remota tal cual el diseño original (hotlink a googleusercontent).
// Por defecto lazy: las tarjetas bajo el fold no compiten por la red inicial.
export function VaultImg({ src, alt, className, loading = "lazy" }: VaultImgProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={className} src={src} loading={loading} decoding="async" />;
}
