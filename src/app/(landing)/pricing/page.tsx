"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string
  popular: PopularPlan
  price: number
  description: string
  buttonText: string
  benefitList: string[]
  highlight?: string
}

const plans: PlanProps[] = [
  {
    title: "Starter",
    popular: 0,
    price: 0,
    description:
      "Perfect for individuals and small teams getting started with uptime monitoring.",
    buttonText: "Start for Free",
    benefitList: [
      "Up to 3 monitors",
      "5-minute check intervals",
      "Email notifications",
      "Basic uptime reporting",
      "Community support",
    ],
  },
  {
    title: "Pro",
    popular: 1,
    price: 29,
    description:
      "Advanced monitoring features for growing businesses and development teams.",
    buttonText: "Get Started",
    highlight: "Most Popular",
    benefitList: [
      "Up to 50 monitors",
      "1-minute check intervals",
      "Multi-channel alerts",
      "Advanced analytics",
      "API access",
      "Priority support",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 99,
    description:
      "Custom solutions for large organizations with complex monitoring needs.",
    buttonText: "Contact Sales",
    benefitList: [
      "Unlimited monitors",
      "30-second check intervals",
      "Custom alert workflows",
      "Dedicated IP ranges",
      "SLA guarantees",
      "24/7 phone support",
    ],
  },
]

const Page = () => {
  const { user } = useUser()
  const router = useRouter()

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      const res = await client.payment.createCheckoutSession.$post()
      return await res.json()
    },
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
  })

  const handleGetAccess = () => {
    if (user) {
      createCheckoutSession()
    } else {
      router.push("/sign-in?intent=upgrade")
    }
  }

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-white/25 [mask-image:radial-gradient(white,transparent_95%)]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Monitoring Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start monitoring your services with our flexible pricing plans.
            Scale as you grow with our powerful features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map(
            (
              {
                title,
                popular,
                price,
                description,
                buttonText,
                benefitList,
                highlight,
              },
              index
            ) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={
                    popular === PopularPlan.YES
                      ? "relative border-2 border-primary shadow-lg dark:shadow-primary/20"
                      : "hover:border-primary/50 transition-colors"
                  }
                >
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-sm rounded-full px-3 py-1 font-medium flex items-center gap-1">
                        <Zap size={14} />
                        {highlight}
                      </span>
                    </div>
                  )}

                  <CardHeader className="flex flex-col justify-center">
                    <CardTitle className="flex items-center gap-2">
                      <span>{title}</span>
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription className="min-h-[60px] flex items-center justify-center">
                      {description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col justify-center">
                    <div className="space-y-4">
                      {benefitList.map((benefit) => (
                        <div key={benefit} className="flex items-center">
                          <Check className="text-primary mr-2 h-4 w-4 shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-center">
                    <Button
                      variant={
                        popular === PopularPlan.YES ? "default" : "outline"
                      }
                      className="w-full"
                      onClick={handleGetAccess}
                    >
                      {buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default Page
