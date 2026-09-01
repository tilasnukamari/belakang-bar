import type { ReactNode } from "react";

export type NadaPeringatan = "sukses" | "gagal" | "info";

const gaya: Record<NadaPeringatan, string> = {
  sukses: "border-caramel bg-caramel/10 text-espresso",
  gagal: "border-bata bg-bata/10 text-espresso",
  info: "border-latte bg-cream text-mocha",
};

const label: Record<NadaPeringatan, string> = {
  sukses: "Berhasil",
  gagal: "Gagal",
  info: "Info",
};

export default function Peringatan({
  nada = "info",
  judul,
  children,
}: {
  nada?: NadaPeringatan;
  judul?: string;
  children: ReactNode;
}) {
  return (
    <div
      // assertive untuk gagal: pembaca layar harus menyelanya, bukan menunggu giliran.
      role={nada === "gagal" ? "alert" : "status"}
      className={`rounded-xl border-2 border-l-8 p-4 text-sm leading-relaxed ${gaya[nada]}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest">{judul ?? label[nada]}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
