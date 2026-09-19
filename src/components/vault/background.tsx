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
        <div className="absolute -top-[25%] -left-[15%] w-[110vw] h-[75vh] rounded-[48%] bg-gradient-to-br from-[#fe4165] via-[#fe7641] to-transparent opacity-85 blur-[120px] mix-blend-screen animate-aurora-1" />
        <div className="absolute top-[20%] -right-[20%] w-[115vw] h-[85vh] rounded-[52%] bg-gradient-to-tl from-[#f95406] via-[#fe4165]/80 to-[#fe7641]/70 opacity-90 blur-[130px] mix-blend-screen animate-aurora-2" />
        <div className="absolute top-[48%] left-[-10%] w-[120vw] h-[70vh] rounded-[50%] bg-gradient-to-r from-[#fe7641] via-[#f95406]/90 to-[#fe4165] opacity-80 blur-[140px] mix-blend-screen animate-aurora-3" />
        <div className="absolute -bottom-[20%] left-[10%] w-[100vw] h-[80vh] rounded-[45%] bg-gradient-to-tr from-[#fe4165]/90 via-[#f95406] to-[#fe7641]/80 opacity-85 blur-[130px] mix-blend-screen animate-aurora-1" />
        <div className="absolute top-[12%] left-[30%] w-[45vw] h-[35vh] rounded-full bg-[#fe7641] opacity-75 blur-[95px] mix-blend-screen" />
        <div className="absolute top-[65%] right-[15%] w-[50vw] h-[40vh] rounded-full bg-[#fe4165] opacity-80 blur-[100px] mix-blend-screen" />
        <div className="tactile-mesh" />
        <div className="absolute w-2 h-2 rounded-full bg-white top-[15%] left-[20%] animate-particle-twinkle shadow-[0_0_12px_#ffffff]" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#ffeedd] top-[30%] left-[80%] animate-particle-twinkle [animation-delay:4.5s] shadow-[0_0_14px_#f95406]" />
        <div className="absolute w-2 h-2 rounded-full bg-white top-[58%] left-[45%] animate-particle-twinkle [animation-delay:8.2s]" />
        <div className="absolute w-3 h-3 rounded-full bg-[#ffb59b] top-[78%] left-[18%] animate-particle-twinkle [animation-delay:3.0s] shadow-[0_0_16px_#fe4165]" />
        <div className="absolute w-2 h-2 rounded-full bg-white top-[88%] left-[85%] animate-particle-twinkle [animation-delay:6.5s] shadow-[0_0_10px_#ffffff]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      </div>
    </>
  );
}
