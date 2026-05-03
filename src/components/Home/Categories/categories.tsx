import Link from "next/link";
import { Calendar, Music, GraduationCap, Briefcase, Heart, Trophy } from "lucide-react";
import { getEventsAction } from "@/src/app/(CommonLayout)/action/event";

const categoryConfig = [
  {
    key: "CONFERENCES",
    name: "Conferences",
    icon: Briefcase,
    color: "bg-blue-500",
  },
  {
    key: "MUSIC_FESTIVAL",
    name: "Music Festivals",
    icon: Music,
    color: "bg-purple-500",
  },
  {
    key: "WORKSHOPS",
    name: "Workshops",
    icon: GraduationCap,
    color: "bg-green-500",
  },
  {
    key: "WEDDINGS",
    name: "Weddings",
    icon: Heart,
    color: "bg-pink-500",
  },
  {
    key: "SPORTS_EVENTS",
    name: "Sports Events",
    icon: Trophy,
    color: "bg-orange-500",
  },
  {
    key: "MEETUPS",
    name: "Meetups",
    icon: Calendar,
    color: "bg-teal-500",
  },
];

export const Categories = async () => {
  // Fetch all events to count by theme
  const allEvents = await getEventsAction();
  console.log(allEvents)

  // Count events by theme
  const counts: Record<string, number> = {};
  categoryConfig.forEach((cat) => {
    counts[cat.key] = 0;
  });

  allEvents.forEach((event) => {
    if (event.eventTheme && counts[event.eventTheme] !== undefined) {
      counts[event.eventTheme]++;
    }
  });

  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore events across various categories and find the perfect one for you
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoryConfig.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.key}
                href={`/events?eventTheme=${category.key}`}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border">
                  <div
                    className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{counts[category.key]} Events</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
