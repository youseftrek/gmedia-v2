import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Props = {
  color: "blue" | "yellow";
  message: string;
};

const Notification = ({ color, message }: Props) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between px-4 gap-3 mb-3 py-3 rounded-lg",
        color === "blue" &&
          "bg-linear-to-bl from-blue-500/70 to-blue-500 text-white",
        color === "yellow" &&
          "bg-linear-to-bl from-yellow-500/70 to-yellow-500 text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Info size={22} />
        <p className="font-medium text-base md:text-xl">{message}</p>
      </div>
      <Button
        size="lg"
        variant="outline"
        className="hidden text-[#25155c] dark:text-white"
      >
        معاينة
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="lg:hidden text-[#25155c] dark:text-white"
      >
        معاينة
      </Button>
    </div>
  );
};

export default Notification;
