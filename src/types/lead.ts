export type AgeGroup = "Kids" | "Teen" | "18+";

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

export interface Lead extends LeadFormValues {
  id: string;
  status: "New" | "Contacting" | "Interested" | "Converted" | "Lost";
  score: number;
  assignedTo: string;
  createdAt: string;
}
