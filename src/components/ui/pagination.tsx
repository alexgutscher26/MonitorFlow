import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { ButtonProps, Button } from "@/components/ui/button";
import { cn } from "@/utils";

/**
 * Pagination Component
 *
 * Wrapper component for pagination navigation.
 * Provides a consistent layout for pagination controls.
 *
 * @param {PaginationProps} props - The props for the Pagination component.
 * @returns {JSX.Element} The pagination navigation component.
 */
interface PaginationProps extends React.ComponentProps<"nav"> {
  className?: string;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
);
Pagination.displayName = "Pagination";

/**
 * PaginationContent Component
 *
 * Provides the container for pagination items, with a consistent styling.
 *
 * @param {React.ComponentProps<"ul">} props - The props for PaginationContent.
 * @returns {JSX.Element} The container for pagination items.
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/**
 * PaginationItem Component
 *
 * Wraps individual pagination items to provide a consistent layout.
 *
 * @param {React.ComponentProps<"li">} props - The props for PaginationItem.
 * @returns {JSX.Element} The pagination item component.
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/**
 * PaginationLinkProps interface for PaginationLink Component
 *
 * Extends button attributes to allow active state and size adjustments.
 */
interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  size?: ButtonProps["size"];
}

/**
 * PaginationLink Component
 *
 * A customizable button for pagination that can be set to an active state.
 *
 * @param {PaginationLinkProps} props - The props for PaginationLink.
 * @returns {JSX.Element} The pagination link component.
 */
const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, isActive, size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={cn(className)}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

/**
 * PaginationPrevious Component
 *
 * Button component for navigating to the previous page in pagination.
 *
 * @param {PaginationLinkProps} props - The props for PaginationPrevious.
 * @returns {JSX.Element} The previous page button.
 */
const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-2 h-8 px-3", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

/**
 * PaginationNext Component
 *
 * Button component for navigating to the next page in pagination.
 *
 * @param {PaginationLinkProps} props - The props for PaginationNext.
 * @returns {JSX.Element} The next page button.
 */
const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    size="default"
    className={cn("gap-2 h-8 px-3", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

/**
 * PaginationEllipsis Component
 *
 * An ellipsis indicator for pagination, signaling additional pages.
 *
 * @param {React.ComponentProps<"span">} props - The props for PaginationEllipsis.
 * @returns {JSX.Element} The ellipsis component.
 */
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden
    className={cn("flex h-8 w-8 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
