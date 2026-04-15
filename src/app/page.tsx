import { Banner } from "@/src/components/Home/Banner/banner";
import Event from "@/src/components/Home/EventSection/event";
import { Footer } from "@/src/components/Home/Footer/footer";
import { Navbar } from "@/src/components/Home/Navbar/navbar";
import Promtion from "@/src/components/Home/Promotion/promotion";
export default function Home() {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-20">
          <Navbar className="text-white" />
        </div>
        <Banner />
      </div>
      <div>
        <Event></Event>
      </div>
      <div>
        <Promtion></Promtion>
      </div>
      <div className="mx-5">
        <Footer></Footer>
      </div>
    </div>
  );
}
