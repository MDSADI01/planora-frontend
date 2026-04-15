import { Footer } from "@/src/components/Home/Footer/footer";
import { Navbar } from "@/src/components/Home/Navbar/navbar";
import React from "react";

const CustomLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className="mx-4">
        <Navbar />
      </div>
      <div>{children}</div>
      <div className="mx-5">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default CustomLayout;
