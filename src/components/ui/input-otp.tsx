"use client";

import * as React from "react";
import { DashIcon } from "@radix-ui/react-icons";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/utils";

/**
 * OTP input component for capturing one-time password codes.
 * Uses `input-otp` library for handling OTP input functionality.
 * 
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling input fields.
 * @param {string} [props.containerClassName] - Additional classes for styling the container.
 * @returns {JSX.Element} Rendered OTP input component.
 */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

/**
 * Group container for OTP input fields, aligning fields in a flexbox.
 * 
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional classes for styling the container.
 * @returns {JSX.Element} Rendered group container for OTP inputs.
 */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

/**
 * Individual slot for each OTP character, showing a fake caret if active.
 * 
 * @param {object} props - Component props.
 * @param {number} props.index - Index of the OTP slot for accessing context.
 * @param {string} [props.className] - Additional classes for styling each slot.
 * @returns {JSX.Element} Rendered OTP slot component.
 */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

/**
 * Separator component for OTP input fields, showing a dash icon by default.
 * 
 * @param {object} props - Component props.
 * @returns {JSX.Element} Rendered separator component.
 */
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <DashIcon />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
