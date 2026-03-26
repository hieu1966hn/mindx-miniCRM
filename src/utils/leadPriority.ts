export type LeadTemperature = "hot" | "warm" | "cold";

export interface LeadTemperatureMeta {
  key: LeadTemperature;
  label: string;
  badgeClassName: string;
  textClassName: string;
}

export function getLeadTemperature(score: number): LeadTemperatureMeta {
  if (score >= 80) {
    return {
      key: "hot",
      label: "Hot",
      badgeClassName: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
      textClassName: "text-emerald-300",
    };
  }

  if (score >= 60) {
    return {
      key: "warm",
      label: "Warm",
      badgeClassName: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      textClassName: "text-amber-300",
    };
  }

  return {
    key: "cold",
    label: "Cold",
    badgeClassName: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    textClassName: "text-slate-400",
  };
}
