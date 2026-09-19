"use client";

import type { ReactNode } from "react";

type AlertButtonProps = {
  message: string;
  className?: string;
  children: ReactNode;
};

// Replica los onclick="alert(...)" del diseño original.
export function AlertButton({ message, className, children }: AlertButtonProps) {
  return (
    <button type="button" className={className} onClick={() => alert(message)}>
      {children}
    </button>
  );
}
