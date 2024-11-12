import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import { Providers } from "@/components/providers";
import { cn } from "@/utils";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Load Google Fonts with variable CSS custom properties for theme usage
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

/**
 * Metadata for the application, including title, description, and favicon.
 */
export const metadata: Metadata = {
  title: "MonitorFlow: Event Monitoring SaaS with Real-Time Alerts",
  description:
    "MonitorFlow is an advanced event monitoring SaaS offering real-time alerts, secure payments, and an intuitive dashboard. Perfect for developers and businesses, it simplifies event tracking and enhances workflow efficiency.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

/**
 * RootLayout Component
 *
 * The main layout for the application. Wraps the app with a ClerkProvider for authentication,
 * applies global styles and fonts, and initializes any required providers.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The RootLayout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-brand-50 text-brand-950 antialiased">
          <main className="relative flex-1 flex flex-col">
            <Providers>{children}</Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
