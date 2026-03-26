import { Lead, LeadFormValues, LeadRoutingMode, ScoreFactor } from "@/types/lead";
import { LeadRow } from "@/types/supabase";

/** Chuyển Supabase row → Lead (camelCase) */
export function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    ageGroup: row.age_group as Lead["ageGroup"],
    programInterest: row.program_interest,
    campusOrRegion: row.campus_or_region,
    leadSource: row.lead_source,
    notes: row.notes,
    status: row.status as Lead["status"],
    score: row.score,
    scoreFactors: row.score_factors as ScoreFactor[],
    assignedTo: row.assigned_to,
    routingMode: row.routing_mode as LeadRoutingMode,
    createdAt: row.created_at,
  };
}

/** Chuyển Lead + LeadFormValues → Supabase insert/update payload (snake_case) */
export function leadToRow(
  lead: LeadFormValues & {
    status?: Lead["status"];
    score: number;
    scoreFactors: ScoreFactor[];
    assignedTo: string;
    routingMode: LeadRoutingMode;
  }
): Omit<LeadRow, "id" | "created_at"> {
  return {
    full_name: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    age_group: lead.ageGroup,
    program_interest: lead.programInterest,
    campus_or_region: lead.campusOrRegion,
    lead_source: lead.leadSource,
    notes: lead.notes,
    status: lead.status ?? "New",
    score: lead.score,
    score_factors: lead.scoreFactors,
    assigned_to: lead.assignedTo,
    routing_mode: lead.routingMode,
  };
}
