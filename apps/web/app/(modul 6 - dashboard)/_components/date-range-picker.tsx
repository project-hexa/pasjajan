"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Icon } from "@workspace/ui/components/icon";

interface DateRangePickerProps {
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className = "",
}: DateRangePickerProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // const handleReset = () => {
  //   onFromDateChange(undefined);
  //   onToDateChange(undefined);
  // };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-[120px] justify-between border border-black/20 bg-[#F7FFFB] text-left font-normal"
            >
              {fromDate ? (
                <span className="flex items-center">
                  {format(fromDate, "dd MMM yy")}
                </span>
              ) : (
                <span>Dari</span>
              )}
              <Icon icon={"lucide:calendar-days"} className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                onFromDateChange(date);
                setFromOpen(false);
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-[120px] justify-between border border-black/20 bg-[#F7FFFB] text-left font-normal"
            >
              {toDate ? (
                <span className="flex items-center">
                  {format(toDate, "dd MMM yy")}
                </span>
              ) : (
                <span>Sampai</span>
              )}
              <Icon icon={"lucide:calendar-days"} className="ml-2 h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                onToDateChange(date);
                setToOpen(false);
              }}
              disabled={(date) => {
                // Disable dates before the fromDate
                if (fromDate) {
                  return date < fromDate;
                }
                return false;
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* <Button 
        variant="outline" 
        onClick={handleReset}
        disabled={!fromDate && !toDate}
      >
        Reset
      </Button> */}
    </div>
  );
}
