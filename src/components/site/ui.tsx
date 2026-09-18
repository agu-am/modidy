import type { ReactNode } from "react";
import type { SiteDesign } from "@/lib/designs";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- */
/* Primitivas del sitio público, estilo shadcn (CVA): leen los      */
/* tokens del diseño activo vía CSS vars y variantes estructurales.  */
/* Server-safe: sin hooks ni estado.                                 */
/* ---------------------------------------------------------------- */

export const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)] duration-700";

/* ------------------------------ Button ---------------------------- */

type ButtonVariant = "primary" | "inverse" | "outline";

export function SiteButton({
  design,
  href,
  children,
  variant = "primary",
  arrow = false,
  className,
}: {
  design: SiteDesign;
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90 active:scale-[0.98]";
  const radius = design.radius === "0px" ? "0px" : "9999px";

  const variants: Record<ButtonVariant, string> = {
    primary: "text-[var(--d-onprimary)]",
    inverse: "text-[var(--d-fg)]",
    outline:
      "border border-[var(--d-border)] text-[var(--d-fg)] bg-transparent hover:bg-[color-mix(in_srgb,var(--d-fg)_5%,transparent)]",
  };

  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { backgroundColor: "var(--site-primary)", color: "var(--d-onprimary)", borderRadius: radius },
    inverse: { backgroundColor: "var(--d-bg)", borderRadius: radius },
    outline: { borderRadius: radius },
  };

  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px",
            variant === "primary" && design.cardStyle === "bezel"
              ? "bg-[color-mix(in_srgb,var(--d-onprimary)_18%,transparent)]"
              : "bg-black/5",
          )}
        >
          ↗
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn("group", base, EASE, variants[variant], className)}
        style={styles[variant]}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      type="submit"
      className={cn("group", base, EASE, variants[variant], className)}
      style={styles[variant]}
    >
      {inner}
    </button>
  );
}

/* ------------------------------- Card ----------------------------- */

export function SiteCard({
  design,
  children,
  className,
}: {
  design: SiteDesign;
  children: ReactNode;
  className?: string;
}) {
  if (design.cardStyle === "bezel") {
    // Double-bezel: cáscara exterior + núcleo interior con radios concéntricos
    return (
      <div
        className={cn(
          "bg-white/5 p-1.5 ring-1 ring-white/10 backdrop-blur-xl",
          className,
        )}
        style={{ borderRadius: "calc(var(--d-radius) + 6px)" }}
      >
        <div
          className="h-full border border-white/10 bg-[color-mix(in_srgb,var(--d-surface)_88%,transparent)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]"
          style={{ borderRadius: "calc(var(--d-radius))" }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (design.cardStyle === "hard") {
    return (
      <div
        className={cn("border-2 border-[var(--d-border)] bg-[var(--d-surface)] p-6", className)}
      >
        {children}
      </div>
    );
  }

  const shadow =
    design.shadowStyle === "subtle-lift"
      ? "shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
      : "";

  return (
    <div
      className={cn(
        design.cardStyle === "bordered" && "border border-[var(--d-border)]",
        "bg-[var(--d-surface)] p-6",
        shadow,
        EASE,
        className,
      )}
      style={{ borderRadius: "var(--d-radius)" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Eyebrow --------------------------- */

export function SiteEyebrow({ design, children }: { design: SiteDesign; children: ReactNode }) {
  if (design.eyebrowStyle === "none") return null;

  if (design.eyebrowStyle === "mono-bracket") {
    return (
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--site-primary)]">
        [ {children} ]
      </p>
    );
  }

  return (
    <p className="mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
      <span
        className="rounded-full px-3 py-1"
        style={{
          backgroundColor: "color-mix(in srgb, var(--site-primary) 10%, var(--d-bg))",
          color: "var(--d-muted)",
        }}
      >
        {children}
      </span>
    </p>
  );
}

/* --------------------------- SectionHeading ----------------------- */

export function SectionHeading({
  design,
  children,
  align = "center",
}: {
  design: SiteDesign;
  children: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <h2
      className={cn(
        "[font-family:var(--d-font-head)] text-3xl font-bold text-[var(--d-fg)] sm:text-4xl",
        design.uppercaseHeadings && "uppercase tracking-tight",
        align === "center" && "text-center",
        align === "left" && "text-left",
      )}
    >
      {children}
    </h2>
  );
}

/* ------------------------------ Inputs ---------------------------- */

const inputBase =
  "w-full border border-[var(--d-border)] bg-[var(--d-bg)] px-4 py-3 text-sm text-[var(--d-fg)] outline-none focus:border-[var(--site-primary)] placeholder:text-[var(--d-muted)]/70 transition-colors";

export function SiteInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(inputBase, props.className)}
      style={{ borderRadius: "calc(var(--d-radius) * 0.75)", ...props.style }}
    />
  );
}

export function SiteTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(inputBase, props.className)}
      style={{ borderRadius: "calc(var(--d-radius) * 0.75)", ...props.style }}
    />
  );
}
