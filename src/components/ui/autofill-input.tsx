"use client";

import { useState, useRef, useEffect } from "react";
import { useFormAutofill, useCommonAutofill } from "@/src/hooks/useFormAutofill";
import { X, Clock, Sparkles } from "lucide-react";

interface AutofillInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formId: string;
  fieldName: string;
  label: string;
  commonType?: string;
  showCommonSuggestions?: boolean;
  onSuggestionSelect?: (value: string) => void;
}

export function AutofillInput({
  formId,
  fieldName,
  label,
  commonType,
  showCommonSuggestions = true,
  onSuggestionSelect,
  className = "",
  onChange,
  onBlur,
  onFocus,
  value,
  defaultValue,
  ...props
}: AutofillInputProps) {
  const [inputValue, setInputValue] = useState<string>(
    (value as string) || (defaultValue as string) || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { suggestions, saveToHistory, getSuggestions, clearFieldHistory } =
    useFormAutofill(formId);
  const { getCommonSuggestions } = useCommonAutofill();

  // Combine user history and common suggestions
  useEffect(() => {
    const userSuggestions = getSuggestions(fieldName);
    const commonSuggestions = showCommonSuggestions && commonType
      ? getCommonSuggestions(commonType)
      : [];
    
    // Merge and remove duplicates
    const combined = [...new Set([...userSuggestions, ...commonSuggestions])];
    setFilteredSuggestions(combined);
  }, [suggestions, fieldName, commonType, showCommonSuggestions, getSuggestions, getCommonSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Filter suggestions based on input
    const allSuggestions = [...getSuggestions(fieldName)];
    if (showCommonSuggestions && commonType) {
      allSuggestions.push(...getCommonSuggestions(commonType));
    }
    
    const filtered = [...new Set(allSuggestions)].filter((s) =>
      s.toLowerCase().includes(newValue.toLowerCase())
    );
    
    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0 && newValue.length > 0);
    
    onChange?.(e);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsOpen(false);
    
    // Trigger onChange with the selected value
    const syntheticEvent = {
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    
    onSuggestionSelect?.(suggestion);
    saveToHistory(fieldName, suggestion);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim()) {
      saveToHistory(fieldName, inputValue);
    }
    onBlur?.(e);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFieldHistory(fieldName);
    setIsOpen(false);
  };

  const userSuggestions = getSuggestions(fieldName);
  const hasUserHistory = userSuggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={(e) => {
          if (filteredSuggestions.length > 0) {
            setIsOpen(true);
          }
          onFocus?.(e);
        }}
        className={`h-10 w-full rounded-md border bg-background px-3 text-sm ${className}`}
        {...props}
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
          {hasUserHistory && (
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Your previous inputs
              </span>
              <button
                onClick={handleClearHistory}
                className="text-xs text-destructive hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>
          )}
          
          {filteredSuggestions.map((suggestion, index) => {
            const isUserHistory = userSuggestions.includes(suggestion);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm flex items-center justify-between"
              >
                <span>{suggestion}</span>
                {isUserHistory && (
                  <Clock className="h-3 w-3 text-muted-foreground" />
                )}
                {!isUserHistory && showCommonSuggestions && commonType && (
                  <Sparkles className="h-3 w-3 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
