import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  id: string;
  label: string;
  keterangan?: string;
  galat?: string;
};

/** Input berlabel. Pesan galat dan keterangan terhubung lewat aria-describedby. */
export default function Kolom({ id, label, keterangan, galat, ...sisa }: Props) {
  const idKeterangan = keterangan ? `${id}-keterangan` : undefined;
  const idGalat = galat ? `${id}-galat` : undefined;
  const dijelaskanOleh = [idKeterangan, idGalat].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-espresso">
        {label}
      </label>

      {keterangan && (
        <p id={idKeterangan} className="text-sm text-mocha">
          {keterangan}
        </p>
      )}

      <input
        {...sisa}
        id={id}
        aria-describedby={dijelaskanOleh}
        aria-invalid={galat ? true : undefined}
        className={[
          "min-h-sentuh rounded-xl border-2 bg-krem px-4 py-2.5 text-base text-espresso",
          "placeholder:text-mocha/60",
          galat ? "border-bata" : "border-latte",
        ].join(" ")}
      />

      {galat && (
        <p id={idGalat} className="text-sm font-medium text-bata">
          {galat}
        </p>
      )}
    </div>
  );
}
