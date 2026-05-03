"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { EventFilters, getSearchSuggestionsAction, getTrendingEventsAction } from "@/src/app/(CommonLayout)/action/event";

interface EventSearchProps {
  onSearch: (filters: EventFilters) => void;
  isLoading?: boolean;
}

const EventSearch = ({ onSearch, isLoading = false }: EventSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState<EventFilters>({});
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<any[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingEventsAction();
        setTrendingEvents(data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm.length >= 2) {
        setIsSearchingSuggestions(true);
        const data = await getSearchSuggestionsAction(trimmedTerm);
        setSuggestions(data);
        setIsSearchingSuggestions(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        // Show trending events if input is empty
        if (trendingEvents.length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, trendingEvents.length]);

  const handleSuggestionClick = (suggestion: any) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    onSearch({
      ...currentFilters,
      searchTerm: suggestion.title,
    });
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch({
      ...currentFilters,
      searchTerm: searchTerm.trim() || undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const setFilter = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    onSearch({
      ...newFilters,
      searchTerm: searchTerm.trim() || undefined,
    });
  };

  const clearFilters = () => {
    setCurrentFilters({});
    setSearchTerm("");
    onSearch({});
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0 || searchTerm.trim();

  // Determine which list to show
  const activeSuggestions = searchTerm.trim().length >= 2 ? suggestions : trendingEvents;
  const isAI = searchTerm.trim().length >= 2;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative" ref={wrapperRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search events by title or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (activeSuggestions.length > 0) setShowSuggestions(true);
            }}
            className="pl-10 pr-10 w-full"
            disabled={isLoading}
          />
          {isSearchingSuggestions && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}

          {/* AI Suggestions Dropdown */}
          {showSuggestions && activeSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
              <div className="px-3 py-2 text-xs text-gray-500 font-semibold bg-gray-50 flex items-center justify-between border-b">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  {isAI ? "AI Suggestions" : "Trending Searches"}
                </span>
                {isAI ? (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Smart</span>
                ) : (
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Hot</span>
                )}
              </div>
              <ul className="py-1">
                {activeSuggestions.map((suggestion) => (
                  <li 
                    key={suggestion.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.image ? (
                      <img src={suggestion.image} alt={suggestion.title} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-gray-200 flex-shrink-0 flex items-center justify-center">
                        <Search className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-800 truncate">{suggestion.title}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {suggestion.eventCategory?.toLowerCase() || 'Event'} • {new Date(suggestion.date).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2">
          {/* Event Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Type {currentFilters.type && `(${currentFilters.type.replace("_", " ")})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("type", undefined)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("type", "IN_PERSON")}>
                In Person
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("type", "ONLINE")}>
                Online
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Event Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Category {currentFilters.eventCategory && `(${currentFilters.eventCategory})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("eventCategory", undefined)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("eventCategory", "PUBLIC")}>
                Public
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("eventCategory", "PRIVATE")}>
                Private
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Price {currentFilters.isFree !== undefined && (currentFilters.isFree ? "(Free)" : "(Paid)")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("isFree", undefined)}>
                All Prices
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("isFree", true)}>
                Free Events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("isFree", false)}>
                Paid Events
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Button */}
          <Button onClick={handleSearch} disabled={isLoading} size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="ghost" size="sm" disabled={isLoading}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSearch;
