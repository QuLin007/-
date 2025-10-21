// Web scraping utilities for importing account data from platform URLs
// This is a simplified implementation that demonstrates the concept

export interface ScrapedAccountData {
  name: string
  followerCount: number
  totalPosts: number
  platformUrl: string
}

// Mock scraper function - in production, this would use a server-side API
export async function scrapeAccountData(url: string): Promise<ScrapedAccountData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Detect platform from URL
  const platform = detectPlatform(url)

  // Mock data based on platform
  // In production, this would make a server-side request to scrape real data
  const mockData: Record<string, ScrapedAccountData> = {
    douyin: {
      name: "抖音账号示例",
      followerCount: Math.floor(Math.random() * 500000) + 50000,
      totalPosts: Math.floor(Math.random() * 200) + 50,
      platformUrl: url,
    },
    bilibili: {
      name: "B站账号示例",
      followerCount: Math.floor(Math.random() * 300000) + 30000,
      totalPosts: Math.floor(Math.random() * 150) + 30,
      platformUrl: url,
    },
    xiaohongshu: {
      name: "小红书账号示例",
      followerCount: Math.floor(Math.random() * 200000) + 20000,
      totalPosts: Math.floor(Math.random() * 100) + 20,
      platformUrl: url,
    },
    default: {
      name: "导入的账号",
      followerCount: Math.floor(Math.random() * 100000) + 10000,
      totalPosts: Math.floor(Math.random() * 80) + 10,
      platformUrl: url,
    },
  }

  return mockData[platform] || mockData.default
}

function detectPlatform(url: string): string {
  if (url.includes("douyin.com") || url.includes("tiktok.com")) {
    return "douyin"
  }
  if (url.includes("bilibili.com")) {
    return "bilibili"
  }
  if (url.includes("xiaohongshu.com") || url.includes("xhs.com")) {
    return "xiaohongshu"
  }
  return "default"
}

// Validate if URL is a supported platform
export function isSupportedPlatform(url: string): boolean {
  const supportedDomains = [
    "douyin.com",
    "tiktok.com",
    "bilibili.com",
    "xiaohongshu.com",
    "xhs.com",
    "kuaishou.com",
    "weibo.com",
  ]

  try {
    const urlObj = new URL(url)
    return supportedDomains.some((domain) => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

// Get platform name from URL
export function getPlatformName(url: string): string {
  if (url.includes("douyin.com")) return "抖音"
  if (url.includes("tiktok.com")) return "TikTok"
  if (url.includes("bilibili.com")) return "哔哩哔哩"
  if (url.includes("xiaohongshu.com") || url.includes("xhs.com")) return "小红书"
  if (url.includes("kuaishou.com")) return "快手"
  if (url.includes("weibo.com")) return "微博"
  return "未知平台"
}
