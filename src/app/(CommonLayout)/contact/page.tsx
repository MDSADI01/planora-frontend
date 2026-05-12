import {
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  Smartphone,
} from "lucide-react";

const contactItems = [
  {
    label: "Address",
    value: "Planora Support Center, Banani, Dhaka 1213, Bangladesh",
    icon: MapPin,
  },
  {
    label: "Mobile",
    value: "+880 1711-234567",
    icon: Smartphone,
  },
  {
    label: "WhatsApp",
    value: "Planora WhatsApp Support",
    icon: MessageCircle,
  },
  {
    label: "Facebook",
    value: "Planora Facebook Page",
    icon: MessageCircle,
  },
  {
    label: "Discord",
    value: "Planora Discord Community",
    icon: Headphones,
  },
  {
    label: "Phone",
    value: "+880 2-5500-1234",
    icon: Phone,
  },
];

const Contact = () => {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
            Contact Planora
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Reach the Planora team for event support, booking questions,
            invitations, payments, or organizer help.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border bg-white p-5 shadow-sm dark:bg-zinc-950"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                  {item.label}
                </h2>
                <p className="mt-2 text-base font-medium leading-6 text-gray-900 dark:text-zinc-50">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Contact;
