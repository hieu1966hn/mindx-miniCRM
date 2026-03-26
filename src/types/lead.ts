export type AgeGroup = "Kids" | "Teen" | "18+";
export type LeadRoutingMode = "auto" | "manual";

export interface LeadFormValues {
  fullName: string;
  phone: string;
  email: string;
  ageGroup: AgeGroup | "";
  programInterest: string;
  campusOrRegion: string;
  leadSource: string;
  notes: string;
}

export interface ScoreFactor {
  label: string;
  points: number;
}

export interface Lead extends LeadFormValues {
  id: string;
  status: "New" | "Contacting" | "Interested" | "Converted" | "Lost";
  score: number;
  scoreFactors: ScoreFactor[];
  assignedTo: string;
  routingMode: LeadRoutingMode;
  createdAt: string;
}
