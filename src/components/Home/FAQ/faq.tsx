import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

const faqs = [
  {
    question: "How do I create an event on Planora?",
    answer: "Creating an event is simple! Sign up for an account, click on 'Create Event' from your dashboard, fill in the event details including date, time, venue, and description, then publish your event.",
  },
  {
    question: "Is Planora free to use?",
    answer: "Yes! Planora offers a free tier for basic event management. We also have premium plans with advanced features like analytics, custom branding, and priority support.",
  },
  {
    question: "Can I sell tickets for my events?",
    answer: "Absolutely! Planora integrates with payment gateways to allow you to sell tickets directly on the platform. You can set different ticket types and pricing tiers.",
  },
  {
    question: "How do attendees register for events?",
    answer: "Attendees can browse events on our platform and register with a single click. They'll receive confirmation emails and can access event details from their dashboard.",
  },
  {
    question: "Can I manage multiple events at once?",
    answer: "Yes, our dashboard allows you to manage all your events from one place. You can track registrations, send updates, and analyze performance across all your events.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find answers to common questions about Planora
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
