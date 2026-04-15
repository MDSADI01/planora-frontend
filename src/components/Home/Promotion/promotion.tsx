'use client'; // Required for Framer Motion in Next.js App Router

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function Promtion() {
  // Track page scroll progress to drive parallax transforms.
  const { scrollYProgress } = useScroll();

  // Transform values: 
  // [0, 1] represents the scroll progress from top to bottom of the element.
  // The second array represents the movement. 
  
  // Keep movement subtle and smooth to avoid jitter/jumps.
  const backgroundYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const backgroundY = useSpring(backgroundYRaw, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });
  const textY = useSpring(textYRaw, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* 1. The Background Image */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 w-full h-full will-change-transform"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            // Replace with your actual image path
            backgroundImage: "url('https://i.postimg.cc/cCGm4XFR/65a0e7db48c51f8beeefba2f-may-4.jpg')", 
          }} 
        />
        {/* Optional dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* 2. The Content Section (Explore Button) */}
      <motion.div 
        style={{ y: textY }}
        className="relative z-10 flex flex-col items-center text-center px-4 will-change-transform"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Discover Extraordinary Events
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl">
          Join exclusive public and private gatherings curated just for you.
        </p>
        
        <Link 
          href="/events" 
          className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-indigo-500/30"
        >
          Explore Events
        </Link>
      </motion.div>
    </div>
  );
}