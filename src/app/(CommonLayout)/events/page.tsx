"use client";

import { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getEventsAction, type Event, type EventFilters } from "@/src/app/(CommonLayout)/action/event";
import EventChatbot from "@/src/components/Home/EventSection/event-chatbot";
import EventCard from "@/src/components/Home/EventSection/event-card";
import EventSearch from "@/src/components/Home/EventSection/event-search";

const getEventFee = (event: Event) => {
  const fee = Number(event.fee ?? 0);
  return Number.isNaN(fee) ? 0 : fee;
};

const getEventScore = (event: Event, filters: EventFilters) => {
  const eventDate = new Date(event.date).getTime();
  const isUpcoming = !Number.isNaN(eventDate) && eventDate >= Date.now();
  const searchTerm = filters.searchTerm?.toLowerCase().trim();
  let score = isUpcoming ? 20 : 0;

  if (searchTerm) {
    const searchableText = [
      event.title,
      event.description,
      event.venue,
      event.organizer?.name,
      event.type,
      event.eventCategory,
      event.eventTheme,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(searchTerm)) {
      score += 45;
    }
  }

  if (filters.isFree === true && getEventFee(event) === 0) score += 25;
  if (filters.isFree === false && getEventFee(event) > 0) score += 25;
  if (filters.type && filters.type === event.type) score += 15;
  if (filters.eventCategory && filters.eventCategory === event.eventCategory) score += 15;

  return score;
};

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeFilters, setActiveFilters] = useState<EventFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayCount, setDisplayCount] = useState(6);

  // Load initial events
  useEffect(() => {
    loadEvents({});
  }, []);

  const loadEvents = async (filters: EventFilters) => {
    setIsLoading(true);
    setError(null);
    setActiveFilters(filters);
    try {
      const fetchedEvents = await getEventsAction(filters);
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
  const loadMoreEvents = () => {
    setDisplayCount((prev) => Math.min(prev + 6, filteredEvents.length));
  };
  const aiMatches = useMemo(
    () =>
      [...filteredEvents]
        .sort((first, second) => getEventScore(second, activeFilters) - getEventScore(first, activeFilters))
        .slice(0, 2),
    [activeFilters, filteredEvents]
  );

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

        {!isLoading && aiMatches.length > 0 && (
          <section className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-gray-900">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-semibold">AI Event Match</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {aiMatches.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="rounded-md border p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900">{event.title}</h3>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {event.type.replace("_", " ")}
                        {event.venue ? ` at ${event.venue}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {getEventFee(event) === 0 ? "Free" : `BDT ${getEventFee(event)}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
          <InfiniteScroll
            dataLength={displayedEvents.length}
            next={loadMoreEvents}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
            endMessage={
              displayedEvents.length > 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You&apos;ve reached the end of the events list!</p>
                </div>
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </InfiniteScroll>
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
      <EventChatbot />
    </div>
  );
};

export default Events;
