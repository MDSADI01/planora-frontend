"use client";

import { useState, useEffect, useCallback } from "react";

interface AutofillSuggestion {
  value: string;
  frequency: number;
  lastUsed: number;
}

interface FormHistory {
  [fieldName: string]: AutofillSuggestion[];
}

const STORAGE_KEY = "planora_form_autofill";
const MAX_SUGGESTIONS = 5;
const MAX_HISTORY_PER_FIELD = 10;

export function useFormAutofill(formId: string) {
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});

  // Load suggestions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${formId}`);
      if (stored) {
        const history: FormHistory = JSON.parse(stored);
        const formatted: Record<string, string[]> = {};
        
        Object.keys(history).forEach((field) => {
          formatted[field] = history[field]
            .sort((a, b) => b.frequency - a.frequency || b.lastUsed - a.lastUsed)
            .slice(0, MAX_SUGGESTIONS)
            .map((s) => s.value);
        });
        
        setSuggestions(formatted);
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [formId]);

  // Save input to history
  const saveToHistory = useCallback((fieldName: string, value: string) => {
    if (!value || value.trim().length < 2) return;
    
    try {
      const key = `${STORAGE_KEY}_${formId}`;
      const stored = localStorage.getItem(key);
      const history: FormHistory = stored ? JSON.parse(stored) : {};
      
      if (!history[fieldName]) {
        history[fieldName] = [];
      }
      
      const existingIndex = history[fieldName].findIndex(
        (item) => item.value.toLowerCase() === value.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        history[fieldName][existingIndex].frequency += 1;
        history[fieldName][existingIndex].lastUsed = Date.now();
      } else {
        history[fieldName].push({
          value,
          frequency: 1,
          lastUsed: Date.now(),
        });
      }
      
      // Keep only recent entries
      history[fieldName] = history[fieldName]
        .sort((a, b) => b.frequency - a.frequency || b.lastUsed - a.lastUsed)
        .slice(0, MAX_HISTORY_PER_FIELD);
      
      localStorage.setItem(key, JSON.stringify(history));
      
      // Update suggestions
      setSuggestions((prev) => ({
        ...prev,
        [fieldName]: history[fieldName]
          .slice(0, MAX_SUGGESTIONS)
          .map((s) => s.value),
      }));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [formId]);

  // Get suggestions for a field
  const getSuggestions = useCallback((fieldName: string): string[] => {
    return suggestions[fieldName] || [];
  }, [suggestions]);

  // Show/hide suggestions
  const setFieldSuggestionsVisible = useCallback((fieldName: string, visible: boolean) => {
    setShowSuggestions((prev) => ({ ...prev, [fieldName]: visible }));
  }, []);

  // Clear specific field history
  const clearFieldHistory = useCallback((fieldName: string) => {
    try {
      const key = `${STORAGE_KEY}_${formId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const history: FormHistory = JSON.parse(stored);
        delete history[fieldName];
        localStorage.setItem(key, JSON.stringify(history));
        
        setSuggestions((prev) => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
        });
      }
    } catch {
      // Silently fail
    }
  }, [formId]);

  return {
    suggestions,
    showSuggestions,
    saveToHistory,
    getSuggestions,
    setFieldSuggestionsVisible,
    clearFieldHistory,
  };
}

// Hook for common field autofill (email, common venues, etc.)
export function useCommonAutofill() {
  const getCommonSuggestions = useCallback((fieldType: string): string[] => {
    const common: Record<string, string[]> = {
      venue: [
        "Convention Center",
        "City Hall",
        "Community Center",
        "Hotel Conference Room",
        "University Auditorium",
        "Online (Zoom)",
        "Online (Google Meet)",
        "Online (Microsoft Teams)",
        "Local Park",
        "Restaurant",
        "Cafe",
      ],
      eventType: ["IN_PERSON", "ONLINE"],
      eventCategory: ["PUBLIC", "PRIVATE"],
      eventTheme: [
        "CONFERENCES",
        "MUSIC_FESTIVAL",
        "WORKSHOPS",
        "WEDDINGS",
        "SPORTS_EVENTS",
        "MEETUPS",
      ],
      time: [
        "09:00",
        "10:00",
        "11:00",
        "14:00",
        "15:00",
        "16:00",
        "18:00",
        "19:00",
      ],
    };
    
    return common[fieldType] || [];
  }, []);

  return { getCommonSuggestions };
}
