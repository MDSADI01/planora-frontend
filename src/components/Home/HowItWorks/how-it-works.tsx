import { CalendarPlus, Users, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: CalendarPlus,
    step: "01",
    title: "Create Your Event",
    description: "Set up your event in minutes. Add details, choose a theme, and customize your event page.",
  },
  {
    icon: Users,
    step: "02",
    title: "Invite Attendees",
    description: "Share your event via social media, email, or direct link. Track RSVPs in real-time.",
  },
  {
    icon: PartyPopper,
    step: "03",
    title: "Host & Celebrate",
    description: "Manage check-ins, engage with guests, and create unforgettable memories together.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with Planora in three simple steps and create amazing events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-0.5 bg-border -translate-y-1/2" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Step Number Badge */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
