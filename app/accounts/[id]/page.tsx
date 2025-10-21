"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountForm } from "@/components/account-form"
import { getAccountById, saveAccount } from "@/lib/storage"
import type { Account } from "@/lib/types"

export default function EditAccountPage() {
  const router = useRouter()
  const params = useParams()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const foundAccount = getAccountById(id)

    if (foundAccount) {
      setAccount(foundAccount)
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [params.id, router])

  const handleSubmit = (updatedAccount: Account) => {
    saveAccount(updatedAccount)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!account) {
    return null
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">返回</span>
          </Button>
          <h1 className="text-lg font-semibold">编辑账号</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4">
        <AccountForm account={account} onSubmit={handleSubmit} onCancel={() => router.back()} />
      </main>
    </div>
  )
}
