"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContentIdea, IdeaStatus } from "@/lib/types"
import { getAccounts } from "@/lib/storage"

interface IdeaFormProps {
  idea?: ContentIdea
  defaultAccountId?: string
  onSubmit: (idea: ContentIdea) => void
  onCancel?: () => void
}

export function IdeaForm({ idea, defaultAccountId, onSubmit, onCancel }: IdeaFormProps) {
  const [accounts, setAccounts] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    accountId: idea?.accountId || defaultAccountId || "",
    title: idea?.title || "",
    description: idea?.description || "",
    scriptDraft: idea?.scriptDraft || "",
    scriptLink: idea?.scriptLink || "",
    status: (idea?.status || "pending") as IdeaStatus,
  })

  useEffect(() => {
    const loadedAccounts = getAccounts()
    setAccounts(loadedAccounts.map((acc) => ({ id: acc.id, name: acc.name })))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newIdea: ContentIdea = {
      id: idea?.id || crypto.randomUUID(),
      accountId: formData.accountId,
      title: formData.title,
      description: formData.description || undefined,
      scriptDraft: formData.scriptDraft || undefined,
      scriptLink: formData.scriptLink || undefined,
      status: formData.status,
      createdAt: idea?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: idea?.publishedAt,
    }

    onSubmit(newIdea)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>选题信息</CardTitle>
          <CardDescription>记录你的内容创意和灵感</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">所属账号 *</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
            >
              <SelectTrigger id="accountId">
                <SelectValue placeholder="选择账号" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">选题标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例如：iPhone 16 Pro 深度评测"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">选题描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简要描述这个选题的内容和亮点"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">当前状态</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as IdeaStatus })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">待定</SelectItem>
                <SelectItem value="scheduled">排期中</SelectItem>
                <SelectItem value="in-production">制作中</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="abandoned">已放弃</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>脚本内容</CardTitle>
          <CardDescription>记录脚本草稿或链接</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scriptDraft">脚本草稿</Label>
            <Textarea
              id="scriptDraft"
              value={formData.scriptDraft}
              onChange={(e) => setFormData({ ...formData, scriptDraft: e.target.value })}
              placeholder="在这里记录脚本的初步想法..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scriptLink">脚本链接</Label>
            <Input
              id="scriptLink"
              type="url"
              value={formData.scriptLink}
              onChange={(e) => setFormData({ ...formData, scriptLink: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {idea ? "保存修改" : "创建选题"}
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
