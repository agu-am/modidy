// Fondo aurora cromático + grano procedural, tal cual el diseño original.
export function Background() {
  return (
    <>
      <svg aria-hidden="true" className="hidden">
        <filter id="heavyGrain">
          <feTurbulence
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
            type="fractalNoise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
          />
        </filter>
      </svg>
      <div className="noise-overlay animate-grain-jitter" />
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0d0a10]" />
        <div className="absolute -top-[25%] -left-[15%] w-[110vw] h-[75vh] rounded-[48%] bg-gradient-to-br from-[#fe4165] via-[#fe7641] to-transparent opacity-85 blur-[120px] mix-blend-screen aurora-blob animate-aurora-1" />
        <div className="hidden md:block absolute top-[20%] -right-[20%] w-[115vw] h-[85vh] rounded-[52%] bg-gradient-to-tl from-[#f95406] via-[#fe4165]/80 to-[#fe7641]/70 opacity-90 blur-[130px] mix-blend-screen aurora-blob animate-aurora-2" />
        <div className="absolute top-[48%] left-[-10%] w-[120vw] h-[70vh] rounded-[50%] bg-gradient-to-r from-[#fe7641] via-[#f95406]/90 to-[#fe4165] opacity-80 blur-[140px] mix-blend-screen aurora-blob animate-aurora-3" />
        <div className="absolute -bottom-[20%] left-[10%] w-[100vw] h-[80vh] rounded-[45%] bg-gradient-to-tr from-[#fe4165]/90 via-[#f95406] to-[#fe7641]/80 opacity-85 blur-[130px] mix-blend-screen aurora-blob animate-aurora-1" />
        <div className="hidden md:block absolute top-[12%] left-[30%] w-[45vw] h-[35vh] rounded-full bg-[#fe7641] opacity-75 blur-[95px] mix-blend-screen aurora-blob" />
        <div className="hidden md:block absolute top-[65%] right-[15%] w-[50vw] h-[40vh] rounded-full bg-[#fe4165] opacity-80 blur-[100px] mix-blend-screen aurora-blob" />
        <div className="tactile-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      </div>
    </>
  );
}
