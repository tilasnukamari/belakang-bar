import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  konfigurasiSupabaseLengkap,
} from "@/lib/supabase/env";

// Status koneksi harus dicek saat request, bukan dibekukan saat build.
export const dynamic = "force-dynamic";

type Status = {
  nada: "sunyi" | "ok" | "gagal";
  label: string;
  pesan: string;
};

async function cekKoneksi(): Promise<Status> {
  if (!konfigurasiSupabaseLengkap()) {
    return {
      nada: "sunyi",
      label: "Belum dikonfigurasi",
      pesan: "Salin .env.example ke .env.local, lalu isi URL dan anon key.",
    };
  }

  try {
    const jawaban = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      cache: "no-store",
    });

    return jawaban.ok
      ? {
          nada: "ok",
          label: "Tersambung",
          pesan: `PostgREST menjawab HTTP ${jawaban.status}.`,
        }
      : {
          nada: "gagal",
          label: "Ditolak",
          pesan: `PostgREST menjawab HTTP ${jawaban.status}. Cek anon key.`,
        };
  } catch (galat) {
    return {
      nada: "gagal",
      label: "Tidak terhubung",
      pesan: galat instanceof Error ? galat.message : "Server tidak menjawab.",
    };
  }
}

const gayaNada: Record<Status["nada"], string> = {
  ok: "border-caramel bg-caramel/10 text-mocha",
  sunyi: "border-latte bg-cream text-mocha",
  gagal: "border-espresso bg-latte text-espresso",
};

export default async function Beranda() {
  const status = await cekKoneksi();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-mocha">
          s&rsquo;mugKopi
        </p>
        <h1 className="mt-1 text-4xl font-extrabold text-espresso">
          Belakang Bar
        </h1>
        <p className="mt-2 text-base text-mocha">
          Aplikasi management internal. Bukan kasir.
        </p>
      </header>

      <section
        className={`rounded-2xl border-2 p-5 ${gayaNada[status.nada]}`}
        aria-live="polite"
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest">
          Koneksi Supabase
        </h2>
        <p className="mt-1 text-2xl font-bold">{status.label}</p>
        <p className="mt-2 text-sm leading-relaxed">{status.pesan}</p>
      </section>

      <p className="text-sm text-mocha">
        Langkah 1 dari 6 — fondasi data. Belum ada UI kerja di sini.
      </p>
    </main>
  );
}
