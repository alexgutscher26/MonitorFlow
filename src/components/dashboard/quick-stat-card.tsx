import { Card } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react"

interface QuickStatCardProps {
  title: string
  value: string | number
  trend: string
  trendUp?: boolean
  neutral?: boolean
}

export function QuickStatCard({
  title,
  value,
  trend,
  trendUp,
  neutral
}: QuickStatCardProps) {
  return (
    <Card>
      <div className="p-6">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-semibold">{value}</span>
          <span className={`inline-flex items-center text-sm font-medium ${
            neutral ? 'text-gray-500' : trendUp ? 'text-green-600' : 'text-red-600'
          }`}>
            {neutral ? (
              <MinusIcon className="mr-1 h-3 w-3" />
            ) : trendUp ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {trend}
          </span>
        </div>
      </div>
    </Card>
  )
}
