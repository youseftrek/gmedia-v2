"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
}

export default function AnimatedButton({
  children,
  className = "",
  href,
  onClick,
  variant = "primary",
}: AnimatedButtonProps) {
  const buttonVariants = {
    initial: {
      boxShadow:
        variant === "primary"
          ? "0 0 0 rgba(124, 58, 237, 0)"
          : "0 0 0 rgba(255, 255, 255, 0)",
    },
    hover: {
      scale: 1.02,
      boxShadow:
        variant === "primary"
          ? "0 0 20px rgba(124, 58, 237, 0.5)"
          : "0 0 15px rgba(255, 255, 255, 0.2)",
      transition: {
        scale: {
          type: "spring",
          stiffness: 500,
          damping: 15,
        },
        boxShadow: {
          duration: 0.3,
        },
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden group px-6 py-3 font-medium rounded-md text-center inline-flex items-center justify-center",
        variant === "primary"
          ? "bg-primary text-white"
          : "bg-transparent border border-gray-300 dark:border-gray-600 text-foreground",
        className
      )}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
    >
      {/* Background gradient animation on hover */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-primary/60 to-purple-500/60 opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <span className="z-10 relative flex items-center gap-2">{children}</span>

      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={{
          translateX: ["100%", "-100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
    </Component>
  );
}
