"use client";

import FastMarquee from "react-fast-marquee";

export function Marquee() {
  const companies = [
    { name: "TechCorp", color: "text-blue-400" },
    { name: "InnovateLabs", color: "text-purple-400" },
    { name: "FutureEvents", color: "text-green-400" },
    { name: "DigitalHub", color: "text-yellow-400" },
    { name: "CloudEvents", color: "text-pink-400" },
    { name: "SmartConnect", color: "text-cyan-400" },
    { name: "DataDriven", color: "text-orange-400" },
    { name: "EventPro", color: "text-red-400" },
  ];

  return (
    <div className="bg-gray-900 py-6">
      <div className="text-center mb-4">
        <p className="text-gray-400 text-sm uppercase tracking-wider">Trusted by Leading Companies</p>
      </div>
      <FastMarquee speed={10} gradient={false} pauseOnHover={true}>
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-white text-xl font-bold mx-16"
          >
            <div className={`w-3 h-3 rounded-full ${company.color.replace('text-', 'bg-')}`} />
            <span className={company.color}>{company.name}</span>
          </div>
        ))}
      </FastMarquee>
    </div>
  );
}
