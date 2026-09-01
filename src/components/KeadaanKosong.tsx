import type { ReactNode } from "react";

/**
 * Keadaan kosong yang jujur: apa yang belum ada, dan apa yang harus diisi
 * supaya terisi. Tidak pernah diisi angka contoh — sekali ada yang screenshot,
 * angka karangan itu jadi kelihatan seperti kenyataan.
 */
export default function KeadaanKosong({
  judul,
  children,
  langkah,
}: {
  judul: string;
  children?: ReactNode;
  /** Nomor langkah kapan halaman ini akan dibangun. */
  langkah?: number;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-latte bg-cream p-6">
      {langkah !== undefined && (
        <span className="inline-block rounded-full bg-latte px-3 py-1 text-xs font-bold uppercase tracking-widest text-espresso">
          Belum dibangun &middot; langkah {langkah}
        </span>
      )}
      <h2 className="mt-3 text-lg font-bold text-espresso">{judul}</h2>
      {children && <div className="mt-1 text-sm leading-relaxed text-mocha">{children}</div>}
    </div>
  );
}
