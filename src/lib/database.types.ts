export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bahan: {
        Row: {
          aktif: boolean
          dibuat_pada: string
          id: string
          nama: string
          satuan: Database["public"]["Enums"]["satuan"]
          stok_minimum: number
        }
        Insert: {
          aktif?: boolean
          dibuat_pada?: string
          id?: string
          nama: string
          satuan: Database["public"]["Enums"]["satuan"]
          stok_minimum?: number
        }
        Update: {
          aktif?: boolean
          dibuat_pada?: string
          id?: string
          nama?: string
          satuan?: Database["public"]["Enums"]["satuan"]
          stok_minimum?: number
        }
        Relationships: []
      }
      gerakan_stok: {
        Row: {
          alasan: Database["public"]["Enums"]["alasan_waste"] | null
          bahan_id: string
          catatan: string | null
          dibuat_oleh: string | null
          dibuat_pada: string
          id: string
          qty: number
          ref_id: string | null
          ref_tabel: string | null
          tipe: Database["public"]["Enums"]["tipe_gerakan"]
          waktu: string
        }
        Insert: {
          alasan?: Database["public"]["Enums"]["alasan_waste"] | null
          bahan_id: string
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          qty: number
          ref_id?: string | null
          ref_tabel?: string | null
          tipe: Database["public"]["Enums"]["tipe_gerakan"]
          waktu?: string
        }
        Update: {
          alasan?: Database["public"]["Enums"]["alasan_waste"] | null
          bahan_id?: string
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          qty?: number
          ref_id?: string | null
          ref_tabel?: string | null
          tipe?: Database["public"]["Enums"]["tipe_gerakan"]
          waktu?: string
        }
        Relationships: [
          {
            foreignKeyName: "gerakan_stok_bahan_id_fkey"
            columns: ["bahan_id"]
            isOneToOne: false
            referencedRelation: "bahan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gerakan_stok_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      harga_bahan: {
        Row: {
          bahan_id: string
          berlaku_sejak: string
          dibuat_pada: string
          harga_satuan: number
          id: string
          sumber: string | null
        }
        Insert: {
          bahan_id: string
          berlaku_sejak?: string
          dibuat_pada?: string
          harga_satuan: number
          id?: string
          sumber?: string | null
        }
        Update: {
          bahan_id?: string
          berlaku_sejak?: string
          dibuat_pada?: string
          harga_satuan?: number
          id?: string
          sumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "harga_bahan_bahan_id_fkey"
            columns: ["bahan_id"]
            isOneToOne: false
            referencedRelation: "bahan"
            referencedColumns: ["id"]
          },
        ]
      }
      opname: {
        Row: {
          dibuat_oleh: string | null
          dibuat_pada: string
          id: string
          selesai: boolean
          tanggal: string
        }
        Insert: {
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          selesai?: boolean
          tanggal: string
        }
        Update: {
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          selesai?: boolean
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "opname_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      opname_item: {
        Row: {
          bahan_id: string
          dibuat_pada: string
          id: string
          opname_id: string
          qty_fisik: number
          qty_sistem: number
          selisih: number | null
        }
        Insert: {
          bahan_id: string
          dibuat_pada?: string
          id?: string
          opname_id: string
          qty_fisik: number
          qty_sistem: number
          selisih?: number | null
        }
        Update: {
          bahan_id?: string
          dibuat_pada?: string
          id?: string
          opname_id?: string
          qty_fisik?: number
          qty_sistem?: number
          selisih?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opname_item_bahan_id_fkey"
            columns: ["bahan_id"]
            isOneToOne: false
            referencedRelation: "bahan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opname_item_opname_id_fkey"
            columns: ["opname_id"]
            isOneToOne: false
            referencedRelation: "opname"
            referencedColumns: ["id"]
          },
        ]
      }
      pembelian: {
        Row: {
          catatan: string | null
          dibuat_oleh: string | null
          dibuat_pada: string
          id: string
          supplier: string | null
          tanggal: string
        }
        Insert: {
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          supplier?: string | null
          tanggal: string
        }
        Update: {
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          supplier?: string | null
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "pembelian_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
      pembelian_item: {
        Row: {
          bahan_id: string
          dibuat_pada: string
          harga_satuan: number
          id: string
          pembelian_id: string
          qty: number
        }
        Insert: {
          bahan_id: string
          dibuat_pada?: string
          harga_satuan: number
          id?: string
          pembelian_id: string
          qty: number
        }
        Update: {
          bahan_id?: string
          dibuat_pada?: string
          harga_satuan?: number
          id?: string
          pembelian_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "pembelian_item_bahan_id_fkey"
            columns: ["bahan_id"]
            isOneToOne: false
            referencedRelation: "bahan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pembelian_item_pembelian_id_fkey"
            columns: ["pembelian_id"]
            isOneToOne: false
            referencedRelation: "pembelian"
            referencedColumns: ["id"]
          },
        ]
      }
      penjualan: {
        Row: {
          berkas_hash: string
          dibuat_pada: string
          id: string
          metode_bayar: Database["public"]["Enums"]["metode_bayar"]
          ref_pos: string
          tanggal: string
          total: number
          waktu: string | null
        }
        Insert: {
          berkas_hash: string
          dibuat_pada?: string
          id?: string
          metode_bayar?: Database["public"]["Enums"]["metode_bayar"]
          ref_pos: string
          tanggal: string
          total: number
          waktu?: string | null
        }
        Update: {
          berkas_hash?: string
          dibuat_pada?: string
          id?: string
          metode_bayar?: Database["public"]["Enums"]["metode_bayar"]
          ref_pos?: string
          tanggal?: string
          total?: number
          waktu?: string | null
        }
        Relationships: []
      }
      penjualan_item: {
        Row: {
          dibuat_pada: string
          harga: number
          id: string
          penjualan_id: string
          produk_id: string
          qty: number
        }
        Insert: {
          dibuat_pada?: string
          harga: number
          id?: string
          penjualan_id: string
          produk_id: string
          qty: number
        }
        Update: {
          dibuat_pada?: string
          harga?: number
          id?: string
          penjualan_id?: string
          produk_id?: string
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "penjualan_item_penjualan_id_fkey"
            columns: ["penjualan_id"]
            isOneToOne: false
            referencedRelation: "penjualan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penjualan_item_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "hpp_produk"
            referencedColumns: ["produk_id"]
          },
          {
            foreignKeyName: "penjualan_item_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "produk"
            referencedColumns: ["id"]
          },
        ]
      }
      produk: {
        Row: {
          aktif: boolean
          dibuat_pada: string
          harga_jual: number | null
          id: string
          kategori: string | null
          nama: string
        }
        Insert: {
          aktif?: boolean
          dibuat_pada?: string
          harga_jual?: number | null
          id?: string
          kategori?: string | null
          nama: string
        }
        Update: {
          aktif?: boolean
          dibuat_pada?: string
          harga_jual?: number | null
          id?: string
          kategori?: string | null
          nama?: string
        }
        Relationships: []
      }
      profil: {
        Row: {
          aktif: boolean
          dibuat_pada: string
          id: string
          nama: string
          peran: Database["public"]["Enums"]["peran"]
        }
        Insert: {
          aktif?: boolean
          dibuat_pada?: string
          id: string
          nama: string
          peran?: Database["public"]["Enums"]["peran"]
        }
        Update: {
          aktif?: boolean
          dibuat_pada?: string
          id?: string
          nama?: string
          peran?: Database["public"]["Enums"]["peran"]
        }
        Relationships: []
      }
      resep: {
        Row: {
          bahan_id: string
          dibuat_pada: string
          id: string
          jumlah: number
          produk_id: string
        }
        Insert: {
          bahan_id: string
          dibuat_pada?: string
          id?: string
          jumlah: number
          produk_id: string
        }
        Update: {
          bahan_id?: string
          dibuat_pada?: string
          id?: string
          jumlah?: number
          produk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resep_bahan_id_fkey"
            columns: ["bahan_id"]
            isOneToOne: false
            referencedRelation: "bahan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resep_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "hpp_produk"
            referencedColumns: ["produk_id"]
          },
          {
            foreignKeyName: "resep_produk_id_fkey"
            columns: ["produk_id"]
            isOneToOne: false
            referencedRelation: "produk"
            referencedColumns: ["id"]
          },
        ]
      }
      tutup_buku: {
        Row: {
          catatan: string | null
          dibuat_oleh: string | null
          dibuat_pada: string
          id: string
          kas_awal: number
          kas_fisik: number
          sales_total_sistem: number
          sales_tunai_sistem: number
          selisih: number | null
          tanggal: string
        }
        Insert: {
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          kas_awal: number
          kas_fisik: number
          sales_total_sistem: number
          sales_tunai_sistem: number
          selisih?: number | null
          tanggal: string
        }
        Update: {
          catatan?: string | null
          dibuat_oleh?: string | null
          dibuat_pada?: string
          id?: string
          kas_awal?: number
          kas_fisik?: number
          sales_total_sistem?: number
          sales_tunai_sistem?: number
          selisih?: number | null
          tanggal?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutup_buku_dibuat_oleh_fkey"
            columns: ["dibuat_oleh"]
            isOneToOne: false
            referencedRelation: "profil"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      hpp_produk: {
        Row: {
          harga_jual: number | null
          hpp: number | null
          margin_persen: number | null
          margin_rp: number | null
          nama: string | null
          produk_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      peran_saya: { Args: never; Returns: Database["public"]["Enums"]["peran"] }
    }
    Enums: {
      alasan_waste:
        | "tumpah"
        | "kadaluarsa"
        | "shot_gagal"
        | "salah_order"
        | "rusak"
        | "lainnya"
      metode_bayar: "tunai" | "qris" | "lainnya"
      peran: "owner" | "barista"
      satuan: "gr" | "ml" | "pcs"
      tipe_gerakan: "masuk" | "pakai" | "waste" | "penyesuaian"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alasan_waste: [
        "tumpah",
        "kadaluarsa",
        "shot_gagal",
        "salah_order",
        "rusak",
        "lainnya",
      ],
      metode_bayar: ["tunai", "qris", "lainnya"],
      peran: ["owner", "barista"],
      satuan: ["gr", "ml", "pcs"],
      tipe_gerakan: ["masuk", "pakai", "waste", "penyesuaian"],
    },
  },
} as const

