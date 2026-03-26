"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Lead, LeadFormValues, LeadRoutingMode } from "@/types/lead";
import { calculateLeadScore } from "@/utils/leadScoring";
import { calculateLeadRouting } from "@/utils/routing";

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: LeadFormValues) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  deleteLead: (id: string) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "mindx_mini_crm_leads";

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
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedLeads = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedLeads) {
      return [];
    }

    try {
      const parsedLeads = JSON.parse(savedLeads) as Array<Partial<Lead> & LeadFormValues>;
      return parsedLeads.map((lead) => {
        const snapshot = buildLeadSnapshot(lead);

        return {
          ...snapshot.formValues,
          id: lead.id ?? crypto.randomUUID(),
          status: lead.status ?? "New",
          score: lead.score ?? snapshot.score,
          scoreFactors: lead.scoreFactors ?? snapshot.scoreFactors,
          assignedTo: snapshot.assignedTo,
          routingMode: snapshot.routingMode,
          createdAt: lead.createdAt ?? new Date().toISOString(),
        } satisfies Lead;
      });
    } catch (error) {
      console.error("Failed to parse saved leads:", error);
      return [];
    }
  });
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData: LeadFormValues) => {
    const snapshot = buildLeadSnapshot(leadData);
    const newLead: Lead = {
      ...snapshot.formValues,
      id: crypto.randomUUID(),
      status: "New",
      score: snapshot.score,
      scoreFactors: snapshot.scoreFactors,
      assignedTo: snapshot.assignedTo,
      routingMode: snapshot.routingMode,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev: Lead[]) => [newLead, ...prev]);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev: Lead[]) =>
      prev.map((lead: Lead) => {
        if (lead.id !== id) {
          return lead;
        }

        const nextLeadBase = { ...lead, ...updates };
        const snapshot = buildLeadSnapshot(nextLeadBase);

        return {
          ...lead,
          ...snapshot.formValues,
          ...updates,
          score: snapshot.score,
          scoreFactors: snapshot.scoreFactors,
          routingMode: snapshot.routingMode,
          assignedTo: snapshot.assignedTo,
        };
      })
    );
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads((prev: Lead[]) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev: Lead[]) => prev.filter((lead) => lead.id !== id));
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, updateLeadStatus, deleteLead }}>
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
