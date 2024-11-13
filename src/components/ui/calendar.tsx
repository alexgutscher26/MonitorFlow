"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";
import { cn } from "@/utils";
import { buttonVariants } from "@/components/ui/button";

// Extend the DayPicker props to include our custom props
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * Show days from the previous/next month
   */
  showOutsideDays?: boolean;
};

type IconComponentProps = React.ComponentProps<typeof ChevronLeftIcon>;

const IconLeft: React.FC<IconComponentProps> = (props) => (
  <ChevronLeftIcon className="h-4 w-4" {...props} />
);

const IconRight: React.FC<IconComponentProps> = (props) => (
  <ChevronRightIcon className="h-4 w-4" {...props} />
);

/**
 * Calendar Component
 *
 * A customizable calendar component built on top of react-day-picker with shadcn/ui styling.
 * Supports single date selection, range selection, and multiple date selection modes.
 *
 * @param {CalendarProps} props - Properties to configure the calendar
 * @returns {JSX.Element} The Calendar component
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, showOutsideDays = true, ...props }, ref) => {
    return (
      <DayPicker
        ref={ref}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft,
          IconRight,
          Dropdown: ({ value, onChange, children, ...dropdownProps }: DropdownProps) => (
            <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="appearance-none bg-transparent font-medium"
              {...dropdownProps}
            >
              {children}
            </select>
          ),
        }}
        {...props}
      />
    );
  }
);

Calendar.displayName = "Calendar";

export { Calendar };