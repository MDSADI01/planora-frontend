import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <div className="container px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/20 p-4 rounded-full">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Unforgettable Events?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust Planora to bring their visions to life. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Events
              </Button>
            </Link>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-6">
            No credit card required • Free forever for basic features
          </p>
        </div>
      </div>
    </section>
  );
};
