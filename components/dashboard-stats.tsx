import { Card, CardContent } from "@/components/ui/card"
import type { DashboardStats as DashboardStatsType } from "@/lib/types"

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">管理账号</p>
            <p className="text-2xl font-bold">{stats.totalAccounts}</p>
            <p className="text-xs text-muted-foreground">{stats.activeAccounts} 个活跃</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">累计作品</p>
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
            <p className="text-xs text-muted-foreground">{stats.totalFollowers.toLocaleString()} 粉丝</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">待定选题</p>
            <p className="text-2xl font-bold">{stats.pendingIdeas}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">排期选题</p>
            <p className="text-2xl font-bold">{stats.scheduledIdeas}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
