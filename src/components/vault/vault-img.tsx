type VaultImgProps = {
  src: string;
  alt: string;
  className?: string;
};

// Imagen remota tal cual el diseño original (hotlink a googleusercontent).
export function VaultImg({ src, alt, className }: VaultImgProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} className={className} src={src} />;
}
