"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Particles } from "@/components/magicui/particles";

interface ParallaxBackgroundProps {
  animationSpeed?: number; // Speed multiplier, default is 1
}

export default function ParallaxBackground({
  animationSpeed = 1,
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform values based on scroll position
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Add mouse parallax effect
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Calculate animation durations based on animationSpeed
  const blob1Duration = 20 / animationSpeed;
  const blob1PulseDuration = 8 / animationSpeed;
  const blob2Duration = 15 / animationSpeed;
  const blob2PulseDuration = 10 / animationSpeed;
  const blob3Duration = 25 / animationSpeed;
  const blob3PulseDuration = 12 / animationSpeed;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate mouse position as a percentage of the window size
      // and then normalize to a value between -0.5 and 0.5
      const normalizedX = (e.clientX / innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / innerHeight - 0.5) * 2;

      setMouseX(normalizedX);
      setMouseY(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
      >
        {/* First blob with combined scroll and mouse parallax */}
        <motion.div
          className="top-1/3 right-1/4 absolute bg-primary/10 blur-3xl rounded-full w-72 h-72"
          style={{
            y: y1,
            x: mouseX * 30,
            translateY: mouseY * 20,
            animation: `floatBlob ${blob1Duration}s ease-in-out infinite, pulseBlob ${blob1PulseDuration}s ease-in-out infinite`,
          }}
        />

        {/* Second blob with reversed animation */}
        <motion.div
          className="bottom-1/4 left-1/3 absolute bg-[#00bbbe]/40 blur-3xl rounded-full w-64 h-64"
          style={{
            y: y2,
            x: mouseX * -20,
            translateY: mouseY * -30,
            animation: `floatBlobReverse ${blob2Duration}s ease-in-out infinite, pulseBlob ${blob2PulseDuration}s ease-in-out infinite`,
          }}
        />

        {/* Third smaller blob */}
        <motion.div
          className="top-1/2 left-1/4 absolute bg-purple-500/40 blur-3xl rounded-full w-48 h-48"
          style={{
            y: y3,
            x: mouseX * 15,
            translateY: mouseY * 25,
            animation: `floatBlob ${blob3Duration}s ease-in-out infinite, pulseBlob ${blob3PulseDuration}s ease-in-out infinite`,
          }}
        />
      </motion.div>
      <div className="relative w-full h-full">
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={100}
          color="#7a3996"
          refresh
        />
        <Particles
          className="absolute inset-0 z-0"
          quantity={80}
          ease={80}
          color="#00bbbe"
          size={1}
          refresh
        />
      </div>
    </div>
  );
}
