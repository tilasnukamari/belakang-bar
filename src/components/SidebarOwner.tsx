"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MarkSmug } from "@/components/LogoSmug";
import { NAV_OWNER } from "@/lib/navigasi";

/**
 * Shell OWNER: duduk, layar lebar, membaca angka. Sidebar tetap di lg ke atas;
 * di layar sempit turun jadi baris nav yang bisa digeser, bukan hamburger —
 * tujuh item masih terbaca sekali lihat.
 */
export default function SidebarOwner({ nama }: { nama: string }) {
  const path = usePathname();
  const aktif = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r-2 border-latte bg-cream lg:flex lg:flex-col">
        <div className="border-b-2 border-latte px-5 py-6">
          <div className="flex items-center gap-3">
            <MarkSmug ukuran={36} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-mocha">
                s&rsquo;mugKopi
              </p>
              <p className="text-lg font-extrabold leading-tight text-espresso">Belakang Bar</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-mocha">
            Masuk sebagai <span className="font-semibold text-espresso">{nama}</span>
          </p>
        </div>

        <nav aria-label="Menu utama" className="flex flex-col gap-1 p-3">
          {NAV_OWNER.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              aria-current={aktif(i.href) ? "page" : undefined}
              className={`flex min-h-sentuh items-center rounded-lg px-4 text-sm font-semibold transition-colors ${
                aktif(i.href)
                  ? "bg-caramel text-espresso"
                  : "text-mocha hover:bg-latte hover:text-espresso"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="border-b-2 border-latte bg-cream lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <div className="flex items-center gap-2">
            <MarkSmug ukuran={28} />
            <p className="text-lg font-extrabold text-espresso">Belakang Bar</p>
          </div>
          <p className="truncate text-sm text-mocha">{nama}</p>
        </div>
        <nav aria-label="Menu utama" className="flex gap-1 overflow-x-auto px-3 py-3">
          {NAV_OWNER.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              aria-current={aktif(i.href) ? "page" : undefined}
              className={`flex min-h-sentuh shrink-0 items-center rounded-lg px-4 text-sm font-semibold ${
                aktif(i.href) ? "bg-caramel text-espresso" : "text-mocha hover:bg-latte"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
