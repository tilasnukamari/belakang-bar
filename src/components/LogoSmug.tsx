import Image from "next/image";

/**
 * Logo s'mugKopi.
 *
 * Berkasnya turunan dari public/img/logo/logo.png: dipangkas, latar kremnya
 * dibuat transparan, lalu dikecilkan (1314 KB -> 48/16 KB). Aslinya tetap
 * disimpan di folder yang sama.
 *
 * Teal di logo kontrasnya rendah di atas espresso — pakai hanya di permukaan
 * terang (krem / cream), dan itu yang dipakai kedua shell.
 */
export function MarkSmug({ ukuran = 40, className = "" }: { ukuran?: number; className?: string }) {
  return (
    <Image
      src="/img/logo/smug-mark.png"
      alt=""
      aria-hidden="true"
      width={256}
      height={304}
      priority
      style={{ width: "auto", height: ukuran }}
      className={className}
    />
  );
}

export function LockupSmug({ lebar = 168, className = "" }: { lebar?: number; className?: string }) {
  return (
    <Image
      src="/img/logo/smug-lockup.png"
      alt="s'mugKopi"
      width={480}
      height={670}
      priority
      style={{ width: lebar, height: "auto" }}
      className={className}
    />
  );
}
