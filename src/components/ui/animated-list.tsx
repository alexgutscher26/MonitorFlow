"use client";

import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

/**
 * AnimatedList Component
 *
 * Displays a list of animated items with a staggered appearance. Each child in the list
 * will appear with a delay, creating a cascading effect as new items are added.
 *
 * @param {AnimatedListProps} props - Props for configuring the animated list.
 * @returns {JSX.Element} The AnimatedList component with animated children.
 */
export const AnimatedList = React.memo(
  ({ className = "", children, delay = 1000 }: AnimatedListProps) => {
    const [messages, setMessages] = useState<ReactNode[]>([]);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

    useEffect(() => {
      const interval = setInterval(() => {
        setMessages((prev) =>
          prev.length < childrenArray.length ? [childrenArray[prev.length], ...prev] : prev
        );
        if (messages.length >= childrenArray.length) clearInterval(interval);
      }, delay);

      return () => clearInterval(interval);
    }, [childrenArray, delay, messages.length]);

    return (
      <div className={`flex flex-col-reverse items-center gap-4 ${className}`}>
        <AnimatePresence>
          {messages.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

/**
 * AnimatedListItem Component
 *
 * A single animated item within an AnimatedList, utilizing Framer Motion to apply
 * scale and opacity transitions.
 *
 * @param {React.ReactNode} children - The content to animate within the list item.
 * @returns {JSX.Element} The animated list item.
 */
export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
