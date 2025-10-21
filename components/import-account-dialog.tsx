"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { scrapeAccountData, isSupportedPlatform, getPlatformName } from "@/lib/scraper"
import type { ScrapedAccountData } from "@/lib/scraper"

interface ImportAccountDialogProps {
  onImport: (data: ScrapedAccountData) => void
  trigger?: React.ReactNode
}

export function ImportAccountDialog({ onImport, trigger }: ImportAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [scrapedData, setScrapedData] = useState<ScrapedAccountData | null>(null)

  const handleScrape = async () => {
    setError("")
    setScrapedData(null)

    if (!url) {
      setError("请输入平台主页链接")
      return
    }

    if (!isSupportedPlatform(url)) {
      setError("暂不支持该平台，请手动添加账号")
      return
    }

    setLoading(true)

    try {
      const data = await scrapeAccountData(url)
      setScrapedData(data)
    } catch (err) {
      setError("抓取数据失败，请检查链接是否正确或稍后重试")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = () => {
    if (scrapedData) {
      onImport(scrapedData)
      setOpen(false)
      setUrl("")
      setScrapedData(null)
      setError("")
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setUrl("")
    setScrapedData(null)
    setError("")
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导入账号
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>导入账号数据</DialogTitle>
          <DialogDescription>输入平台主页链接，自动抓取账号数据</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform-url">平台主页链接</Label>
            <Input
              id="platform-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">支持：抖音、TikTok、B站、小红书、快手、微博</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {scrapedData && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">数据抓取成功</p>
                  <p className="text-sm">
                    账号名称：{scrapedData.name}
                    <br />
                    粉丝数：{scrapedData.followerCount.toLocaleString()}
                    <br />
                    作品数：{scrapedData.totalPosts}
                    <br />
                    平台：{getPlatformName(scrapedData.platformUrl)}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {!scrapedData ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                取消
              </Button>
              <Button onClick={handleScrape} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "抓取中..." : "开始抓取"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleImport}>确认导入</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
