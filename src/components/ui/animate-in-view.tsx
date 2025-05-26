"use client";

import { ReactNode } from "react";
import { motion, useInView, TargetAndTransition } from "framer-motion";
import { useRef } from "react";

type AnimateInViewProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  once?: boolean;
  duration?: number;
  distance?: number;
};

export default function AnimateInView({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
  duration = 0.5,
  distance = 50,
}: AnimateInViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  // Define initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  // Define animation properties
  const getAnimatePosition = (): TargetAndTransition => {
    if (isInView) {
      if (direction === "up" || direction === "down") {
        return {
          y: 0,
          opacity: 1,
          transition: {
            duration,
            delay,
            ease: "easeOut",
          },
        };
      } else {
        return {
          x: 0,
          opacity: 1,
          transition: {
            duration,
            delay,
            ease: "easeOut",
          },
        };
      }
    }
    return {}; // Empty object if not in view (motion will use initial)
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={getAnimatePosition()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
