"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Lead, LeadFormValues, LeadRoutingMode } from "@/types/lead";
import { calculateLeadScore } from "@/utils/leadScoring";
import { calculateLeadRouting } from "@/utils/routing";
import { supabase } from "@/lib/supabase";
import { leadToRow, rowToLead } from "@/utils/leadMapper";
import { LeadRow } from "@/types/supabase";

interface LeadContextType {
  leads: Lead[];
  isLoading: boolean;
  addLead: (lead: LeadFormValues) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead["status"]) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

function buildLeadSnapshot(baseLead: Partial<Lead> & LeadFormValues) {
  const formValues: LeadFormValues = {
    fullName: baseLead.fullName ?? "",
    phone: baseLead.phone ?? "",
    email: baseLead.email ?? "",
    ageGroup: baseLead.ageGroup ?? "",
    programInterest: baseLead.programInterest ?? "",
    campusOrRegion: baseLead.campusOrRegion ?? "",
    leadSource: baseLead.leadSource ?? "",
    notes: baseLead.notes ?? "",
  };

  const { score, scoreFactors } = calculateLeadScore(formValues);
  const autoAssignedTo = calculateLeadRouting({ ...formValues, score });
  const routingMode: LeadRoutingMode = baseLead.routingMode ?? "auto";

  return {
    formValues,
    score,
    scoreFactors,
    routingMode,
    assignedTo: routingMode === "manual" ? baseLead.assignedTo ?? autoAssignedTo : autoAssignedTo,
  };
}

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Load leads từ Supabase khi mount ───────────────────────────────────────
  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch leads from Supabase:", error.message);
      } else {
        setLeads((data as LeadRow[]).map(rowToLead));
      }
      setIsLoading(false);
    }

    fetchLeads();
  }, []);

  // ─── addLead ─────────────────────────────────────────────────────────────────
  const addLead = useCallback(async (leadData: LeadFormValues): Promise<Lead> => {
    const snapshot = buildLeadSnapshot(leadData);

    const payload = leadToRow({
      ...snapshot.formValues,
      status: "New",
      score: snapshot.score,
      scoreFactors: snapshot.scoreFactors,
      assignedTo: snapshot.assignedTo,
      routingMode: snapshot.routingMode,
    });

    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`addLead failed: ${error.message}`);

    const newLead = rowToLead(data as LeadRow);
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  // ─── updateLead ──────────────────────────────────────────────────────────────
  const updateLead = useCallback(async (id: string, updates: Partial<Lead>): Promise<void> => {
    const existing = leads.find((l) => l.id === id);
    if (!existing) return;

    const merged = { ...existing, ...updates };
    const snapshot = buildLeadSnapshot(merged);

    const payload = leadToRow({
      ...snapshot.formValues,
      status: merged.status,
      score: snapshot.score,
      scoreFactors: snapshot.scoreFactors,
      assignedTo: snapshot.assignedTo,
      routingMode: snapshot.routingMode,
    });

    const { data, error } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`updateLead failed: ${error.message}`);

    const updatedLead = rowToLead(data as LeadRow);
    setLeads((prev) => prev.map((l) => (l.id === id ? updatedLead : l)));
  }, [leads]);

  // ─── updateLeadStatus ────────────────────────────────────────────────────────
  const updateLeadStatus = useCallback(async (id: string, status: Lead["status"]): Promise<void> => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(`updateLeadStatus failed: ${error.message}`);

    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  // ─── deleteLead ──────────────────────────────────────────────────────────────
  const deleteLead = useCallback(async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`deleteLead failed: ${error.message}`);

    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return (
    <LeadContext.Provider value={{ leads, isLoading, addLead, updateLead, updateLeadStatus, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
}
