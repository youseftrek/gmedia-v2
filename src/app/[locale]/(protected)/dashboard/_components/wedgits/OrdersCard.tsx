import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  number: number;
  title: string;
  icon?: React.ReactNode;
};

const OrdersCard = ({ number, title, icon }: Props) => {
  const [value, setValue] = useState(0);
  const [animated, setAnimated] = useState(false);
  const initialRender = useRef(true);

  // Initialize with 0 and animate to actual value on mount
  useEffect(() => {
    if (initialRender.current) {
      // On first render, set the value to 0 and then animate to the actual number
      setValue(0);
      setTimeout(() => {
        setAnimated(true);
        setValue(number);
        initialRender.current = false;
      }, 300);
    } else {
      // For subsequent updates, animate to the new value
      setAnimated(true);
      setValue(number);
    }
  }, [number]);

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Card className="relative z-10 flex justify-between bg-secondary p-6">
        <div className="flex flex-col gap-2">
          <div
            className="font-bold text-primary text-2xl"
            style={{ fontKerning: "none" }}
          >
            <NumberFlow
              value={value}
              locales="en-US"
              format={{ useGrouping: false }}
              animated={animated}
              onAnimationsStart={() => setAnimated(true)}
              onAnimationsFinish={() => setAnimated(false)}
              willChange
            />
          </div>
          <h3 className="font-medium text-muted-foreground text-sm sm:text-base lg:text-lg">
            {title}
          </h3>
        </div>
        <motion.div className="top-3 ltr:right-3 rtl:left-3 absolute md:flex bg-background/70 p-2 md:p-5 rounded-full text-[#00bbbe]">
          {icon || <Tag />}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default OrdersCard;
