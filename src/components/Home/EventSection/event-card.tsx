"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Event } from "@/src/app/(CommonLayout)/action/event";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isFree = !event.fee || event.fee === 0;

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 w-full">
       <img src={event.image} 
       alt={event.title} 
       className="object-cover w-full h-full"
       />
        
        {/* Fee Tag */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isFree
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-zinc-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
            }`}
          >
            <Tag className="w-3 h-3 mr-1" />
            {isFree ? "Free" : ` ৳${event.fee}`}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 mb-2 line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-600 dark:text-zinc-300 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.date)}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
            <Clock className="w-4 h-4 mr-2" />
            {event.time}
          </div>
          
          {event.venue && (
            <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
              <MapPin className="w-4 h-4 mr-2" />
              {event.venue}
            </div>
          )}
        </div>

        {/* Event Type and Category */}
        <div className="flex gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-200">
            {event.type.replace("_", " ")}
          </span>
          {event.eventCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              {event.eventCategory}
            </span>
          )}
        </div>

        {/* Organizer */}
        <div className="flex items-center mb-4">
          {event.organizer.image && (
            <img
              src={event.organizer.image}
              alt={event.organizer.name || "Organizer"}
              width={24}
              height={24}
              className="rounded-full mr-2 object-cover"
            />
          )}
          <span className="text-sm text-gray-500 dark:text-zinc-400">
            by {event.organizer.name || "Unknown"}
          </span>
        </div>

        {/* More Details Button */}
        <Link href={`/events/${event.id}`}>
          <Button className="w-full" variant="default">
            More Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
