import { LeadForm } from "@/components/leads/LeadForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thêm Lead | MindX Mini CRM",
  description: "Tạo lead mới trong Mini CRM với form validation cơ bản và trải nghiệm giao diện premium.",
};

export default function NewLeadPage() {
  return <LeadForm />;
}
