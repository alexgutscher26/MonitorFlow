import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

/**
 * Layout Component
 *
 * Wraps application content in a layout with a persistent Navbar at the top.
 * This layout component is commonly used for pages where consistent
 * navigation is required throughout the application.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The content to be displayed within the layout.
 * @returns {JSX.Element} The layout with a Navbar and the provided children content.
 */
const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
