import { HeroSlider } from "@/src/components/Home/HeroSlider/hero-slider";
import { Categories } from "@/src/components/Home/Categories/categories";
import { PopularEvents } from "@/src/components/Home/PopularEvents/popular-events";
import { Testimonials } from "@/src/components/Home/Testimonials/testimonials";
import { Stats } from "@/src/components/Home/Stats/stats";
import { BlogPreview } from "@/src/components/Home/BlogPreview/blog-preview";
import { FAQ } from "@/src/components/Home/FAQ/faq";
import { HowItWorks } from "@/src/components/Home/HowItWorks/how-it-works";
import { CTA } from "@/src/components/Home/CTA/cta";
import { Footer } from "@/src/components/Home/Footer/footer";
import { Navbar } from "@/src/components/Home/Navbar/navbar";
import Promtion from "@/src/components/Home/Promotion/promotion";
import { Marquee } from "@/src/components/Home/Marquee/marquee";
import { Features } from "@/src/components/Home/Features/features";

export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-20">
          <Navbar className="text-white" />
        </div>
        <HeroSlider />
      </div>

      <Categories />
      <PopularEvents />
      <Stats />
      <Features />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <HowItWorks />
      <CTA />
      <Marquee />
      <Promtion />
      <div className="mx-5">
        <Footer></Footer>
      </div>
    </div>
  );
}
