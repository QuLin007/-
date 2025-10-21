"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTrendColor, getTrendIcon } from "@/lib/utils/trend-colors"

interface TrendDataPoint {
  label: string
  value: number
}

interface TrendChartProps {
  title: string
  description?: string
  data: TrendDataPoint[]
  currentValue: number
  changePercent: number
}

export function TrendChart({ title, description, data, currentValue, changePercent }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)))
  const trendColor = getTrendColor(changePercent)
  const trendIcon = getTrendIcon(changePercent)

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription className="text-xs">{description}</CardDescription>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{currentValue.toLocaleString()}</p>
            <p className={`text-sm font-semibold ${trendColor}`}>
              {trendIcon} {Math.abs(changePercent).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-24 items-end justify-between gap-1">
          {data.map((point, index) => {
            const height = maxValue > 0 ? (Math.abs(point.value) / maxValue) * 100 : 0
            const isPositive = point.value >= 0

            return (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full">
                  <div
                    className={`w-full rounded-t transition-all ${isPositive ? "bg-red-500/60" : "bg-green-500/60"}`}
                    style={{ height: `${height}%`, minHeight: height > 0 ? "4px" : "0" }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{point.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
