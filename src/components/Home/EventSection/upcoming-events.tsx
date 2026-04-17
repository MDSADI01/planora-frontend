"use client";

import { useState, useEffect } from "react";
import { getEventsAction, type Event } from "@/src/app/(CommonLayout)/action/event";
import EventCard from "./event-card";
import Link from "next/link";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      const allEvents = await getEventsAction({});
      // Filter for upcoming events (date >= today) and sort by date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = allEvents
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3); // Take only first 3
      
      setEvents(upcomingEvents);
    } catch (err) {
      console.error("Error loading upcoming events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          See more →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No upcoming events</div>
          <p className="text-gray-400 text-sm">
            Check back later for new events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
