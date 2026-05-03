import { Users, Calendar, MapPin, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
  },
  {
    icon: Calendar,
    value: "10K+",
    label: "Events Hosted",
  },
  {
    icon: MapPin,
    value: "100+",
    label: "Cities Covered",
  },
  {
    icon: Star,
    value: "4.9",
    label: "User Rating",
  },
];

export const Stats = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-foreground/20 p-4 rounded-full">
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
