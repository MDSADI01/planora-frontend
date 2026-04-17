"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { EventFilters } from "@/src/app/(CommonLayout)/action/event";

interface EventSearchProps {
  onSearch: (filters: EventFilters) => void;
  isLoading?: boolean;
}

const EventSearch = ({ onSearch, isLoading = false }: EventSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState<EventFilters>({});

  const handleSearch = () => {
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search events by title or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4"
            disabled={isLoading}
          />
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
