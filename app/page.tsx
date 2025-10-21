"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AccountCard } from "@/components/account-card"
import { DashboardStats } from "@/components/dashboard-stats"
import { ImportAccountDialog } from "@/components/import-account-dialog"
import { getAccounts, deleteAccount, getIdeas, saveAccount } from "@/lib/storage"
import { mockAccounts, mockIdeas } from "@/lib/mock-data"
import type { Account, DashboardStats as Stats } from "@/lib/types"
import type { ScrapedAccountData } from "@/lib/scraper"

export default function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<Stats>({
    totalAccounts: 0,
    activeAccounts: 0,
    totalPosts: 0,
    totalFollowers: 0,
    pendingIdeas: 0,
    scheduledIdeas: 0,
  })

  useEffect(() => {
    // Load accounts from storage or use mock data
    let loadedAccounts = getAccounts()
    if (loadedAccounts.length === 0) {
      // Initialize with mock data on first load
      mockAccounts.forEach((account) => {
        localStorage.setItem("craftkit_accounts", JSON.stringify(mockAccounts))
      })
      mockIdeas.forEach((idea) => {
        localStorage.setItem("craftkit_ideas", JSON.stringify(mockIdeas))
      })
      loadedAccounts = mockAccounts
    }
    setAccounts(loadedAccounts)

    // Calculate stats
    const ideas = getIdeas()
    const totalFollowers = loadedAccounts.reduce((sum, acc) => sum + acc.followerCount, 0)
    const totalPosts = loadedAccounts.reduce((sum, acc) => sum + acc.totalPosts, 0)
    const activeAccounts = loadedAccounts.filter((acc) => acc.status === "active").length
    const pendingIdeas = ideas.filter((idea) => idea.status === "pending").length
    const scheduledIdeas = ideas.filter((idea) => idea.status === "scheduled").length

    setStats({
      totalAccounts: loadedAccounts.length,
      activeAccounts,
      totalPosts,
      totalFollowers,
      pendingIdeas,
      scheduledIdeas,
    })
  }, [])

  const handleDeleteAccount = (id: string) => {
    if (confirm("确定要删除这个账号吗？")) {
      deleteAccount(id)
      setAccounts(accounts.filter((acc) => acc.id !== id))
    }
  }

  const handleImportAccount = (scrapedData: ScrapedAccountData) => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: scrapedData.name,
      platformUrl: scrapedData.platformUrl,
      followerCount: scrapedData.followerCount,
      totalPosts: scrapedData.totalPosts,
      weeklyFollowerGrowth: 0,
      weeklyLikeGrowth: 0,
      dailyFollowerGrowth: 0,
      dailyLikeGrowth: 0,
      persona: {
        personality: "",
        industry: "",
        appearance: "",
        catchphrase: "",
        updateFrequency: "待设置",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
    }

    saveAccount(newAccount)
    setAccounts([...accounts, newAccount])

    // Redirect to edit persona
    setTimeout(() => {
      window.location.href = `/accounts/${newAccount.id}`
    }, 500)
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-bold">CraftKit</h1>
          <div className="flex gap-2">
            <ImportAccountDialog onImport={handleImportAccount} />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/accounts/new">
                <Plus className="mr-2 h-4 w-4" />
                手动添加
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="space-y-6 p-4">
        {/* Global stats */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">数据概览</h2>
          <DashboardStats stats={stats} />
        </section>

        {/* Account cards */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">我的账号</h2>
          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-12 text-center">
              <p className="mb-4 text-sm text-muted-foreground">还没有添加账号</p>
              <div className="flex gap-2">
                <ImportAccountDialog
                  onImport={handleImportAccount}
                  trigger={
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      导入账号
                    </Button>
                  }
                />
                <Button variant="outline" asChild>
                  <Link href="/accounts/new">手动添加</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => {
                    window.location.href = `/accounts/${account.id}`
                  }}
                  onDelete={() => handleDeleteAccount(account.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
