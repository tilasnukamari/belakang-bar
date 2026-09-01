"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_BARISTA } from "@/lib/navigasi";

/**
 * Shell BARISTA: berdiri, satu tangan, HP, sering buru-buru.
 * Bottom nav karena jempol tidak sampai ke atas layar. Empat item, tidak lebih.
 * Tiap target dijaga minimal 44px lewat min-h-sentuh.
 */
export default function NavBarista() {
  const path = usePathname();
  const aktif = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Menu barista"
      className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-latte bg-cream pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {NAV_BARISTA.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={aktif(i.href) ? "page" : undefined}
              className={`flex min-h-sentuh flex-col items-center justify-center gap-0.5 px-1 py-2 text-center text-xs font-bold leading-tight ${
                aktif(i.href) ? "text-espresso" : "text-mocha"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1 w-8 rounded-full ${aktif(i.href) ? "bg-caramel" : "bg-transparent"}`}
              />
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
