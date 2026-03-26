import { LeadFormValues } from "@/types/lead";

export interface LeadRoutingInput extends LeadFormValues {
  score: number;
}

export interface LeadRoutingExplanation {
  owner: string;
  isPriority: boolean;
  campusTeam: string;
  specialistTeam: string | null;
  reasons: string[];
}

const CAMPUS_ASSIGNMENTS: Record<string, string> = {
  "Ha Noi": "Team Hà Nội",
  HCM: "Team Hồ Chí Minh",
  "Da Nang": "Team Miền Trung",
  Online: "Team Online",
};

const PROGRAM_SPECIALISTS: Record<string, string> = {
  "AI/ML": "STEM Advisor • AI/ML",
  Robotics: "STEM Advisor • Robotics",
};

export const OWNER_OPTIONS = [
  "Team Hà Nội",
  "Team Hồ Chí Minh",
  "Team Miền Trung",
  "Team Online",
  "Team Admissions",
  "Priority Desk",
  "STEM Advisor • AI/ML",
  "STEM Advisor • Robotics",
] as const;

function getCampusAssignment(campusOrRegion: string) {
  return CAMPUS_ASSIGNMENTS[campusOrRegion] ?? "Team Admissions";
}

function getProgramSpecialist(programInterest: string) {
  return PROGRAM_SPECIALISTS[programInterest] ?? null;
}

export function describeLeadRouting(values: LeadRoutingInput): LeadRoutingExplanation {
  const campusTeam = getCampusAssignment(values.campusOrRegion);
  const specialistTeam = getProgramSpecialist(values.programInterest);
  const isPriority = values.score >= 80 || values.leadSource === "Referral";
  const reasons = [`Campus route → ${campusTeam}`];

  if (values.score >= 80) {
    reasons.push(`Score ${values.score}/100 đạt ngưỡng ưu tiên`);
  }

  if (values.leadSource === "Referral") {
    reasons.push("Lead đến từ Referral nên được ưu tiên xử lý");
  }

  if (specialistTeam) {
    reasons.push(`Program match → ${specialistTeam}`);
  }

  if (specialistTeam && isPriority) {
    reasons.push("Ưu tiên + chuyên môn cao nên route về desk chuyên sâu");
    return {
      owner: `${specialistTeam} • Priority Desk`,
      isPriority,
      campusTeam,
      specialistTeam,
      reasons,
    };
  }

  if (isPriority) {
    reasons.push("Lead priority được đẩy qua luồng Priority Desk");
    return {
      owner: `${campusTeam} • Priority Desk`,
      isPriority,
      campusTeam,
      specialistTeam,
      reasons,
    };
  }

  if (specialistTeam && values.leadSource === "Workshop") {
    reasons.push("Workshop lead phù hợp specialist nên assign trực tiếp");
    return {
      owner: specialistTeam,
      isPriority,
      campusTeam,
      specialistTeam,
      reasons,
    };
  }

  reasons.push("Luồng mặc định theo campus/region");
  return {
    owner: campusTeam,
    isPriority,
    campusTeam,
    specialistTeam,
    reasons,
  };
}

export function calculateLeadRouting(values: LeadRoutingInput) {
  return describeLeadRouting(values).owner;
}
