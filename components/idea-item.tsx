"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreVertical, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ContentIdea, IdeaStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface IdeaItemProps {
  idea: ContentIdea
  accountName?: string
  onStatusChange: (id: string, status: IdeaStatus) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<
  IdeaStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  pending: { label: "待定", variant: "secondary" },
  scheduled: { label: "排期中", variant: "default" },
  "in-production": { label: "制作中", variant: "outline" },
  published: { label: "已发布", variant: "default" },
  abandoned: { label: "已放弃", variant: "destructive" },
}

export function IdeaItem({ idea, accountName, onStatusChange, onEdit, onDelete }: IdeaItemProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showActions, setShowActions] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - show actions
      setShowActions(true)
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right - hide actions
      setShowActions(false)
    }
  }

  const config = statusConfig[idea.status]

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn("transition-transform duration-200", showActions && "-translate-x-24")}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className="border-border/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <Badge variant={config.variant} className="shrink-0">
                  {config.label}
                </Badge>
                {accountName && <span className="text-xs text-muted-foreground">{accountName}</span>}
              </div>
              <h3 className="font-medium leading-tight">{idea.title}</h3>
              {idea.description && <p className="text-sm text-muted-foreground">{idea.description}</p>}
              {idea.scriptDraft && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">脚本草稿：</span>
                  {idea.scriptDraft}
                </p>
              )}
              {idea.scriptLink && (
                <a
                  href={idea.scriptLink}
                  className="text-xs text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看脚本链接
                </a>
              )}
              <p className="text-xs text-muted-foreground">
                创建于 {new Date(idea.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">更多选项</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(idea.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(idea.id, "pending")}>标记为待定</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(idea.id, "scheduled")}>标记为排期中</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(idea.id, "in-production")}>
                  标记为制作中
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(idea.id, "published")}>标记为已发布</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(idea.id, "abandoned")}>标记为已放弃</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(idea.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>

      {/* Swipe action buttons */}
      {showActions && (
        <div className="absolute right-0 top-0 flex h-full items-center gap-1 pr-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(idea.id)} className="h-16">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(idea.id)} className="h-16">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
