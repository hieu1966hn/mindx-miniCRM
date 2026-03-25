"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Lead } from "@/types/lead";

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "status" | "score" | "assignedTo" | "createdAt">) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  deleteLead: (id: string) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "mindx_mini_crm_leads";

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load leads from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (error) {
        console.error("Failed to parse saved leads:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save leads to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
    }
  }, [leads, isInitialized]);

  const addLead = (leadData: Omit<Lead, "id" | "status" | "score" | "assignedTo" | "createdAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      status: "New",
      score: 10, // Default score
      assignedTo: "Chưa phân phối",
      createdAt: new Date().toISOString(),
    };
    setLeads((prev: Lead[]) => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads((prev: Lead[]) =>
      prev.map((l: Lead) => (l.id === id ? { ...l, status } : l))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev: Lead[]) => prev.filter((l: Lead) => l.id !== id));
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLeadStatus, deleteLead }}>
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
