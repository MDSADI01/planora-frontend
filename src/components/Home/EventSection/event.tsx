"use client";

import { useState, useEffect, useMemo } from "react";
import { getEventsAction, type Event, type EventFilters } from "@/src/app/(CommonLayout)/action/event";
import EventCard from "./event-card";
import EventSearch from "./event-search";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial events
  useEffect(() => {
    loadEvents({});
  }, []);

  const loadEvents = async (filters: EventFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEvents = await getEventsAction(filters);
      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error("Error loading events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: EventFilters) => {
    loadEvents(filters);
  };

  const emptyState = useMemo(() => filteredEvents.length === 0, [filteredEvents.length]);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <EventSearch onSearch={handleSearch} isLoading={isLoading} />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !emptyState && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && emptyState && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No events found</div>
          <p className="text-gray-400 text-sm">
            Try adjusting your search filters or check back later for new events.
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;