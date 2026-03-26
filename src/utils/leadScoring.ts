import { LeadFormValues, ScoreFactor } from "@/types/lead";

interface LeadScoreResult {
  score: number;
  scoreFactors: ScoreFactor[];
}

const PROGRAM_POINTS: Record<string, number> = {
  "AI/ML": 30,
  Robotics: 26,
  "Web Development": 22,
  "Data Analytics": 20,
  Scratch: 16,
};

const SOURCE_POINTS: Record<string, number> = {
  Referral: 24,
  Workshop: 20,
  Website: 16,
  Facebook: 12,
  Zalo: 10,
};

const AGE_GROUP_POINTS: Record<string, number> = {
  Teen: 18,
  "18+": 20,
  Kids: 14,
};

export function calculateLeadScore(values: LeadFormValues): LeadScoreResult {
  const scoreFactors: ScoreFactor[] = [
    {
      label: values.programInterest
        ? `Quan tâm ${values.programInterest}`
        : "Chưa chọn chương trình",
      points: PROGRAM_POINTS[values.programInterest] ?? 8,
    },
    {
      label: values.leadSource ? `Nguồn ${values.leadSource}` : "Nguồn chưa xác định",
      points: SOURCE_POINTS[values.leadSource] ?? 6,
    },
    {
      label: values.ageGroup ? `Nhóm tuổi ${values.ageGroup}` : "Thiếu nhóm tuổi",
      points: AGE_GROUP_POINTS[values.ageGroup] ?? 4,
    },
    {
      label: values.email && values.phone ? "Có đủ phone + email" : "Có 1 kênh liên hệ",
      points: values.email && values.phone ? 12 : 6,
    },
    {
      label: values.notes.trim().length >= 20 ? "Có ghi chú chất lượng" : "Ít ghi chú khai thác",
      points: values.notes.trim().length >= 20 ? 10 : 4,
    },
  ];

  const score = Math.min(
    100,
    Math.max(0, scoreFactors.reduce((total, factor) => total + factor.points, 0))
  );

  return {
    score,
    scoreFactors,
  };
}
