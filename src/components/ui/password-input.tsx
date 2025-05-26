"use client";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type Props = {
  field: object;
  disabled?: boolean;
};

export default function PasswordInput({ field, disabled }: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="relative">
      <Input
        disabled={disabled}
        {...field}
        className="bg-card/50 backdrop-blur-sm pe-9 border-muted"
        placeholder="********"
        type={isVisible ? "text" : "password"}
      />
      <button
        className="absolute inset-y-0 flex justify-center items-center disabled:opacity-50 focus-visible:border focus-visible:border-ring rounded-e-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ring-offset-background focus-visible:ring-offset-2 w-9 h-full text-muted-foreground/80 hover:text-foreground focus-visible:text-foreground transition-shadow disabled:cursor-not-allowed disabled:pointer-events-none end-0"
        type="button"
        disabled={disabled}
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Eye size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
