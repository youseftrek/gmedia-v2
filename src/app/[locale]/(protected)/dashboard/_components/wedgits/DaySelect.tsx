"use client";

import { Calendar } from "@/components/ui/calender";
import { useState } from "react";

const DaySelect = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="mx-auto w-fit">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="mx-auto rounded-md"
      />
    </div>
  );
};

export default DaySelect;
