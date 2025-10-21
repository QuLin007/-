"use client"

import { Home, Lightbulb, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
            pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span>概览</span>
        </Link>

        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
          asChild
        >
          <Link href="/ideas/new">
            <Plus className="h-6 w-6" />
            <span className="sr-only">快速记录</span>
          </Link>
        </Button>

        <Link
          href="/ideas"
          className={cn(
            "flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
            pathname === "/ideas" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Lightbulb className="h-5 w-5" />
          <span>选题库</span>
        </Link>
      </div>
    </nav>
  )
}
