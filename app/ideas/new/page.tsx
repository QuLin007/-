"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IdeaForm } from "@/components/idea-form"
import { saveIdea } from "@/lib/storage"
import type { ContentIdea } from "@/lib/types"

export default function NewIdeaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultAccountId = searchParams.get("account") || undefined

  const handleSubmit = (idea: ContentIdea) => {
    saveIdea(idea)
    router.push("/ideas")
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
          <h1 className="text-lg font-semibold">新建选题</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4">
        <IdeaForm defaultAccountId={defaultAccountId} onSubmit={handleSubmit} onCancel={() => router.back()} />
      </main>
    </div>
  )
}
