"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { getEventsAction, type Event, type EventFilters } from "@/src/app/(CommonLayout)/action/event";
import EventCard from "@/src/components/Home/EventSection/event-card";
import EventSearch from "@/src/components/Home/EventSection/event-search";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayCount, setDisplayCount] = useState(6);
  const observerTarget = useRef<HTMLDivElement>(null);

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
      setDisplayCount(6); // Reset pagination on new search
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
  
  const displayedEvents = filteredEvents.slice(0, displayCount);
  const hasMore = displayCount < filteredEvents.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Adding a tiny delay to simulate network request and show the spinner smoothly
          setTimeout(() => {
            setDisplayCount((prev) => prev + 6);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="text-gray-600">Find and join amazing events in your area</p>
        </div>

        {/* Search Section */}
        <EventSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State (Initial Fetch) */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Events Grid - 3 Columns */}
        {!isLoading && !emptyState && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Observer Target for Infinite Scroll */}
            {hasMore ? (
              <div ref={observerTarget} className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              displayedEvents.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>You&apos;ve reached the end of the events list!</p>
                </div>
              )
            )}
          </>
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
    </div>
  );
};

export default Events;