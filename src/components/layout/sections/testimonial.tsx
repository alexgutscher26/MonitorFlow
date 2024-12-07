"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface ReviewProps {
  image: string
  name: string
  role: string
  company: string
  comment: string
  rating: number
}

const reviewList: ReviewProps[] = [
  {
    image: "/testimonials/avatar1.png",
    name: "Sarah Chen",
    role: "DevOps Lead",
    company: "TechFlow Solutions",
    comment:
      "PingPanda has transformed how we handle monitoring. The real-time alerts and intuitive dashboard have reduced our incident response time by 60%. Absolutely essential for our operations.",
    rating: 5.0,
  },
  {
    image: "/testimonials/avatar2.png",
    name: "Michael Rodriguez",
    role: "Site Reliability Engineer",
    company: "CloudScale Inc",
    comment:
      "The best monitoring solution we've used. The smart notifications and team collaboration features are game-changers. We've significantly reduced alert fatigue and improved our uptime.",
    rating: 5.0,
  },
  {
    image: "/testimonials/avatar3.png",
    name: "Emily Watson",
    role: "Engineering Manager",
    company: "DataStream",
    comment:
      "PingPanda's incident management workflow is exceptional. It's helped us maintain our 99.99% uptime SLA and made our on-call rotations much more manageable. Highly recommended.",
    rating: 4.9,
  },
  {
    image: "/testimonials/avatar4.png",
    name: "David Kim",
    role: "CTO",
    company: "FinTech Solutions",
    comment:
      "Moving to PingPanda was a game-changer for our monitoring strategy. The automated workflows and detailed analytics have given us unprecedented visibility into our systems.",
    rating: 5.0,
  },
  {
    image: "/testimonials/avatar5.png",
    name: "Rachel Martinez",
    role: "Platform Engineer",
    company: "E-commerce Plus",
    comment:
      "The ease of setup and powerful features make PingPanda stand out. We've caught potential issues before they impact users, and the historical data analysis is invaluable.",
    rating: 4.9,
  },
]

export const TestimonialSection = () => {
  return (
    <section className="flex w-full flex-col items-center space-y-12 bg-slate-50/50 py-16 dark:bg-transparent md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-[58rem] flex-col items-center space-y-4 text-center"
      >
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Testimonials
        </span>
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Trusted by Developers
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          See what engineering teams worldwide are saying about PingPanda
        </p>
      </motion.div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-7xl px-4"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviewList.map((review, index) => (
            <CarouselItem
              key={review.name}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card className="border-none bg-background/60 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.image} alt={review.name} />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {review.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.role}
                        </p>
                        <p className="text-sm text-primary">{review.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-8">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>
    </section>
  )
}
