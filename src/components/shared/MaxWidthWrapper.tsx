import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MaxWidthWrapper = ({ children, className }: Props) => {
  return (
    <div className={cn("mx-auto max-w-[1920px] container", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
