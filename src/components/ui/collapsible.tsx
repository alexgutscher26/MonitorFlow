"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/**
 * Root component for the Collapsible, which manages open/close states.
 */
const Collapsible = CollapsiblePrimitive.Root;

/**
 * Trigger component for toggling the Collapsible open and closed.
 */
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

/**
 * Content component that displays when the Collapsible is open.
 */
const CollapsibleContent = CollapsiblePrimitive.Content;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
