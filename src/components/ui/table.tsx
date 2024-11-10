import * as React from "react";
import { cn } from "@/utils";

/**
 * Table root component providing the main table structure.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableElement>} ref - Reference to the HTML table element
 * @returns {JSX.Element} Rendered Table component
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * TableHeader component rendering the table header section.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableSectionElement>} ref - Reference to the table header element
 * @returns {JSX.Element} Rendered TableHeader component
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * TableBody component for rendering the main body of the table.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableSectionElement>} ref - Reference to the table body element
 * @returns {JSX.Element} Rendered TableBody component
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * TableFooter component for rendering the footer section of the table.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableSectionElement>} ref - Reference to the table footer element
 * @returns {JSX.Element} Rendered TableFooter component
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/**
 * TableRow component for rendering individual table rows.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableRowElement>} ref - Reference to the table row element
 * @returns {JSX.Element} Rendered TableRow component
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * TableHead component for rendering header cells in the table.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableCellElement>} ref - Reference to the table header cell element
 * @returns {JSX.Element} Rendered TableHead component
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * TableCell component for rendering individual table cells.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableCellElement>} ref - Reference to the table cell element
 * @returns {JSX.Element} Rendered TableCell component
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * TableCaption component for rendering the caption of the table.
 *
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional classes for styling
 * @param {React.Ref<HTMLTableCaptionElement>} ref - Reference to the table caption element
 * @returns {JSX.Element} Rendered TableCaption component
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
