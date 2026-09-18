"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/admin/actions";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await logout();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 ${
        pending ? "cursor-wait opacity-60" : ""
      }`}
    >
      {pending ? "Saliendo..." : "Salir"}
    </button>
  );
}