"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  color?: string; // Tailwind color class (e.g., "text-blue-500")
  speed?: number;
  className?: string;
}

export const Spinner = ({
  size = 24,
  color = "text-black", // Default to black
  speed = 1.5,
  className,
}: SpinnerProps) => {
  const animationDuration = `${1 / Math.max(0.5, Math.min(speed, 2))}s`;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={cn("w-full h-full animate-spin", color)}
        viewBox="0 0 24 24"
        style={{ animationDuration }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          className="opacity-25 stroke-current"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
          fill="none"
        />
        {/* Rotating Arc with Rounded Caps */}
        <circle
          className="opacity-75 stroke-current"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="60"
          strokeDashoffset="20"
        />
      </svg>
    </div>
  );
};

export default Spinner;
