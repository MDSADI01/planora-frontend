import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { getTrendingEventsAction } from "@/src/app/(CommonLayout)/action/event";

export const PopularEvents = async () => {
  const popularEvents = await getTrendingEventsAction();

  return (
    <section className="py-20">
      <div className="container px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Events</h2>
            <p className="text-muted-foreground">Discover trending events near you</p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group">
              <div className="bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {event.eventCategory || "Event"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.venue || "Online"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.participants?.length || 0} attending</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {event.fee === 0 || !event.fee ? "Free" : `৳${event.fee}`}
                    </span>
                    <Button size="sm" className="text-xs">
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
