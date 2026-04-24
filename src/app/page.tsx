import { Banner } from "@/src/components/Home/Banner/banner";
import UpcomingEvents from "@/src/components/Home/EventSection/upcoming-events";
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
        <Banner />
      </div>
     
      <div className="container mx-auto px-4 py-12">
        <UpcomingEvents></UpcomingEvents>
      </div>
      <Marquee />
      <Features />
      <Promtion />
      <div className="mx-5">
        <Footer></Footer>
      </div>
    </div>
  );
}
