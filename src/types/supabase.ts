/**
 * Kiểu dữ liệu từ Supabase (snake_case) — tương ứng bảng `leads`
 */
export interface LeadRow {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  age_group: string;
  program_interest: string;
  campus_or_region: string;
  lead_source: string;
  notes: string;
  status: string;
  score: number;
  score_factors: Array<{ label: string; points: number }>;
  assigned_to: string;
  routing_mode: string;
  created_at: string;
}
