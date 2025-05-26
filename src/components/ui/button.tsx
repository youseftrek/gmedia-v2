import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

const buttonVariants = cva(
  "inline-flex !important items-center !important justify-center !important gap-2 !important whitespace-nowrap !important rounded-md !important text-sm !important font-medium !important transition-all !important disabled:pointer-events-none !important disabled:opacity-50 !important [&_svg]:pointer-events-none !important [&_svg:not([class*='size-'])]:size-4 !important shrink-0 !important [&_svg]:shrink-0 !important outline-none !important focus-visible:border-ring !important focus-visible:ring-ring/50 !important focus-visible:ring-[3px] !important aria-invalid:ring-destructive/20 !important dark:aria-invalid:ring-destructive/40 !important aria-invalid:border-destructive !important",
  {
    variants: {
      variant: {
        default:
          "bg-primary !important text-primary-foreground !important shadow-xs !important hover:bg-primary/90 !important",
        destructive:
          "bg-destructive !important text-white !important shadow-xs !important hover:bg-destructive/90 !important focus-visible:ring-destructive/20 !important dark:focus-visible:ring-destructive/40 !important dark:bg-destructive/60 !important",
        outline:
          "border !important bg-background !important shadow-xs !important hover:bg-accent !important hover:text-accent-foreground !important dark:bg-input/30 !important dark:border-input !important dark:hover:bg-input/50 !important",
        secondary:
          "bg-secondary !important text-secondary-foreground !important shadow-xs !important hover:bg-secondary/80 !important",
        ghost:
          "hover:bg-accent !important hover:text-accent-foreground !important dark:hover:bg-accent/50 !important",
        link: "text-primary !important underline-offset-4 !important hover:underline !important",
      },
      size: {
        default:
          "h-9 !important px-4 !important py-2 !important has-[>svg]:px-3 !important",
        sm: "h-8 !important rounded-md !important gap-1.5 !important px-3 !important has-[>svg]:px-2.5 !important",
        lg: "h-10 !important rounded-md !important px-6 !important has-[>svg]:px-4 !important",
        icon: "size-9 !important",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  spinnerColor?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      spinnerColor,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner color={spinnerColor} />}
        {children}
        {loading && "..."}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
