"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatio Component
 *
 * A wrapper around Radix UI's AspectRatio component, allowing for a flexible, responsive
 * container that maintains a specified aspect ratio. Ideal for media elements like images or videos.
 *
 * @see https://www.radix-ui.com/docs/primitives/components/aspect-ratio
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src="example.jpg" alt="Example image" />
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
