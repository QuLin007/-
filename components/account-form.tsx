"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/lib/types"

interface AccountFormProps {
  account?: Account
  onSubmit: (account: Account) => void
  onCancel?: () => void
}

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: account?.name || "",
    platformUrl: account?.platformUrl || "",
    followerCount: account?.followerCount || 0,
    totalPosts: account?.totalPosts || 0,
    personality: account?.persona.personality || "",
    industry: account?.persona.industry || "",
    appearance: account?.persona.appearance || "",
    catchphrase: account?.persona.catchphrase || "",
    updateFrequency: account?.persona.updateFrequency || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newAccount: Account = {
      id: account?.id || crypto.randomUUID(),
      name: formData.name,
      platformUrl: formData.platformUrl,
      followerCount: formData.followerCount,
      totalPosts: formData.totalPosts,
      weeklyFollowerGrowth: account?.weeklyFollowerGrowth || 0,
      weeklyLikeGrowth: account?.weeklyLikeGrowth || 0,
      dailyFollowerGrowth: account?.dailyFollowerGrowth || 0,
      dailyLikeGrowth: account?.dailyLikeGrowth || 0,
      persona: {
        personality: formData.personality,
        industry: formData.industry,
        appearance: formData.appearance,
        catchphrase: formData.catchphrase,
        updateFrequency: formData.updateFrequency,
      },
      createdAt: account?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: account?.status || "active",
    }

    onSubmit(newAccount)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>账号的基础数据和平台信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">账号名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：科技评测官"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformUrl">平台主页链接</Label>
            <Input
              id="platformUrl"
              type="url"
              value={formData.platformUrl}
              onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">可用于自动抓取数据（功能开发中）</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="followerCount">粉丝数</Label>
              <Input
                id="followerCount"
                type="number"
                value={formData.followerCount}
                onChange={(e) => setFormData({ ...formData, followerCount: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPosts">作品数</Label>
              <Input
                id="totalPosts"
                type="number"
                value={formData.totalPosts}
                onChange={(e) => setFormData({ ...formData, totalPosts: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Persona Info */}
      <Card>
        <CardHeader>
          <CardTitle>人设档案</CardTitle>
          <CardDescription>定义账号的内容风格和人设特征</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personality">性格特点</Label>
            <Input
              id="personality"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              placeholder="例如：专业、客观、幽默"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">行业领域</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="例如：科技数码"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appearance">外形特征</Label>
            <Input
              id="appearance"
              value={formData.appearance}
              onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
              placeholder="例如：年轻男性，休闲装"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catchphrase">口头禅</Label>
            <Input
              id="catchphrase"
              value={formData.catchphrase}
              onChange={(e) => setFormData({ ...formData, catchphrase: e.target.value })}
              placeholder="例如：让我们来看看真相"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateFrequency">更新频率 *</Label>
            <Input
              id="updateFrequency"
              value={formData.updateFrequency}
              onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
              placeholder="例如：每周3次"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {account ? "保存修改" : "创建账号"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  )
}
