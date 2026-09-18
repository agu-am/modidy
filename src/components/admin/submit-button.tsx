"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de submit consciente del estado del form padre (server action).
 * Mientras la acción corre: se deshabilita, atenúa y muestra un indicador,
 * sin recargar ni navegar — la página se actualiza sola al terminar.
 */
export function SubmitButton({
  children,
  className = "",
  disabled = false,
  title,
  name,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name={name}
      value={value}
      title={title}
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className} ${pending ? "cursor-wait opacity-60" : ""}`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
