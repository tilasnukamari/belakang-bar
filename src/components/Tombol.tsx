"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type VarianTombol = "utama" | "sekunder" | "bahaya";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  varian?: VarianTombol;
  memuat?: boolean;
  lebarPenuh?: boolean;
  children: ReactNode;
};

const gayaVarian: Record<VarianTombol, string> = {
  utama: "bg-caramel text-espresso border-caramel hover:bg-mocha hover:text-krem hover:border-mocha",
  sekunder: "bg-cream text-espresso border-latte hover:bg-latte",
  bahaya: "bg-bata text-krem border-bata hover:bg-espresso hover:border-espresso",
};

/**
 * Tinggi minimum 44px, bukan angka gaya-gayaan: itu aturan mati #1 dalam bentuk
 * fisik. Tombol kecil membuat input 10 detik jadi 30 detik di bar.
 */
export default function Tombol({
  varian = "utama",
  memuat = false,
  lebarPenuh = false,
  disabled,
  children,
  ...sisa
}: Props) {
  const mati = disabled || memuat;

  return (
    <button
      {...sisa}
      disabled={mati}
      aria-busy={memuat || undefined}
      className={[
        "inline-flex min-h-sentuh items-center justify-center gap-2 rounded-xl border-2",
        "px-5 py-2.5 text-base font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        gayaVarian[varian],
        lebarPenuh ? "w-full" : "",
      ].join(" ")}
    >
      {memuat && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
