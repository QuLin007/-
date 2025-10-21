"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IdeaItem } from "@/components/idea-item"
import { getIdeas, getAccounts, updateIdeaStatus, deleteIdea } from "@/lib/storage"
import type { ContentIdea, IdeaStatus } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IdeasPage() {
  const searchParams = useSearchParams()
  const accountFilter = searchParams.get("account")

  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<ContentIdea[]>([])
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "all">("all")
  const [accounts, setAccounts] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const loadedIdeas = getIdeas()
    const loadedAccounts = getAccounts()

    const accountMap = new Map(loadedAccounts.map((acc) => [acc.id, acc.name]))
    setAccounts(accountMap)

    let filtered = loadedIdeas

    // Filter by account if specified
    if (accountFilter) {
      filtered = filtered.filter((idea) => idea.accountId === accountFilter)
    }

    setIdeas(filtered)
    setFilteredIdeas(filtered)
  }, [accountFilter])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredIdeas(ideas)
    } else {
      setFilteredIdeas(ideas.filter((idea) => idea.status === statusFilter))
    }
  }, [statusFilter, ideas])

  const handleStatusChange = (id: string, status: IdeaStatus) => {
    updateIdeaStatus(id, status)
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, status, updatedAt: new Date().toISOString() } : idea)))
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个选题吗？")) {
      deleteIdea(id)
      setIdeas(ideas.filter((idea) => idea.id !== id))
    }
  }

  const handleEdit = (id: string) => {
    window.location.href = `/ideas/${id}`
  }

  const statusCounts = {
    all: ideas.length,
    pending: ideas.filter((i) => i.status === "pending").length,
    scheduled: ideas.filter((i) => i.status === "scheduled").length,
    "in-production": ideas.filter((i) => i.status === "in-production").length,
    published: ideas.filter((i) => i.status === "published").length,
    abandoned: ideas.filter((i) => i.status === "abandoned").length,
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-bold">选题库</h1>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ideas/new">
              <Plus className="mr-2 h-4 w-4" />
              新建选题
            </Link>
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border/50 bg-background p-4">
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as IdeaStatus | "all")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部 ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">待定 ({statusCounts.pending})</TabsTrigger>
            <TabsTrigger value="scheduled">排期 ({statusCounts.scheduled})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as IdeaStatus | "all")}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="in-production">制作中 ({statusCounts["in-production"]})</TabsTrigger>
            <TabsTrigger value="published">已发布 ({statusCounts.published})</TabsTrigger>
            <TabsTrigger value="abandoned">已放弃 ({statusCounts.abandoned})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <main className="space-y-3 p-4">
        {filteredIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-12 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {statusFilter === "all" ? "还没有添加选题" : `没有${statusFilter}状态的选题`}
            </p>
            <Button asChild>
              <Link href="/ideas/new">
                <Plus className="mr-2 h-4 w-4" />
                创建第一个选题
              </Link>
            </Button>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <IdeaItem
              key={idea.id}
              idea={idea}
              accountName={accounts.get(idea.accountId)}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </main>
    </div>
  )
}
