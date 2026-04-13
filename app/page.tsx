import { Banner } from "@/components/Home/Banner/banner";
import { Footer } from "@/components/Home/Footer/footer";
import { Navbar } from "@/components/Home/Navbar/navbar";

export default function Home() {
  return (
    <div>
      <div className="relative">
      <div className="absolute inset-x-0 top-0 z-20">
        <Navbar className="text-white" />
      </div>
      <Banner />
      
    </div>
    <div className="mx-5">
    <Footer></Footer> 
    </div>
    </div>
  );
}
