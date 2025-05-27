"use client";
import React, { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  title: string;
  color?: string; // Optional color class for the step
  hidden?: boolean; // Flag to indicate if a step should be hidden
}

export const AnimatedMultiStepper: React.FC<{
  children: React.ReactNode;
  steps: Step[];
  currentActiveStep?: number;
}> = ({ children, steps, currentActiveStep = 0 }) => {
  const [currentStep, setCurrentStep] = useState(currentActiveStep || 0);
  const [isRtl, setIsRtl] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out hidden steps
  const visibleSteps = steps.filter((step) => !step.hidden);

  // Update current step when prop changes
  useEffect(() => {
    setCurrentStep(currentActiveStep || 0);
  }, [currentActiveStep]);

  // Detect RTL direction from the container or document
  useEffect(() => {
    const checkDirection = () => {
      if (containerRef.current) {
        const computedDir = window.getComputedStyle(
          containerRef.current
        ).direction;
        setIsRtl(computedDir === "rtl");
      } else {
        setIsRtl(
          document.dir === "rtl" || document.documentElement.dir === "rtl"
        );
      }
    };

    checkDirection();

    const resizeObserver = new ResizeObserver(checkDirection);
    const currentContainer = containerRef.current;
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, []);

  // Calculate segment width for progress bar
  const segmentWidth = 100 / (visibleSteps.length - 1);

  // Animation variants for content transitions
  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  // Helper function to determine step status
  const getStepStatus = (index: number) => {
    if (currentStep > index) return "completed";
    if (currentStep === index) return "active";
    return "inactive";
  };

  // Helper function to handle color styling
  const getStepStyles = (step: Step, index: number) => {
    const status = getStepStatus(index);
    const isDestructive = step.color?.includes("destructive") || false;
    const hasCustomColor = Boolean(step.color);

    // Default styles
    const defaultStyles = {
      circle: "border-muted-foreground text-muted-foreground",
      text: "text-muted-foreground",
      bg: "",
    };

    // Completed/active step with default teal styling
    const activeStyles = {
      circle: "border-[#00bbbe] text-[#00bbbe]",
      text: "text-[#00bbbe]",
      bg: "bg-[rgba(0,187,190,0.2)]",
    };

    // Destructive styling (for rejected)
    const destructiveStyles = {
      circle: "border-red-500 text-red-500",
      text: "text-red-500",
      bg: "bg-red-500/20",
    };

    // Custom color styling
    const customStyles = {
      circle: step.color?.replace("text-", "border-") || "",
      text: step.color || "",
      bg: "",
    };

    // Choose appropriate styling based on status and color
    if (status === "inactive") {
      return isDestructive ? destructiveStyles : defaultStyles;
    }

    if (isDestructive) {
      return destructiveStyles;
    }

    if (hasCustomColor) {
      return customStyles;
    }

    return activeStyles;
  };

  return (
    <div className="rounded-lg w-full" ref={containerRef}>
      {/* Progress Bar & Step Indicators */}
      <div className="p-6 pb-0">
        <div className="flex justify-between">
          {visibleSteps.map((step, index) => {
            const stepStyles = getStepStyles(step, index);
            const status = getStepStatus(index);

            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: status === "completed" ? [1, 1.2, 1] : 1,
                    transition: {
                      duration: status === "completed" ? 0.5 : 0.3,
                    },
                  }}
                  className={`flex justify-center items-center border-2 rounded-full w-10 h-10 
                    ${stepStyles.circle} ${
                    status !== "inactive" ? stepStyles.bg : ""
                  }`}
                >
                  {status === "completed" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className={stepStyles.text}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <span className={stepStyles.text}>{index + 1}</span>
                  )}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-2 font-medium text-xs md:text-sm ${stepStyles.text}`}
                >
                  {step.title}
                </motion.span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative mt-4">
          <div className="bg-muted-foreground/20 rounded h-2">
            <div className="absolute inset-0 flex w-full">
              {visibleSteps
                .slice(0, visibleSteps.length - 1)
                .map((step, index) => {
                  // Only show segments up to current progress
                  if (index >= currentStep) return null;

                  // Check if next step has a custom color and we're at the last active segment
                  const nextStep = visibleSteps[index + 1];
                  const isLastActiveSegment = index === currentStep - 1;
                  const nextIsDestructive =
                    nextStep?.color?.includes("destructive") &&
                    isLastActiveSegment;

                  return (
                    <motion.div
                      key={index}
                      initial={{ width: 0 }}
                      animate={{ width: `${segmentWidth}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className={`h-2 ${
                        nextIsDestructive
                          ? "rtl:bg-linear-to-r ltr:bg-linear-to-l from-red-500 to-[#00bbbe]"
                          : "bg-[#00bbbe]"
                      } ${index === 0 ? "ltr:rounded-l rtl:rounded-r" : ""} ${
                        index === visibleSteps.length - 2
                          ? "ltr:rounded-r rtl:rounded-l"
                          : ""
                      }`}
                      style={{
                        marginLeft: index === 0 ? 0 : undefined,
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
