import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground">
            Subscribe to our newsletter and never miss out on upcoming events and exclusive offers
          </p>
        </div>

        <form className="flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 h-12"
            required
          />
          <Button size="lg" className="gap-2">
            Subscribe <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By subscribing, you agree to receive marketing emails from Planora. You can unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
