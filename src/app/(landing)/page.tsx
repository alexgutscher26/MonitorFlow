import { BenefitsSection } from "@/components/layout/sections/benefits"
import { CommunitySection } from "@/components/layout/sections/community"
import { FAQSection } from "@/components/layout/sections/faq"
import { FeaturesSection } from "@/components/layout/sections/features"
import { FooterSection } from "@/components/layout/sections/footer"
import { HeroSection } from "@/components/layout/sections/hero"
import { PricingSection } from "@/components/layout/sections/pricing"
import { SponsorsSection } from "@/components/layout/sections/sponsors"
import { TestimonialSection } from "@/components/layout/sections/testimonial"

export const metadata = {
  title: "MonitorFlow - Real-Time SaaS Monitoring",
  description:
    "Get instant Discord notifications for your SaaS metrics. Track sales, users, and events in real-time with MonitorFlow.",
  openGraph: {
    type: "website",
    url: "https://monitorflow.com",
    title: "MonitorFlow - Real-Time SaaS Monitoring",
    description:
      "Get instant Discord notifications for your SaaS metrics. Track sales, users, and events in real-time with MonitorFlow.",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "MonitorFlow - Real-Time SaaS Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://monitorflow.com",
    title: "MonitorFlow - Real-Time SaaS Monitoring",
    description:
      "Get instant Discord notifications for your SaaS metrics. Track sales, users, and events in real-time with MonitorFlow.",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialSection />
      <CommunitySection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </>
  )
}
