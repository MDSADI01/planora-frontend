import { Calendar, Users, MapPin, Shield, Star, Zap, Globe, CreditCard } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Event Discovery",
    description: "Browse and discover events happening around you with our intuitive search and filter system. Find the perfect event for any occasion.",
    color: "bg-blue-500",
  },
  {
    icon: Users,
    title: "Seamless Registration",
    description: "Register for events in just a few clicks. Our streamlined process makes joining events quick and hassle-free.",
    color: "bg-purple-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Pay for events securely with our integrated payment gateway. Your transactions are protected with industry-standard encryption.",
    color: "bg-green-500",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Share your experience and read authentic reviews from other attendees. Make informed decisions with community feedback.",
    color: "bg-yellow-500",
  },
];

export function Features() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
            Our Website Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Discover the powerful features that make event management simple and enjoyable
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className={`inline-flex items-center justify-center rounded-2xl ${feature.color} p-6 mb-6`}>
                  <feature.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-zinc-300 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl p-8 shadow-lg">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full ${
                          feature.color
                        } opacity-${[30, 50, 70, 90, 60, 40][i - 1]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
